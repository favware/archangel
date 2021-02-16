import { DEV } from '#root/config';
import { LogLevel } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export const enum Emojis {
	Loading = '<a:aaloading:730555789730775042>',
	GreenTick = '<:greenTick:637706251253317669>',
	RedCross = '<:redCross:637706251257511973>'
}

export const clientOptions: Partial<ClientOptions> = {
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	logger: {
		level: DEV ? LogLevel.Debug : LogLevel.Info
	}
};

export const enum BrandingColors {
	Primary = 0x5b75b3,
	Secondary = 0xfffeff
}
