import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, MessageCommand } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<ChatInputCommand.Options>({
	aliases: ['details', 'what'],
	description: 'Provides some information about this bot.',
	chatInputCommand: {
		register: true,
		guildIds: getGuildIds(),
		idHints: ['925521429770960917']
	}
})
export class UserCommand extends Command {
	public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		return interaction.reply({
			content: this.content,
			ephemeral: true
		});
	}

	public override async messageRun(...[message]: Parameters<MessageCommand['messageRun']>) {
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
