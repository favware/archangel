import { sendTemporaryMessage } from '#utils/Parsers/functions';
import type { CommandDeniedPayload } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserListener extends Listener {
	public run({ context, message: content }: UserError, { message }: CommandDeniedPayload) {
		if (Reflect.get(Object(context), 'silent')) return;

		return this.alert(message, content);
	}

	private alert(message: Message, content: string) {
		return sendTemporaryMessage(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
