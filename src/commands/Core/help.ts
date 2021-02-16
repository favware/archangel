import { ArchAngelCommand } from '#lib/extensions/ArchAngelCommand';
import { Emojis } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Store } from '@sapphire/framework';
import { Collection, Message } from 'discord.js';

/**
 * Sorts a collection alphabetically as based on the keys, rather than the values.
 * This is used to ensure that subcategories are listed in the pages right after the main category.
 * @param _ The first element for comparison
 * @param __ The second element for comparison
 * @param firstCategory Key of the first element for comparison
 * @param secondCategory Key of the second element for comparison
 */
function sortCommandsAlphabetically(_: ArchAngelCommand[], __: ArchAngelCommand[], firstCategory: string, secondCategory: string): 1 | -1 | 0 {
	if (firstCategory > secondCategory) return 1;
	if (secondCategory > firstCategory) return -1;
	return 0;
}

@ApplyOptions<ArchAngelCommand.Options>({
	aliases: ['commands', 'cmd', 'cmds'],
	description: 'Displays all commands or the description of one.',
	strategyOptions: { flags: ['cat', 'categories', 'all'] }
})
export class UserCommand extends ArchAngelCommand {
	public async run(message: Message, _: ArchAngelCommand.Args, context: ArchAngelCommand.Context) {
		return this.all(message, context);
	}

	private async all(message: Message, context: ArchAngelCommand.Context) {
		const content = await this.buildHelp(message, context.commandPrefix);
		try {
			const response = await message.author.send(content, { split: { char: '\n' } });
			return message.channel.type === 'dm'
				? response
				: await message.send('📥 | The list of commands you have access to has been sent to your DMs.');
		} catch {
			return message.channel.type === 'dm'
				? null
				: message.send(`${Emojis.RedCross} | You have DMs disabled so I couldn't send you the list of commands.`);
		}
	}

	private async buildHelp(message: Message, prefix: string) {
		const commands = await UserCommand.fetchCommands(message);

		const helpMessage: string[] = [];
		for (const [category, list] of commands) {
			helpMessage.push(`**${category} Commands**:\n`, list.map(this.formatCommand.bind(this, prefix, false)).join('\n'), '');
		}

		return helpMessage.join('\n');
	}

	private formatCommand(prefix: string, paginatedMessage: boolean, command: ArchAngelCommand) {
		const { description } = command;
		return paginatedMessage ? `• ${prefix}${command.name} → ${description}` : `• **${prefix}${command.name}** → ${description}`;
	}

	private static async fetchCommands(message: Message) {
		const commands = Store.injectedContext.stores.get('commands');
		const filtered = new Collection<string, ArchAngelCommand[]>();
		await Promise.all(
			commands.map(async (cmd) => {
				const command = cmd as ArchAngelCommand;

				const result = await cmd.preconditions.run(message, command, { command: null! });
				if (!result.success) return;

				const category = filtered.get(command.fullCategory.join(' → '));
				if (category) category.push(command);
				else filtered.set(command.fullCategory.join(' → '), [command as ArchAngelCommand]);
			})
		);

		return filtered.sort(sortCommandsAlphabetically);
	}
}
