import { TextBasedChannel, TextChannel } from '@klasa/core';
import { codeBlock } from '@klasa/utils';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { PermissionLevels } from '@lib/types/Enums';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ApplyOptions, CreateResolvers } from '@skyra/decorators';
import { KlasaMessage } from 'klasa';

@ApplyOptions<ArchAngelCommandOptions>({
	bucket: 2,
	cooldown: 10,
	description: (language) => language.tget('COMMAND_MANAGECOMMANDAUTODELETE_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_MANAGECOMMANDAUTODELETE_EXTENDED'),
	permissionLevel: PermissionLevels.Administrator,
	subcommands: true,
	usage: '<show|add|remove|reset> (channel:channel) (duration:timespan)',
	usageDelim: ' '
})
@CreateResolvers([
	[
		'channel',
		async (arg, _, message, [type]) => {
			if (type === 'show' || type === 'reset') return undefined;
			if (!arg) return message.channel;
			const channel = (await message.client.arguments.get('channelname')!.run(arg, _, message)) as TextBasedChannel;
			if (channel instanceof TextChannel) return channel;
			throw message.language.tget('COMMAND_MANAGECOMMANDAUTODELETE_TEXTCHANNEL');
		}
	],
	['timespan', (arg, _, message, [type]) => (type === 'add' ? message.client.arguments.get('timespan')!.run(arg, _, message) : undefined)]
])
export default class extends ArchAngelCommand {
	public async show(message: KlasaMessage) {
		const commandAutodelete = message.guild!.settings.get(GuildSettings.CommandAutodelete);
		if (!commandAutodelete.length) throw message.language.tget('COMMAND_MANAGECOMMANDAUTODELETE_SHOW_EMPTY');

		const list: string[] = [];
		for (const entry of commandAutodelete) {
			const channel = this.client.channels.get(entry[0]) as TextChannel;
			if (channel) list.push(`${channel.name.padEnd(26)} :: ${message.language.duration(entry[1] / 60000)}`);
		}
		if (!list.length) throw message.language.tget('COMMAND_MANAGECOMMANDAUTODELETE_SHOW_EMPTY');
		return message.replyLocale('COMMAND_MANAGECOMMANDAUTODELETE_SHOW', [codeBlock('asciidoc', list.join('\n'))]);
	}

	public async add(message: KlasaMessage, [channel, duration]: [TextChannel, number]) {
		const commandAutodelete = message.guild!.settings.get(GuildSettings.CommandAutodelete);
		const index = commandAutodelete.findIndex(([id]) => id === channel.id);
		const value: readonly [string, number] = [channel.id, duration];

		if (index === -1) {
			await message.guild!.settings.update(GuildSettings.CommandAutodelete, [value], {
				arrayAction: 'add',
				extraContext: { author: message.author.id }
			});
		} else {
			await message.guild!.settings.update(GuildSettings.CommandAutodelete, value, {
				arrayIndex: index,
				extraContext: { author: message.author.id }
			});
		}
		return message.replyLocale('COMMAND_MANAGECOMMANDAUTODELETE_ADD', [channel, duration]);
	}

	public async remove(message: KlasaMessage, [channel]: [TextChannel]) {
		const commandAutodelete = message.guild!.settings.get(GuildSettings.CommandAutodelete);
		const index = commandAutodelete.findIndex(([id]) => id === channel.id);

		if (index !== -1) {
			await message.guild!.settings.update(GuildSettings.CommandAutodelete, commandAutodelete[index], {
				arrayIndex: index,
				extraContext: { author: message.author.id }
			});
			return message.replyLocale('COMMAND_MANAGECOMMANDAUTODELETE_REMOVE', [channel]);
		}
		throw message.language.tget('COMMAND_MANAGECOMMANDAUTODELETE_REMOVE_NOTSET', channel.toString());
	}

	public async reset(message: KlasaMessage) {
		await message.guild!.settings.reset(GuildSettings.CommandAutodelete);
		message.replyLocale('COMMAND_MANAGECOMMANDAUTODELETE_RESET');
	}
}
