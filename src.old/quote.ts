import { Attachment, GuildMember, TextChannel } from '@klasa/core';
import { APIUserFlags } from '@klasa/dapi-types';
import { Timestamp } from '@klasa/timestamp';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { isThenable } from '@sapphire/utilities';
import { ApplyOptions } from '@skyra/decorators';
import { BrandingColors } from '@utils/constants';
import { discordMessageGenerator, discordMessagesGenerator, htmlGenerator } from '@utils/HtmlGenerator';
import { getAttachment } from '@utils/util';
import { KlasaMessage, Possible } from 'klasa';
import imageGenerator from 'node-html-to-image';

@ApplyOptions<ArchAngelCommandOptions>({
	description: (language) => language.tget('COMMAND_QUOTE_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_QUOTE_EXTENDED'),
	usage: '[messages:quotablemessages]',
	usageDelim: ' ',
	flagSupport: true
})
export default class extends ArchAngelCommand {
	private readonly kPossible = new Possible([]);
	private readonly kTimestamp = new Timestamp('MM/DD/YYYY');

	public async run(message: KlasaMessage, [messages]: [KlasaMessage[] | undefined]) {
		// Ensure there are quotable messages
		if (!messages || !messages.length) throw message.language.tget('COMMAND_QUOTE_NO_MESSAGES');

		// Send a loading message
		const [loadingMessage] = await message.reply((mb) =>
			mb.setEmbed((embed) => embed.setDescription(message.language.tget('SYSTEM_LOADING')).setColor(BrandingColors.Primary))
		);

		const content: string[] = [];

		// Resolve the target channel
		let targetChannel = Reflect.has(message.flagArgs, 'targetchannel')
			? (this.client.arguments.get('textchannelname')!.run(message.flagArgs.targetchannel, this.kPossible, message) as Promise<TextChannel>)
			: (message.channel as TextChannel);

		// If the targetChannel comes from argument resolve then resolve the promise
		if (isThenable(targetChannel)) targetChannel = await targetChannel;

		// For every quotable message generate the HTML
		for (const quoteMessage of messages) {
			content.push(this.messageToHtml(quoteMessage, message));
		}

		// Generate the HTML
		const html = htmlGenerator(
			discordMessagesGenerator({
				content: content.join('\n')
			})
		);

		// Generate the image
		const buffer = await imageGenerator({
			html,
			puppeteerArgs: { args: ['--no-sandbox', '--disable-setuid-sandbox'], ignoreHTTPSErrors: true }
		});

		// Send the image
		await targetChannel.send(async (mb) =>
			mb.addFile(
				await new Attachment()
					.setName('quote.png')
					.setFile(buffer as Buffer)
					.resolve()
			)
		);

		// Cleanup the loading message
		return loadingMessage.nuke();
	}

	private messageToHtml(message: KlasaMessage, commandMessage: KlasaMessage): string {
		const member = commandMessage.guild!.members.get(message.author.id);
		const attachment = getAttachment(message);

		return discordMessageGenerator({
			author: member?.displayName ?? message.author.tag,
			avatar: message.author.displayAvatarURL({ dynamic: false, extension: 'png', size: 128 })!,
			bot: message.author.bot,
			verified: message.author.publicFlags === APIUserFlags.VerifiedBot,
			edited: Boolean(message.editedAt),
			roleColor: this.getMemberColour(member),
			content: message.content,
			timestamp: this.kTimestamp.display(message.createdAt),
			image: attachment
		});
	}

	private getMemberColour(member?: GuildMember) {
		if (!member || !member.roles.size || !member.roles.highest) return `#${BrandingColors.Primary.toString(16)}`;

		const highestRole = member.roles.highest;
		if (highestRole.color !== 0) return `#${highestRole.color.toString(16)}`;

		let color = 0;
		for (const role of member.roles.values()) {
			if (role.color !== 0) {
				color = role.color;
				break;
			}
		}

		if (color) return `#${color.toString(16)}`;
		return `#${BrandingColors.Primary.toString(16)}`;
	}
}
