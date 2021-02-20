import type { ExtendedHandler as EnGbHandler } from '#utils/Intl/EnGbHandler';
import type { GuildChannel, TextChannel } from 'discord.js';

declare module 'discord.js' {
	interface Client {
		readonly version: string;
		readonly EnGbHandler: EnGbHandler;
	}

	interface ClientOptions {
		dev?: boolean;
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		channelName: GuildChannel;
		textChannelName: TextChannel;
	}

	const enum Identifiers {
		ChannelNameNotAGuild = 'channelNameNotAGuild'
	}
}
