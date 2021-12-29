import { quoteCache } from '#lib/quoting/quoteCache';
import { BrandingColors } from '#utils/constants';
import { discordMessageGenerator, discordMessagesGenerator, htmlGenerator } from '#utils/HtmlGenerator';
import { getAttachment, getGuildIds, oneLine } from '#utils/util';
import { channelMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { isTextBasedChannel } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, ChatInputCommand, Command } from '@sapphire/framework';
import { Timestamp } from '@sapphire/time-utilities';
import { Guild, GuildBasedChannel, Message, MessageAttachment, TextBasedChannel, UserFlags } from 'discord.js';
import imageGenerator from 'node-html-to-image';

@ApplyOptions<Command.Options>({
	description: 'Quotes one or more messages given the configuration from "Start quote" and "End quote".'
})
export class UserCommand extends Command {
	private readonly timestamp = new Timestamp('MM/DD/YYYY');

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry //
			.registerChatInputCommand(
				(builder) =>
					builder //
						.setName(this.name)
						.setDescription(this.description)
						.addChannelOption((input) =>
							input //
								.setName('output-channel')
								.setDescription('The channel to which the quote should be sent')
								.setRequired(true)
						),
				{ guildIds: getGuildIds(), idHints: ['925552150799601724'] }
			);
	}

	public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		if (interaction.isCommand()) {
			const interactionMemberId = interaction.member!.user.id;

			const quoteCacheForUser = quoteCache.get(interactionMemberId);

			if (!quoteCacheForUser) {
				return interaction.reply({
					content:
						"Looks like you didn't initialise a quote yet using `Start quote` or `End quote` context menu actions. You need to do that before you can quote messages."
				});
			}

			const { startMessage, endMessage } = quoteCacheForUser;

			if (!startMessage) {
				return interaction.reply({
					content:
						"Looks like you didn't set the message at which to start quoting yet using the `Start quote` context menu action. You need to do that before you can quote messages."
				});
			}

			if (startMessage.channelId !== endMessage?.channelId) {
				return interaction.reply({
					content:
						'Looks like set a start message in a different channel as the end message. I cannot determine a proper start and end that way. Please set the message in the same channel.'
				});
			}

			await interaction.deferReply({ ephemeral: true });

			const channelForMessages = await interaction.guild!.channels.fetch(startMessage.channelId);

			if (!channelForMessages) {
				return interaction.editReply({
					content: 'Could not find the channel where the messages are.'
				});
			}

			let messages: Message[] = [];

			if (((channelForMessages as TextBasedChannel).messages.cache.last()?.createdTimestamp ?? 0) < startMessage.createdTimestamp) {
				messages = [
					...(channelForMessages as TextBasedChannel).messages.cache
						.filter(
							({ createdTimestamp }) =>
								createdTimestamp > startMessage.createdTimestamp &&
								(!endMessage.createdTimestamp || createdTimestamp < endMessage.createdTimestamp)
						)
						.values()
				];
			} else {
				const fetchedMessages = await (channelForMessages as TextBasedChannel).messages.fetch({
					limit: 100,
					after: startMessage.id,
					before: endMessage.id
				});

				messages = [...fetchedMessages.values()];

				if (endMessage) {
					messages = messages.filter(({ createdTimestamp }) => createdTimestamp > startMessage.createdTimestamp);
				}
			}

			let messagesWithBoundaries = [startMessage, ...messages, endMessage];

			if (messagesWithBoundaries.length >= 100) {
				return interaction.editReply({
					content:
						'The start and end boundaries of messages to quote that were provided resulted in more than 100 messages, which exceeds the limit. Please adjust your boundaries.'
				});
			}

			messagesWithBoundaries = messagesWithBoundaries.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

			const content: string[] = [];

			// For every quotable message generate the HTML
			for (const quotableMessage of messages) {
				content.push(this.messageToHtml(quotableMessage, interaction.guild!));
			}

			// Generate the HTML
			const html = oneLine(
				htmlGenerator(
					discordMessagesGenerator({
						content: content.join('')
					})
				)
			);

			// Generate the image
			const buffer = (await imageGenerator({
				html,
				puppeteerArgs: {
					args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-translate', '--disable-extensions'],
					ignoreHTTPSErrors: true
				}
			})) as Buffer;

			try {
				const targetChannel = interaction.options.getChannel('output-channel', true) as GuildBasedChannel;
				if (isTextBasedChannel(targetChannel)) {
					await targetChannel.send({ files: [new MessageAttachment(buffer, 'archangel-quote.png')] });

					return interaction.editReply({ content: `Successfully sent the quoted messages to ${channelMention(targetChannel.id)}.` });
				}

				return interaction.editReply({
					content:
						'Sorry, but I was not able to send the quoted messages to the output channel. It appears that you chose a channel that is not a text channel.'
				});
			} catch {
				return interaction.editReply({
					content:
						'Sorry, but I was not able to send the quoted messages to the output channel. Do I have sufficient permissions to send messages to that channel?'
				});
			}
		}
	}

	private messageToHtml(message: Message, guild: Guild): string {
		const member = guild.members.cache.get(message.author.id);
		const attachment = getAttachment(message);

		return discordMessageGenerator({
			author: member?.displayName ?? message.author.tag,
			avatar: message.author.displayAvatarURL({ dynamic: false, format: 'png', size: 128 })!,
			bot: message.author.bot,
			content: message.cleanContent,
			edited: Boolean(message.editedAt),
			highlight: false,
			image: attachment,
			roleColor: member?.displayHexColor ?? `#${BrandingColors.Primary}`,
			server: false,
			timestamp: this.timestamp.display(message.createdAt),
			twentyFour: true,
			verified: message.author.flags?.has(UserFlags.FLAGS.VERIFIED_BOT) ?? false
		});
	}
}
