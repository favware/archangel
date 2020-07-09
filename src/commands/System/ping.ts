import type { Message } from '@klasa/core';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { ApplyOptions } from '@skyra/decorators';

@ApplyOptions<ArchAngelCommandOptions>({
	guarded: true,
	description: (language) => language.get('COMMAND_PING_DESCRIPTION')
})
export default class extends ArchAngelCommand {
	async run(message: Message): Promise<Message[]> {
		const [msg] = await message.replyLocale('COMMAND_PING');
		return message.replyLocale('COMMAND_PINGPONG', [
			(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp),
			Math.round(this.client.ws.ping)
		]);
	}
}
