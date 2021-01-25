import type { GuildChannel, TextChannel } from '@klasa/core';
import { ChannelType } from '@klasa/dapi-types';
import { Argument, CustomUsageArgument, KlasaMessage, Possible } from 'klasa';

export default class extends Argument {
	public get channelname(): Argument {
		return this.store.get('channelname') as Argument;
	}

	public run(arg: string, possible: Possible, message: KlasaMessage, _?: CustomUsageArgument): Promise<TextChannel> {
		return this.channelname.run(arg, possible, message, _, (entry: GuildChannel) => entry.type === ChannelType.GuildText) as Promise<TextChannel>;
	}
}
