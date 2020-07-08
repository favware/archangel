import { Cache } from '@klasa/cache';
import { Embed, Message, Permissions, PermissionsFlags, TextChannel } from '@klasa/core';
import { ChannelType } from '@klasa/dapi-types';
import { isFunction, isNumber } from '@klasa/utils';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { UserRichDisplay } from '@lib/structures/UserRichDisplay';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ApplyOptions, CreateResolvers } from '@skyra/decorators';
import { BrandingColors } from '@utils/constants';
import { getColor, noop } from '@utils/util';
import { Command, KlasaMessage } from 'klasa';

const PERMISSIONS_RICHDISPLAY = new Permissions([
	PermissionsFlags.ManageMessages,
	PermissionsFlags.AddReactions,
	PermissionsFlags.EmbedLinks,
	PermissionsFlags.ReadMessageHistory
]);

/**
 * Sorts a collection alphabetically as based on the keys, rather than the values.
 * This is used to ensure that subcategories are listed in the pages right after the main category.
 * @param _ The first element for comparison
 * @param __ The second element for comparison
 * @param firstCategory Key of the first element for comparison
 * @param secondCategory Key of the second element for comparison
 */
function sortCommandsAlphabetically(_: Command[], __: Command[], firstCategory: string | undefined, secondCategory: string | undefined): 1 | -1 | 0 {
	if (firstCategory! > secondCategory!) return 1;
	if (secondCategory! > firstCategory!) return -1;
	return 0;
}

@ApplyOptions<ArchAngelCommandOptions>({
	aliases: ['commands', 'cmd', 'cmds'],
	description: (language) => language.tget('COMMAND_HELP_DESCRIPTION'),
	guarded: true,
	usage: '(Command:command|page:integer|category:category)',
	flagSupport: true
})
@CreateResolvers([
	[
		'command',
		(arg, possible, message) => {
			if (!arg) return undefined;
			return message.client.arguments.get('commandname')!.run(arg, possible, message);
		}
	],
	[
		'category',
		async (arg, _, msg) => {
			if (!arg) return undefined;
			arg = arg.toLowerCase();
			const commandsByCategory = await fetchCommands(msg);
			for (const [page, category] of [...commandsByCategory.keys()].entries()) {
				// Add 1, since 1 will be subtracted later
				if (category.toLowerCase() === arg) return page + 1;
			}
			return undefined;
		}
	]
])
export default class extends ArchAngelCommand {
	public async run(message: KlasaMessage, [commandOrPage]: [Command | number | undefined]) {
		if (message.flagArgs.categories || message.flagArgs.cat) {
			const commandsByCategory = await fetchCommands(message);
			const { language } = message;
			let i = 0;
			const commandCategories: string[] = [];
			for (const [category, commands] of commandsByCategory) {
				const line = String(++i).padStart(2, '0');
				commandCategories.push(`\`${line}.\` **${category}** → ${language.tget('COMMAND_HELP_COMMAND_COUNT', commands.length)}`);
			}
			return message.reply((mb) => mb.setContent(commandCategories.join('\n')));
		}

		// Handle case for a single command
		const command = typeof commandOrPage === 'object' ? commandOrPage : null;
		if (command) return message.reply((mb) => mb.setEmbed(this.buildCommandHelp(message, command)));

		if (!message.flagArgs.all && message.guild && (message.channel as TextChannel).permissionsFor(message.guild.me!)!.has(PERMISSIONS_RICHDISPLAY)) {
			const [response] = await message.reply((mb) =>
				mb
					.setContent(message.language.tget('COMMAND_HELP_ALL_FLAG', message.guildSettings.get(GuildSettings.Prefix)))
					.setEmbed((embed) => embed.setDescription(message.language.tget('SYSTEM_LOADING')).setColor(BrandingColors.Secondary))
			);
			const display = await this.buildDisplay(message);

			// Extract start page and sanitize it
			const page = isNumber(commandOrPage) ? commandOrPage - 1 : null;
			const startPage = page === null || page < 0 || page >= display.pages.length ? null : page;
			await display.start(response, message.author.id, startPage === null ? undefined : { startPage });
			return response;
		}

		try {
			const DMChannel = await message.author.openDM();

			const response = await DMChannel.send(async (mb) => mb.setContent(await this.buildHelp(message)), { char: '\n' });
			return message.channel.type === ChannelType.DM ? response : await message.replyLocale('COMMAND_HELP_DM');
		} catch {
			return message.channel.type === ChannelType.DM ? null : message.replyLocale('COMMAND_HELP_NODM');
		}
	}

	private async buildHelp(message: KlasaMessage) {
		const commands = await fetchCommands(message);
		const prefix = message.guildSettings.get(GuildSettings.Prefix);

		const helpMessage: string[] = [];
		for (const [category, list] of commands) {
			helpMessage.push(`**${category} Commands**:\n`, list.map(this.formatCommand.bind(this, message, prefix, false)).join('\n'), '');
		}

		return helpMessage.join('\n');
	}

	private async buildDisplay(message: KlasaMessage): Promise<UserRichDisplay> {
		const commandsByCategory = await fetchCommands(message);
		const prefix = message.guildSettings.get(GuildSettings.Prefix);

		const display = new UserRichDisplay({ template: embed => embed.setColor(getColor(message)) });
		for (const [category, commands] of commandsByCategory) {
			display.addPage((template) =>
				template.setTitle(`${category} Commands`).setDescription(commands.map(this.formatCommand.bind(this, message, prefix, true)).join('\n'))
			);
		}

		return display;
	}

	private buildCommandHelp(message: KlasaMessage, command: Command): Embed {
		const DATA = message.language.tget('COMMAND_HELP_DATA');

		return new Embed()
			.setColor(getColor(message))
			.setAuthor(this.client.user!.username, this.client.user!.displayAvatarURL({ size: 128, extension: 'png' })!)
			.setTimestamp()
			.setFooter(DATA.FOOTER(command.name))
			.setTitle(DATA.TITLE(isFunction(command.description) ? command.description(message.language) : command.description))
			.setDescription(
				[
					DATA.USAGE(command.usage.fullUsage(message)),
					DATA.EXTENDED(isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp)
				].join('\n')
			);
	}

	private formatCommand(message: KlasaMessage, prefix: string, richDisplay: boolean, command: Command) {
		const description = isFunction(command.description) ? command.description(message.language) : command.description;
		return richDisplay ? `• ${prefix}${command.name} → ${description}` : `• **${prefix}${command.name}** → ${description}`;
	}
}

async function fetchCommands(message: Message) {
	const run = message.client.inhibitors.run.bind(message.client.inhibitors, message);
	const commands = new Cache<string, Command[]>();
	await Promise.all(
		message.client.commands.map((command) =>
			run(command, true)
				.then(() => {
					const category = commands.get(command.fullCategory.join(' → '));
					if (category) category.push(command);
					else commands.set(command.fullCategory.join(' → '), [command]);
					return null;
				})
				.catch(noop)
		)
	);

	return commands.sort(sortCommandsAlphabetically);
}
