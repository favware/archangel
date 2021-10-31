import { isTextChannel } from '@sapphire/discord.js-utilities';
import type { ArgumentContext } from '@sapphire/framework';
import { Argument } from '@sapphire/framework';
import type { TextChannel } from 'discord.js';

export class UserArgument extends Argument<TextChannel> {
	public get channelName(): Argument<TextChannel> {
		return this.store.get('channelName') as Argument<TextChannel>;
	}

	public run(argument: string, context: ArgumentContext<TextChannel>) {
		return this.channelName.run(argument, { ...context, filter: isTextChannel });
	}
}
