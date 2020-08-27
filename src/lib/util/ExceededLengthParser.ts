import { Attachment, Message } from '@klasa/core';
import { Events } from '@lib/types/Enums';
import { codeBlock } from '@sapphire/utilities';
import { KlasaMessage } from 'klasa';
import { fetch, FetchMethods, FetchResultTypes } from './fetch';

export async function handleMessage<ED extends ExtraDataPartial>(message: KlasaMessage, options: HandleMessageData<ED>): Promise<Message | Message[] | null> {
	switch (options.sendAs) {
		case 'file': {
			if (message.channel.attachable) {
				return message.reply(async (mb) =>
					mb.setContent(message.language.tget('SYSTEM_EXCEEDED_LENGTH_OUTPUT_FILE', options.time, options.footer)).addFile(
						await new Attachment()
							.setName(options.targetId ? `${options.targetId}.txt` : 'output.txt')
							.setFile(Buffer.from(options.content ? options.content : options.result!))
							.resolve()
					)
				);
			}

			await getTypeOutput(message, options);
			return handleMessage(message, options);
		}
		case 'haste':
		case 'hastebin': {
			if (!options.url) options.url = await getHaste(options.content ? options.content : options.result!, options.language ?? 'md').catch(() => null);
			if (options.url) return message.replyLocale('SYSTEM_EXCEEDED_LENGTH_OUTPUT_HASTEBIN', [options.url, options.time, options.footer]);
			options.hastebinUnavailable = true;
			await getTypeOutput(message, options);
			return handleMessage(message, options);
		}
		case 'console':
		case 'log': {
			message.client.emit(Events.Log, options.result);
			return message.replyLocale('SYSTEM_EXCEEDED_LENGTH_OUTPUT_CONSOLE', [options.time, options.footer]);
		}
		case 'abort':
		case 'none':
			return null;
		default: {
			if (options.content ? options.content.length > 1950 : options.result!.length > 1950) {
				await getTypeOutput(message, options);
				return handleMessage(message, options);
			}

			if (options.content) {
				return message.reply((mb) =>
					mb.setContent(
						codeBlock(
							'md',
							`${options.content}${options.content && options.attachments ? `\n\n\n=============\n${options.attachments}` : options.attachments}`
						)
					)
				);
			}
			return message.replyLocale(options.success ? 'SYSTEM_EXCEEDED_LENGTH_OUTPUT' : 'COMMAND_EVAL_ERROR', [
				codeBlock(options.language!, options.result!),
				options.time,
				options.footer
			]);
		}
	}
}

async function getTypeOutput<ED extends ExtraDataPartial>(message: KlasaMessage, options: HandleMessageData<ED>) {
	const _options = ['none', 'abort'];
	if (options.canLogToConsole) _options.push('log');

	if (message.channel.attachable) _options.push('file');
	if (!options.hastebinUnavailable) _options.push('hastebin');
	let _choice: { content: string } | undefined = undefined;
	do {
		_choice = await message.prompt(message.language.tget('SYSTEM_EXCEEDED_LENGTH_CHOOSE_OUTPUT', _options)).catch(() => ({ content: 'none' }));
	} while (!_options.concat('none', 'abort').includes(_choice.content));
	options.sendAs = _choice.content.toLowerCase();
}

async function getHaste(result: string, language = 'js') {
	const { key } = await fetch<{ key: string }>('https://hasteb.in/documents', { method: FetchMethods.Post, body: result }, FetchResultTypes.JSON);
	return `https://hasteb.in/${key}.${language}`;
}

type HandleMessageData<ED extends ExtraDataPartial> = {
	sendAs: string | null;
	hastebinUnavailable: boolean;
	url: string | null;
	canLogToConsole: boolean;
} & ED;

export interface EvalExtraData {
	success: boolean;
	result: string;
	time: string;
	footer: string;
	language: string;
}

export interface ContentExtraData {
	content: string;
	targetId: string;
	attachments: string;
}

type ExtraDataPartial = Partial<EvalExtraData> & Partial<ContentExtraData>;
