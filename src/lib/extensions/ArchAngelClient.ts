import { envParseString } from '#lib/env';
import { CLIENT_OPTIONS } from '#root/config';
import { ExtendedHandler as EnGbHandler } from '#utils/Intl/EnGbHandler';
import { SapphireClient } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class ArchAngelClient extends SapphireClient {
	public readonly EnGbHandler = new EnGbHandler();

	public constructor() {
		super(CLIENT_OPTIONS);
	}

	/**
	 * Retrieves the prefix for the guild.
	 * @param message The message that gives context.
	 */
	public fetchPrefix = (message: Message) => {
		if (!message.guild) return [envParseString('CLIENT_PREFIX'), ''] as readonly string[];
		return envParseString('CLIENT_PREFIX');
	};
}
