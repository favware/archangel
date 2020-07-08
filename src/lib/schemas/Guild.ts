import { KlasaClient } from 'klasa';

KlasaClient.defaultGuildSchema
	.add('prefix', 'string', { filter: (_client, value) => (value as string).length > 10 })
	.add('command-autodelete', 'any', { array: true });
