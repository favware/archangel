import type { Message, TextChannel } from '@klasa/core';
import { isThenable } from '@klasa/utils';
import { Argument, Possible } from 'klasa';

export default class extends Argument {
	public async run(arg: string, possible: Possible, message: Message): Promise<Message[]> {
		if (!arg) {
			const lastMessage = message.channel.messages.lastValue;
			if (lastMessage) return [lastMessage];
			throw message.language.tget('RESOLVER_INVALID_MESSAGE', arg);
		}

		const flag = Reflect.get(message.flagArgs, 'channel') ?? Reflect.get(message.flagArgs, 'sourcechannel');
		let sourceChannel = flag
			? (message.client.arguments.get('textchannelname')!.run(flag, possible, message) as Promise<TextChannel>)
			: (message.channel as TextChannel);

		if (isThenable(sourceChannel)) sourceChannel = await sourceChannel;

		const messages: Array<Message | null | undefined> = [];
		const args = message.prompter?.args;

		if (!args || !arg.length) throw message.language.tget('RESOLVER_INVALID_MESSAGE', arg);

		for (const messageId of args) {
			if (!messageId) continue;
			messages.push(Argument.regex.snowflake.test(messageId) ? await sourceChannel.messages.fetch(messageId).catch(() => null) : undefined);
		}

		if (messages.length) return filterNullAndUndefined(messages);
		throw message.language.get('RESOLVER_INVALID_MESSAGE', possible.name);
	}
}

function filterNullAndUndefined<T>(arr: (T | null | undefined)[]) {
	return arr.filter((v) => v !== null && v !== undefined) as T[];
}
