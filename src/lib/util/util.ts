import { Message } from '@klasa/core';
import { BrandingColors } from './constants';

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
