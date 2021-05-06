import { envParseString } from '#lib/env';
import { ApplyOptions } from '@sapphire/decorators';
import type { EventOptions } from '@sapphire/framework';
import { Event, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';

@ApplyOptions<EventOptions>({ once: true })
export class UserEvent extends Event {
	private readonly style = this.context.client.dev ? yellow : blue;

	public run() {
		this.printBanner();
		this.printStoreDebugInformation();
	}

	private printBanner() {
		const { client } = this.context;
		const success = green('+');

		const llc = client.dev ? magentaBright : white;
		const blc = client.dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');
		const line04 = llc('');
		const line05 = llc('');
		const line06 = llc('');
		const line07 = llc('');
		const line08 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01}      _     ____    ____  _   _     _     _   _   ____  _____  _     
${line02}     / \   |  _ \  / ___|| | | |   / \   | \ | | / ___|| ____|| |    
${line03}    / _ \  | |_) || |    | |_| |  / _ \  |  \| || |  _ |  _|  | |    
${line04}   / ___ \ |  _ < | |___ |  _  | / ___ \ | |\  || |_| || |___ | |___ 
${line05}  /_/   \_\|_| \_\ \____||_| |_|/_/   \_\|_| \_| \____||_____||_____|
${line06} ${blc(envParseString('CLIENT_VERSION').padStart(55, ' '))}
${line07} ${pad}[${success}] Gateway
${line08}${this.context.client.dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.context;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
