import { CLIENT_OPTIONS, PREFIX, VERSION } from '#root/config';
import { clientOptions } from '#utils/constants';
import { ExtendedHandler as EnGbHandler } from '#utils/Intl/EnGbHandler';
import { SapphireClient } from '@sapphire/framework';
import { mergeDefault } from '@sapphire/utilities';
import type { ClientOptions, Message } from 'discord.js';

export class ArchAngelClient extends SapphireClient {
	/**
	 * The version of Skyra
	 */
	public readonly version = VERSION;

	public readonly EnGbHandler = new EnGbHandler();

	public constructor() {
		// @ts-expect-error shut the fuck up TS
		super(mergeDefault(clientOptions, CLIENT_OPTIONS) as ClientOptions);
	}

	/**
	 * Retrieves the prefix for the guild.
	 * @param message The message that gives context.
	 */
	public fetchPrefix = (message: Message) => {
		if (!message.guild) return [PREFIX, ''] as readonly string[];
		return PREFIX;
	};
}
