import { Constructor, Message } from '@klasa/core';
import { Events } from '@lib/types/Enums';
import { ApplyOptions } from '@skyra/decorators';
import { APIErrors } from '@utils/constants';
import { sleep } from '@utils/sleep';
import { Extendable, ExtendableOptions } from 'klasa';

@ApplyOptions<ExtendableOptions>({
	appliesTo: [Message as Constructor<Message>]
})
export default class extends Extendable {
	public async prompt(this: Message, content: string, time = 30000) {
		const [message] = await this.reply((mb) => mb.setContent(content));
		const responses = await this.channel.awaitMessages({ limit: 1, idle: time, filter: ([msg]) => msg.author === this.author });
		message.nuke().catch((error: unknown) => this.client.emit(Events.ApiError, error));
		if (responses.size === 0) throw this.language.tget('MESSAGE_PROMPT_TIMEOUT');
		return responses.first;
	}

	public async nuke(this: Message, time = 0) {
		if (time === 0) return nuke(this);

		await sleep(time);
		return !this.deleted ? nuke(this) : this;
	}
}

async function nuke(message: Message) {
	try {
		return await message.delete();
	} catch (error) {
		if (error.code === APIErrors.UnknownMessage) return message;
		throw error;
	}
}
