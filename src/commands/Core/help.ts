import { BrandingColors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Collection, Message, MessageEmbed } from 'discord.js';

/**
 * Sorts a collection alphabetically as based on the keys, rather than the values.
 * This is used to ensure that subcategories are listed in the pages right after the main category.
 * @param _ The first element for comparison
 * @param __ The second element for comparison
 * @param firstCategory Key of the first element for comparison
 * @param secondCategory Key of the second element for comparison
 */
function sortCommandsAlphabetically(_: Command[], __: Command[], firstCategory: string, secondCategory: string): 1 | -1 | 0 {
	if (firstCategory > secondCategory) return 1;
	if (secondCategory > firstCategory) return -1;
	return 0;
}

@ApplyOptions<Command.Options>({
	aliases: ['commands', 'cmd', 'cmds'],
	description: 'Displays all commands or the description of one.',
	flags: ['cat', 'categories', 'all']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, _: Args, context: Command.RunContext) {
		return this.all(message, context);
	}

	private async all(message: Message, context: Command.RunContext) {
		const content = await this.buildHelp(message, context.commandPrefix);
		return send(message, { embeds: [new MessageEmbed().setDescription(content).setColor(BrandingColors.Primary)] });
	}

	private async buildHelp(message: Message, prefix: string) {
		const commands = await UserCommand.fetchCommands(message);

		const helpMessage: string[] = [];
		for (const [category, list] of commands) {
			helpMessage.push(`**${category} Commands**:\n`, list.map(this.formatCommand.bind(this, prefix)).join('\n'), '');
		}

		return helpMessage.join('\n');
	}

	private formatCommand(prefix: string, command: Command) {
		const { description } = command;
		return `• **${prefix}${command.name}** → ${description}`;
	}

	private static async fetchCommands(message: Message) {
		const commands = container.stores.get('commands');
		const filtered = new Collection<string, Command[]>();
		await Promise.all(
			commands.map(async (cmd) => {
				const command = cmd as Command;

				const result = await cmd.preconditions.run(message, command, { command: null! });
				if (!result.success) return;

				const category = filtered.get(command.fullCategory.join(' → '));
				if (category) category.push(command);
				else filtered.set(command.fullCategory.join(' → '), [command as Command]);
			})
		);

		return filtered.sort(sortCommandsAlphabetically);
	}
}
