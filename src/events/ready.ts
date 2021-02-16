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

		const line01 = llc(String.raw`          /          `);
		const line02 = llc(String.raw`       ${blc('/╬')}▓           `);
		const line03 = llc(String.raw`     ${blc('/▓▓')}╢            `);
		const line04 = llc(String.raw`   [${blc('▓▓')}▓╣/            `);
		const line05 = llc(String.raw`   [╢╢╣▓             `);
		const line06 = llc(String.raw`    %,╚╣╣@\          `);
		const line07 = llc(String.raw`      #,╙▓▓▓\╙N      `);
		const line08 = llc(String.raw`       '╙ \▓▓▓╖╙╦    `);
		const line09 = llc(String.raw`            \@╣▓╗╢%  `);
		const line10 = llc(String.raw`               ▓╣╢╢] `);
		const line11 = llc(String.raw`              /╣▓${blc('▓▓')}] `);
		const line12 = llc(String.raw`              ╢${blc('▓▓/')}   `);
		const line13 = llc(String.raw`             ▓${blc('╬/')}     `);
		const line14 = llc(String.raw`            /        `);

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01}   ________  __   ___  ___  ___  _______        __
${line02}  /"       )|/"| /  ")|"  \/"  |/"      \      /""\
${line03} (:   \___/ (: |/   /  \   \  /|:        |    /    \
${line04}  \___  \   |    __/    \\  \/ |_____/   )   /' /\  \
${line05}   __/  \\  (// _  \    /   /   //      /   //  __'  \
${line06}  /" \   :) |: | \  \  /   /   |:  __   \  /   /  \\  \
${line07} (_______/  (__|  \__)|___/    |__|  \___)(___/    \___)
${line08} ${blc(VERSION.padStart(55, ' '))}
${line09} ${pad}[${success}] Gateway
${line10} ${pad}[]
${line11} ${pad}[]
${line12} ${pad}[]
${line13} ${pad}[]
${line14}${DEV ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
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
