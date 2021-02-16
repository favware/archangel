import { ArchAngelCommand } from '#lib/extensions/ArchAngelCommand';
import { Emojis } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<ArchAngelCommand.Options>({
	description: 'Runs a connection test to Discord.'
})
export class UserCommand extends ArchAngelCommand {
	public async run(message: Message) {
		const msg = await message.send(`${Emojis.Loading} Ping?`);
		const diff = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);
		const ping = Math.round(this.context.client.ws.ping);
		return message.send(`Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
	}
}
