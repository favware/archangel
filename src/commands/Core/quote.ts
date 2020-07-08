import { Attachment, TextChannel } from '@klasa/core';
import { APIUserFlags } from '@klasa/dapi-types';
import { Timestamp } from '@klasa/timestamp';
import { isThenable } from '@klasa/utils';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { PermissionLevels } from '@lib/types/Enums';
import { ApplyOptions } from '@skyra/decorators';
import { BrandingColors } from '@utils/constants';
import { discordMessageGenerator, discordMessagesGenerator, htmlGenerator } from '@utils/HtmlGenerator';
import { getAttachment } from '@utils/util';
import { KlasaMessage, Possible } from 'klasa';
import imageGenerator from 'node-html-to-image';

@ApplyOptions<ArchAngelCommandOptions>({
	description: (language) => language.tget('COMMAND_QUOTE_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_QUOTE_EXTENDED'),
	permissionLevel: PermissionLevels.Everyone,
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
			content.push(await this.messageToHtml(quoteMessage, message));
		}

		// Generate the HTML
		const html = htmlGenerator(
			discordMessagesGenerator({
				content: content.join('\n')
			})
		);

		// Generate the image
		const buffer = await imageGenerator({ html });

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

	private async messageToHtml(message: KlasaMessage, commandMessage: KlasaMessage): Promise<string> {
		const member = commandMessage.guild!.members.get(message.author.id);
		const attachment = getAttachment(message);

		return discordMessageGenerator({
			author: member?.displayName ?? message.author.tag,
			avatar: message.author.displayAvatarURL({ dynamic: false, extension: 'png', size: 128 })!,
			bot: message.author.bot,
			verified: message.author.publicFlags === APIUserFlags.VerifiedBot,
			edited: Boolean(message.editedAt),
			roleColor: `#${member?.roles.highest?.color?.toString(16)}` ?? '#259EEE',
			content: message.content,
			timestamp: this.kTimestamp.display(message.createdAt),
			image: attachment
		});
	}
}
