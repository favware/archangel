import { Events } from '#lib/types/Enums';
import { sleep } from '#utils/Promisified/sleep';
import { RESTJSONErrorCodes } from 'discord-api-types/v6';
import { Message, Structures } from 'discord.js';

export class ArchAngelMessage extends Structures.get('Message') {
	public async nuke(time = 0): Promise<Message> {
		if (this.deleted) return this;
		if (time === 0) return this.nukeNow();

		const lastEditedTimestamp = this.editedTimestamp;
		await sleep(time);
		return !this.deleted && this.editedTimestamp === lastEditedTimestamp ? this.nukeNow() : (this as Message);
	}

	public async prompt(content: string, time = 30000) {
		const message = await this.channel.send(content);
		const responses = await this.channel.awaitMessages((msg) => msg.author === this.author, { time, max: 1 });
		message.nuke().catch((error) => this.client.emit(Events.ApiError, error));
		if (responses.size === 0) throw 'The prompt has timed out.';
		return responses.first()!;
	}

	private async nukeNow() {
		try {
			return await this.delete();
		} catch (error) {
			if (error.code === RESTJSONErrorCodes.UnknownMessage) return this as Message;
			throw error;
		}
	}
}

declare module 'discord.js' {
	export interface Message {
		prompt(content: string, time?: number): Promise<Message>;
		nuke(time?: number): Promise<Message>;
	}
}

Structures.extend('Message', () => ArchAngelMessage);
