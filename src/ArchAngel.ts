import 'module-alias/register';
import '@utils/initClean';
import 'reflect-metadata';
import { CLIENT_OPTIONS, TOKEN } from '@root/config';
import { inspect } from 'util';
import { ArchAngelClient } from '@lib/ArchAngelClient';
import { KlasaClientOptions } from 'klasa';
inspect.defaultOptions.depth = 1;

const client = new ArchAngelClient(CLIENT_OPTIONS as KlasaClientOptions);
client.token = TOKEN;

client.connect().catch((error) => {
	client.console.error(error);
});

declare module 'klasa' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface PieceOptions {}
}
