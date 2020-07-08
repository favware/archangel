import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { PermissionLevels } from '@lib/types/Enums';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { ApplyOptions } from '@skyra/decorators';
import { KlasaMessage } from 'klasa';

@ApplyOptions<ArchAngelCommandOptions>({
	bucket: 2,
	cooldown: 10,
	description: (language) => language.tget('COMMAND_SETPREFIX_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_SETPREFIX_EXTENDED'),
	permissionLevel: PermissionLevels.Administrator,
	usage: '<prefix:string{1,10}>',
	aliases: ['prefix']
})
export default class extends ArchAngelCommand {
	public async run(message: KlasaMessage, [prefix]: [string]) {
		if (message.guild!.settings.get(GuildSettings.Prefix) === prefix) throw message.language.tget('CONFIGURATION_EQUALS');
		await message.guild!.settings.update(GuildSettings.Prefix, prefix, {
			extraContext: { author: message.author.id }
		});

		return message.replyLocale('COMMAND_SETPREFIX_SET', [prefix]);
	}
}
