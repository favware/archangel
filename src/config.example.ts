import { Client, PresenceBuilder } from '@klasa/core';
import { ActivityType } from '@klasa/dapi-types';
import { Intents, IntentsFlags } from '@klasa/ws';
import { KlasaClientOptions } from 'klasa';
import { resolve } from 'path';

// eslint-disable-next-line no-process-env
export const DEV = 'DEV' in process.env ? process.env.DEV === 'true' : !('PM2_HOME' in process.env);

export const NAME = DEV ? 'Lucifer' : 'ArchAngel';
export const PREFIX = DEV ? 'lc.' : 'a.';
export const VERSION = '1.0.0 Holy';

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[P] extends ReadonlyArray<infer U>
		? ReadonlyArray<DeepPartial<U>>
		: DeepPartial<T[P]>;
};

export const CLIENT_OPTIONS: DeepPartial<KlasaClientOptions> = {
	commands: {
		editing: true,
		messageLifetime: 200,
		prefix: PREFIX,
		prefixCaseInsensitive: true,
		slowmode: 1000,
		slowmodeAggressive: false,
		typing: false,
		prompts: { limit: 5 }
	},
	owners: ['268792781713965056'],
	console: { useColor: true, utc: true },
	pieces: { createFolders: false },
	cache: { limits: { messages: 20 } },
	consoleEvents: { verbose: true, debug: true },
	dev: DEV,
	providers: {
		default: 'json',
		json: { baseDirectory: resolve(__dirname, '..', 'bwd', 'providers', 'json') }
	},

	readyMessage: (client: Client) =>
		`${NAME} ${VERSION} ready! [${client.user!.tag}] [ ${client.guilds.size} [G]] [ ${client.guilds
			.reduce((a, b) => a + (b.memberCount ?? 0), 0)
			.toLocaleString()} [U]].`,
	ws: {
		intents: new Intents([IntentsFlags.GuildMessages, IntentsFlags.Guilds]),
		additionalOptions: {
			presence: new PresenceBuilder().setGame((pg) => pg.setType(ActivityType.Listening).setName(DEV ? 'LuciferAngel, help' : 'Archangel, help'))
		}
	}
};

export const TOKEN = '';
