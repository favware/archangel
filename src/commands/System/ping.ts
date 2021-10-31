import { Emojis } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Runs a connection test to Discord.'
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		const msg = await send(message, `${Emojis.Loading} Ping?`);
		const diff = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);
		const ping = Math.round(this.container.client.ws.ping);
		return msg.edit(`Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
	}
}
