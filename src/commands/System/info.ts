import { ArchAngelCommand } from '#lib/extensions/ArchAngelCommand';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<ArchAngelCommand.Options>({
	aliases: ['details', 'what'],
	description: 'Provides some information about this bot.'
})
export class UserCommand extends ArchAngelCommand {
	public async run(message: Message) {
		return message.send(
			[
				`ArchAngel is a private discord bot for Populous Gaming.`,
				'This bot uses the Klasa framework build on top of the @klasa/core library.',
				'',
				'ArchAngel features:',
				'• Quoting messages in a rich and awesome way.',
				'And more!'
			].join('\n')
		);
	}
}
