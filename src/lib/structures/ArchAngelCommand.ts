import { ChannelType } from '@klasa/dapi-types';
import { mergeDefault } from '@klasa/utils';
import { Command, CommandOptions, CommandStore, KlasaMessage } from 'klasa';

export abstract class ArchAngelCommand extends Command {
	public constructor(store: CommandStore, directory: string, file: string[], options: ArchAngelCommandOptions = {}) {
		super(store, directory, file, mergeDefault({ runIn: [ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildStore] }, options));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	public run(message: KlasaMessage, _params: any[]): any {
		return message;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public inhibit(_message: KlasaMessage): Promise<boolean> | boolean {
		return false;
	}
}

export type ArchAngelCommandOptions = CommandOptions;
