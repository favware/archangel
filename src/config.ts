// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { envParseArray, envParseBoolean, envParseString } from '#lib/env';
import { srcFolder } from '#utils/constants';
import { LogLevel } from '@sapphire/framework';
import type { ActivitiesOptions, ClientOptions, ExcludeEnum } from 'discord.js';
import type { ActivityTypes } from 'discord.js/typings/enums';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Read config:
config({
	debug: process.env.DOTENV_DEBUG_ENABLED ? envParseBoolean('DOTENV_DEBUG_ENABLED') : undefined,
	path: join(fileURLToPath(srcFolder), '.env')
});

export const OWNERS = envParseArray('CLIENT_OWNERS');

function parsePresenceActivity(): ActivitiesOptions[] {
	const { CLIENT_PRESENCE_NAME } = process.env;
	if (!CLIENT_PRESENCE_NAME) return [];

	return [
		{
			name: CLIENT_PRESENCE_NAME,
			type: envParseString('CLIENT_PRESENCE_TYPE', 'WATCHING') as ExcludeEnum<typeof ActivityTypes, 'CUSTOM'>
		}
	];
}

function parseRegExpPrefix(): RegExp | undefined {
	const { CLIENT_REGEX_PREFIX } = process.env;
	return CLIENT_REGEX_PREFIX ? new RegExp(CLIENT_REGEX_PREFIX, 'i') : undefined;
}

export const CLIENT_OPTIONS: ClientOptions = {
	intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
	defaultPrefix: envParseString('CLIENT_PREFIX'),
	presence: { activities: parsePresenceActivity() },
	regexPrefix: parseRegExpPrefix(),
	logger: { level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug },
	restTimeOffset: 0,
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true
};
