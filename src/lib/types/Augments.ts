import type { ExtendedHandler as EnGbHandler } from '#utils/Intl/EnGbHandler';
import type { GuildCommandInteraction, GuildContextMenuInteraction } from './Discord';

declare module 'discord.js' {
	interface Client {
		readonly dev: boolean;
		readonly version: string;
		readonly EnGbHandler: EnGbHandler;
	}
}

declare module '@sapphire/framework' {
	interface ChatInputCommandSuccessPayload {
		readonly interaction: GuildCommandInteraction;
	}

	interface ChatInputCommandDeniedPayload {
		readonly interaction: GuildCommandInteraction;
	}

	interface ContextMenuCommandSuccessPayload {
		readonly interaction: GuildContextMenuInteraction;
	}

	interface ContextMenuCommandDeniedPayload {
		readonly interaction: GuildContextMenuInteraction;
	}
}
