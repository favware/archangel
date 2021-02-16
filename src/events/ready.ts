import { DEV, VERSION } from '#root/config';
import { ApplyOptions } from '@sapphire/decorators';
import { Event, EventOptions, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';

const style = DEV ? yellow : blue;

@ApplyOptions<EventOptions>({ once: true })
export class UserEvent extends Event {
	public run() {
		this.printBanner();
		this.printStoreDebugInformation();
	}

	private printBanner() {
		const success = green('+');
		const llc = DEV ? magentaBright : white;
		const blc = DEV ? magenta : blue;

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
${line06} ${blc(VERSION.padStart(55, ' '))}
${line07} ${pad}[${success}] Gateway
${line08}${DEV ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
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
		return gray(`${last ? '└─' : '├─'} Loaded ${style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
