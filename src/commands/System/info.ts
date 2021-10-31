import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	aliases: ['details', 'what'],
	description: 'Provides some information about this bot.'
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		return send(
			message,
			[
				`ArchAngel is a private discord bot for Populous Gaming.`,
				'This bot uses the Sapphire Framework build on top of discord.js.',
				'',
				'ArchAngel features:',
				'• Quoting messages in a rich and awesome way.',
				'And more!'
			].join('\n')
		);
	}
}
