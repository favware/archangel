import type { Message } from '@klasa/core';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { ApplyOptions } from '@skyra/decorators';

@ApplyOptions<ArchAngelCommandOptions>({
	aliases: ['details', 'what'],
	guarded: true,
	description: (language) => language.get('COMMAND_INFO_DESCRIPTION')
})
export default class extends ArchAngelCommand {
	public async run(message: Message): Promise<Message[]> {
		return message.replyLocale('COMMAND_INFO');
	}
}
