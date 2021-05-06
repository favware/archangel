import type { Events } from '#lib/types/Enums';
import type { CommandDeniedPayload } from '@sapphire/framework';
import { Event, UserError } from '@sapphire/framework';

export class UserEvent extends Event<Events.CommandDenied> {
	public async run({ context, message: content }: UserError, { message }: CommandDeniedPayload) {
		if (Reflect.get(Object(context), 'silent')) return;

		return message.alert(content, { allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
