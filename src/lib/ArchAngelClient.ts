// Import all dependencies
import { VERSION } from '@root/config';
import { KlasaClient, KlasaClientOptions } from 'klasa';
// Import setup files
import './setup/Canvas';

export class ArchAngelClient extends KlasaClient {
	/**
	 * The version of Skyra
	 */
	public version = VERSION;

	public constructor(options: Partial<KlasaClientOptions> = {}) {
		super(options);

		if (this.options.dev) this.permissionLevels.add(0, ({ author, client }) => client.options.owners.includes(author.id), { break: true });
	}
}
