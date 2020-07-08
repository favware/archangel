import 'module-alias/register';
import 'reflect-metadata';
import '@lib/schemas/Guild';
import '@utils/initClean';
import { CLIENT_OPTIONS, TOKEN } from '@root/config';
import { KlasaClient, KlasaClientOptions } from 'klasa';
import { inspect } from 'util';
inspect.defaultOptions.depth = 1;

const client = new KlasaClient(CLIENT_OPTIONS as KlasaClientOptions);
client.token = TOKEN;

client.connect().catch((error) => {
	client.console.error(error);
});

declare module 'klasa' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface PieceOptions {}
}
