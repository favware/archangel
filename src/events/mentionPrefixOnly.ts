import { Event, Events } from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Event<Events.MentionPrefixOnly> {
	public async run(message: Message) {
		const prefix = await this.context.client.fetchPrefix(message);
		return message.send(`The prefix is set to: \`${prefix}\``);
	}
}
