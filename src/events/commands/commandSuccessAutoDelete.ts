import { Events } from '#lib/types/Enums';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandSuccessPayload, Event, EventOptions } from '@sapphire/framework';

@ApplyOptions<EventOptions>({ event: Events.CommandSuccess })
export class UserEvent extends Event<Events.CommandSuccess> {
	public async run({ message }: CommandSuccessPayload) {
		if (!message.guild) return;

		if (message.deletable) {
			await message.nuke();
		}
	}
}
