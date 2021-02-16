import type { ClientOptions } from 'discord.js';

export const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : !('PM2_HOME' in process.env);

export const NAME = DEV ? 'Lucifer' : 'ArchAngel';
export const PREFIX = DEV ? 'lc.' : 'a.';
export const VERSION = '2.0.0 Angelic';

export const OWNERS = [''];

export const CLIENT_OPTIONS: ClientOptions = {
	shards: 'auto',
	dev: DEV,
	ws: {
		intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
	},
	messageCacheLifetime: 900,
	messageCacheMaxSize: 300,
	messageSweepInterval: 180,
	defaultPrefix: PREFIX,
	presence: { activity: { name: `${PREFIX}help`, type: 'LISTENING' } },
	regexPrefix: DEV ? undefined : /^(hey +)?(archangel|lucifer)[,! ]/i,
	restTimeOffset: 0
};

export const TOKEN = '';
