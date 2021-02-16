import { Events } from '#lib/types/Enums';
import { sleep } from '#utils/Promisified/sleep';
import { Time } from '@sapphire/time-utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v6';
import { Message, MessageOptions, Structures } from 'discord.js';

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

	public async alert(content: string, timer?: number): Promise<Message>;
	public async alert(content: string, options?: MessageOptions, timer?: number): Promise<Message>;
	public async alert(content: string, options?: number | MessageOptions, timer?: number): Promise<Message> {
		if (typeof options === 'number' && typeof timer === 'undefined') {
			timer = options;
			options = undefined;
		}

		const msg = (await this.send(content, options as MessageOptions)) as Message;
		msg.nuke(typeof timer === 'number' ? timer : Time.Minute).catch((error) => this.client.emit(Events.ApiError, error));
		return msg;
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
		alert(content: string, timer?: number): Promise<Message>;
		alert(content: string, options?: number | MessageOptions, timer?: number): Promise<Message>;
		nuke(time?: number): Promise<Message>;
	}
}

Structures.extend('Message', () => ArchAngelMessage);
