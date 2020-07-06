import { Attachment } from '@klasa/core';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { PermissionLevels } from '@lib/types/Enums';
import { ApplyOptions } from '@skyra/decorators';
import { discordMessageGenerator, discordMessagesGenerator, htmlGenerator } from '@utils/HtmlGenerator';
import { KlasaMessage } from 'klasa';
import imageGenerator from 'node-html-to-image';

@ApplyOptions<ArchAngelCommandOptions>({
	description: (language) => language.tget('COMMAND_SAMPLE_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_SAMPLE_EXTENDED'),
	guarded: true,
	permissionLevel: PermissionLevels.BotOwner,
	usage: '[content:string]',
	usageDelim: ' '
})
export default class extends ArchAngelCommand {
	public async run(message: KlasaMessage, [content]: [string]) {
		const html = htmlGenerator(
			discordMessagesGenerator({
				content: discordMessageGenerator({
					content: content ?? message.content,
					author: message.member?.displayName ?? message.author.tag,
					avatar: message.author.displayAvatarURL({ dynamic: true, extension: 'png', size: 128 })!,
					bot: false,
					edited: false,
					verified: false
				})
			})
		);

		const buffer = await imageGenerator({ html });

		return message.channel.send(async (mb) =>
			mb.setContent("Here's your image:").addFile(
				await new Attachment()
					.setName('sample.png')
					.setFile(buffer as Buffer)
					.resolve()
			)
		);
	}
}
