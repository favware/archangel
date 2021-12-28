import { container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Time } from '@sapphire/time-utilities';
import { isThenable, type Awaitable } from '@sapphire/utilities';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { DiscordAPIError, Message, type MessageOptions } from 'discord.js';
import { setTimeout as sleep } from 'node:timers/promises';

export async function resolveOnErrorCodes<T>(promise: Promise<T>, ...codes: readonly RESTJSONErrorCodes[]) {
	try {
		return await promise;
	} catch (error) {
		if (error instanceof DiscordAPIError && codes.includes(error.code)) return null;
		throw error;
	}
}

async function deleteMessageImmediately(message: Message): Promise<Message> {
	return (await resolveOnErrorCodes(message.delete(), RESTJSONErrorCodes.UnknownMessage)) ?? message;
}

export async function deleteMessage(message: Message, time = 0): Promise<Message> {
	if (message.deleted) return message;
	if (time === 0) return deleteMessageImmediately(message);

	const lastEditedTimestamp = message.editedTimestamp;
	await sleep(time);

	// If it was deleted or edited, cancel:
	if (message.deleted || message.editedTimestamp !== lastEditedTimestamp) {
		return message;
	}

	return deleteMessageImmediately(message);
}

export function floatPromise(promise: Awaitable<unknown>) {
	if (isThenable(promise)) promise.catch((error: Error) => container.logger.fatal(error));
}

/**
 * Converts a number of minutes to milliseconds.
 * @param minutes The amount of minutes
 * @returns The amount of milliseconds `minutes` equals to.
 */
export function minutes(minutes: number): number {
	return minutes * Time.Minute;
}

export async function promptForMessage(message: Message, sendOptions: string | MessageOptions, time = minutes(1)): Promise<string | null> {
	const response = await message.channel.send(sendOptions);
	const responses = await message.channel.awaitMessages({ filter: (msg) => msg.author === message.author, time, max: 1 });
	floatPromise(deleteMessage(response));

	return responses.size === 0 ? null : responses.first()!.content;
}

/**
 * Sends a temporary editable message and then floats a {@link deleteMessage} with the given `timer`.
 * @param message The message to reply to.
 * @param options The options to be sent to the channel.
 * @param timer The timer in which the message should be deleted, using {@link deleteMessage}.
 * @returns The response message.
 */
export async function sendTemporaryMessage(message: Message, options: string | MessageOptions, timer = minutes(1)): Promise<Message> {
	if (typeof options === 'string') options = { content: options };

	const response = (await send(message, options)) as Message;
	floatPromise(deleteMessage(response, timer));
	return response;
}
