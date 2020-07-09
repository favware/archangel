import { Event, Message } from '@klasa/core';
import { UserRichDisplay } from '@lib/structures/UserRichDisplay';

export default class extends Event {
	public run(message: Message) {
		if (!message.guild || message.author.bot) return;

		this.handleUserRichDisplay(message);
	}

	private handleUserRichDisplay(message: Message) {
		const handler = UserRichDisplay.messages.get(message.id);
		if (handler) handler.stop();
	}
}
