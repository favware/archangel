import { GuildChannel, GuildMember, Message, PermissionsFlags } from '@klasa/core';
import { BrandingColors } from './constants';

export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp|tiff)$/i;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function getColor(message: Message) {
	return (message.member && message.member.roles.highest?.color) ?? BrandingColors.Primary;
}

/**
 * Properly rounds up or down a number.
 * Also supports strinsgs using an exponent to indicate large or small numbers.
 * @param num The number to round off
 * @param scale The amount of decimals to retain
 */
export function roundNumber(num: number | string, scale = 0) {
	if (!num.toString().includes('e')) {
		return Number(`${Math.round(Number(`${num}e+${scale}`))}e-${scale}`);
	}
	const arr = `${num}`.split('e');
	let sig = '';

	if (Number(arr[1]) + scale > 0) {
		sig = '+';
	}

	return Number(`${Math.round(Number(`${Number(arr[0])}e${sig}${Number(arr[1]) + scale}`))}e-${scale}`);
}

/**
 * Validates that a user has VIEW_CHANNEL permissions to a channel
 * @param channel The TextChannel to check
 * @param user The user for which to check permission
 * @returns Whether the user has access to the channel
 * @example validateChannelAccess(channel, message.author)
 */
export function validateChannelAccess(channel: GuildChannel, user: GuildMember) {
	return (channel.guild !== null && channel.permissionsFor(user)?.has(PermissionsFlags.ViewChannel)) || false;
}

export interface ImageAttachment {
	url: string;
	proxyURL: string;
	height: number;
	width: number;
}

/**
 * Get a image attachment from a message.
 * @param message The Message instance to get the image url from
 */
export function getAttachment(message: Message): ImageAttachment | null {
	if (message.attachments.size) {
		const attachment = message.attachments.findValue((att) => IMAGE_EXTENSION.test(att.url));
		if (attachment) {
			return {
				url: attachment.url,
				proxyURL: attachment.proxy_url,
				height: attachment.height!,
				width: attachment.width!
			};
		}
	}

	for (const embed of message.embeds) {
		if (embed.type === 'image') {
			return {
				url: embed.thumbnail!.url ?? '',
				proxyURL: embed.thumbnail!.proxy_url!,
				height: embed.thumbnail!.height!,
				width: embed.thumbnail!.width!
			};
		}
		if (embed.image) {
			return {
				url: embed.image.url ?? '',
				proxyURL: embed.image.proxy_url!,
				height: embed.image.height!,
				width: embed.image.width!
			};
		}
	}

	return null;
}

/**
 * Creates an array picker function
 * @param array The array to create a pick function from
 * @example
 * const picker = createPick([1, 2, 3, 4]);
 * picker(); // 2
 * picker(); // 1
 * picker(); // 4
 */
export function createPick<T>(array: T[]): () => T {
	const { length } = array;
	return () => array[Math.floor(Math.random() * length)];
}

/**
 * Split a string by its latest space character in a range from the character 0 to the selected one.
 * @param str The text to split.
 * @param length The length of the desired string.
 * @param char The character to split with
 */
export function splitText(str: string, length: number, char = ' ') {
	const x = str.substring(0, length).lastIndexOf(char);
	const pos = x === -1 ? length : x;
	return str.substring(0, pos);
}

/**
 * Split a text by its latest space character in a range from the character 0 to the selected one.
 * @param str The text to split.
 * @param length The length of the desired string.
 */
export function cutText(str: string, length: number) {
	if (str.length < length) return str;
	const cut = splitText(str, length - 3);
	if (cut.length < length - 3) return `${cut}...`;
	return `${cut.slice(0, length - 3)}...`;
}
