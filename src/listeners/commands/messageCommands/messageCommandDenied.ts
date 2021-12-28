import { sendTemporaryMessage } from '#utils/Parsers/functions';
import { Events, Listener, MessageCommandDeniedPayload, UserError } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserListener extends Listener<typeof Events.MessageCommandDenied> {
	public run({ context, message: content }: UserError, { message }: MessageCommandDeniedPayload) {
		if (Reflect.get(Object(context), 'silent')) return;

		return this.alert(message, content);
	}

	private alert(message: Message, content: string) {
		return sendTemporaryMessage(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
