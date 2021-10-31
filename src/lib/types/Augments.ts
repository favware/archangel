import type { ExtendedHandler as EnGbHandler } from '#utils/Intl/EnGbHandler';
import type { GuildChannel, TextChannel } from 'discord.js';

declare module 'discord.js' {
	interface Client {
		readonly dev: boolean;
		readonly version: string;
		readonly EnGbHandler: EnGbHandler;
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		channelName: GuildChannel;
		textChannelName: TextChannel;
	}

	interface Preconditions {
		Administrator: never;
		BotOwner: never;
		Everyone: never;
		Moderator: never;
		ServerOwner: never;
	}
}
