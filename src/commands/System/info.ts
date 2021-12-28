import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, MessageCommand } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<Command.Options>({
	aliases: ['details', 'what'],
	description: 'Provides some information about this bot.'
})
export class UserCommand extends Command {
	public async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		return interaction.reply({
			content: this.content,
			ephemeral: true
		});
	}

	public async messageRun(...[message]: Parameters<MessageCommand['messageRun']>) {
		return send(message, { content: this.content });
	}

	private get content() {
		return [
			`ArchAngel is a private discord bot for Populous Gaming.`,
			'This bot uses the Sapphire Framework build on top of discord.js.',
			'',
			'ArchAngel features:',
			'• Quoting messages in a rich and awesome way.',
			'And more!'
		].join('\n');
	}
}
