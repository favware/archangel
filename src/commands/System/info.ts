import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Provides some information about this bot.',
	chatInputCommand: {
		register: true,
		guildIds: getGuildIds(),
		idHints: ['925521429770960917', '925592925340049478']
	}
})
export class UserCommand extends Command {
	public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		return interaction.reply({
			content: this.content,
			ephemeral: true
		});
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
