import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

export class UserListener extends Listener {
	public async run(message: Message) {
		const prefix = await this.container.client.fetchPrefix(message);
		return send(message, `The prefix is set to: \`${prefix}\``);
	}
}
