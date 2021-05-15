import { ArchAngelCommand } from '#lib/extensions/ArchAngelCommand';
import type { GuildMessage } from '#lib/types/Discord';
import { BrandingColors } from '#utils/constants';
import { discordMessageGenerator, discordMessagesGenerator, htmlGenerator } from '#utils/HtmlGenerator';
import { getAttachment, oneLine, sendLoadingMessage } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Timestamp } from '@sapphire/time-utilities';
import { Message, MessageAttachment, UserFlags } from 'discord.js';
import imageGenerator from 'node-html-to-image';

@ApplyOptions<ArchAngelCommand.Options>({
	description: 'Quotes one or more messages and outputs them in a channel.',
	detailedDescription: [].join('\n'),
	runIn: ['text'],
	strategyOptions: { options: ['inputChannel', 'targetChannel'] }
})
export class UserCommand extends ArchAngelCommand {
	private readonly timestamp = new Timestamp('MM/DD/YYYY');

	public async run(message: GuildMessage, args: ArchAngelCommand.Args) {
		const inputChannel = await args.pick('textChannelName').catch(() => message.channel);
		const targetChannel = await args.pick('textChannelName').catch(() => message.channel);

		const messages = await args.repeat('message', { channel: inputChannel });

		const loadingMessage = await sendLoadingMessage(message);

		const content: string[] = [];

		// For every quotable message generate the HTML
		for (const quotableMessage of messages) {
			content.push(this.messageToHtml(quotableMessage, message));
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

		await targetChannel.send(new MessageAttachment(buffer, 'archangel-quote.png'));

		return loadingMessage.nuke();
	}

	private messageToHtml(message: Message, commandMessage: GuildMessage): string {
		const member = commandMessage.guild!.members.cache.get(message.author.id);
		const attachment = getAttachment(message);

		return discordMessageGenerator({
			author: member?.displayName ?? message.author.tag,
			avatar: message.author.displayAvatarURL({ dynamic: false, format: 'png', size: 128 })!,
			bot: message.author.bot,
			verified: message.author.flags?.has(UserFlags.FLAGS.VERIFIED_BOT) ?? false,
			edited: Boolean(message.editedAt),
			roleColor: member?.displayHexColor ?? `#${BrandingColors.Primary}`,
			content: message.cleanContent,
			timestamp: this.timestamp.display(message.createdAt),
			image: attachment
		});
	}
}
