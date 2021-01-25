import { Attachment, TextChannel } from '@klasa/core';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { PermissionLevels } from '@lib/types/Enums';
import { ApplyOptions } from '@skyra/decorators';
import type { KlasaMessage } from 'klasa';

@ApplyOptions<ArchAngelCommandOptions>({
	aliases: ['talk'],
	description: (language) => language.tget('COMMAND_ECHO_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_ECHO_EXTENDED'),
	guarded: true,
	permissionLevel: PermissionLevels.BotOwner,
	usage: '[channel:channel] [message:...string]',
	usageDelim: ' '
})
export default class extends ArchAngelCommand {
	public async run(message: KlasaMessage, [channel = message.channel as TextChannel, content]: [TextChannel, string]) {
		if (message.deletable) message.nuke().catch(() => null);

		const attachment = message.attachments.size ? message.attachments.firstValue : null;

		if (!content.length && !attachment) {
			throw 'I have no content nor attachment to send, please write something.';
		}

		await channel.send(async (mb) => {
			mb.setContent(content);
			if (attachment) mb.addFile(await new Attachment().setName(attachment.filename).setFile(attachment.url).resolve());

			return mb;
		});
		if (channel !== message.channel) await message.reply((mb) => mb.setContent(`Message successfully sent to ${channel}`));

		return message;
	}
}
