import { Attachment, TextChannel } from '@klasa/core';
import { APIUserFlags } from '@klasa/dapi-types';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { PermissionLevels } from '@lib/types/Enums';
import { ApplyOptions, CreateResolvers } from '@skyra/decorators';
import { discordMessageGenerator, discordMessagesGenerator, htmlGenerator } from '@utils/HtmlGenerator';
import { KlasaMessage } from 'klasa';
import imageGenerator from 'node-html-to-image';

@ApplyOptions<ArchAngelCommandOptions>({
	description: (language) => language.tget('COMMAND_QUOTE_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_QUOTE_EXTENDED'),
	permissionLevel: PermissionLevels.Everyone,
	usage: '[channel:channel] [messageIds:messageIds]',
	usageDelim: ' '
})
@CreateResolvers([
	[
		'channel',
		(arg, _possible, message) => {
			if (!arg) return message.channel;
			return message.client.arguments.get('textchannelname')!.run(arg, _possible, message);
		}
	],
	[
		'messageIds',
		(arg, _possible, message) => {
			if (!arg) {
				const lastMessage = message.channel.messages.lastValue;
				if (lastMessage) return [lastMessage];
				throw message.language.tget('RESOLVER_INVALID_MESSAGE', arg);
			}

			return message.client.arguments.get('...message')!.run(arg, _possible, message);
		}
	]
])
export default class extends ArchAngelCommand {
	public async run(message: KlasaMessage, [channel, quoteMessages]: [TextChannel, KlasaMessage[]]) {
		const content: string[] = [];

		for (const quoteMessage of quoteMessages) {
			content.push(await this.messageToHtml(message.channel as TextChannel, quoteMessage.id));
		}

		const html = htmlGenerator(
			discordMessagesGenerator({
				content: content.join('\n')
			})
		);

		const buffer = await imageGenerator({ html });

		return channel.send(async (mb) =>
			mb.addFile(
				await new Attachment()
					.setName('quote.png')
					.setFile(buffer as Buffer)
					.resolve()
			)
		);
	}

	private async messageToHtml(channel: TextChannel, messageId: string): Promise<string> {
		const message = (await channel.messages.fetch({ around: messageId, limit: 1 })).firstValue!;
		const roleColor = message.member?.roles.highest?.color;

		return discordMessageGenerator({
			author: message.member?.displayName ?? message.author.tag,
			avatar: message.author.displayAvatarURL({ dynamic: true, extension: 'png', size: 128 })!,
			bot: message.author.bot,
			verified: message.author.flags === APIUserFlags.VerifiedBot,
			edited: Boolean(message.editedAt),
			roleColor: roleColor?.toString(16) ?? '#259EEE',
			content: message.content,
			timestamp: message.createdAt
		});
	}
}
