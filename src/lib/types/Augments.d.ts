import { Message, PermissionsFlags } from '@klasa/core';
import { CustomUsageArgument, Possible } from 'klasa';
import { LanguageKeys } from './Languages';
import { CustomGet } from './settings/Shared';

declare module '@klasa/core/dist/src/lib/client/Client' {
	interface ClientOptions {
		dev?: boolean;
	}

	interface Client {
		version: string;
	}
}

declare module '@klasa/core/dist/src/lib/caching/structures/messages/Message' {
	interface Message {
		prompt(content: string, time?: number): Promise<Message>;
		nuke(time?: number): Promise<Message>;
	}
}

declare module 'klasa/dist/src/lib/structures/Language' {
	interface Language {
		PERMISSIONS: Record<PermissionsFlags, string>;
		HUMAN_LEVELS: Record<0 | 1 | 2 | 3 | 4, string>;
		duration(time: number, precision?: number): string;
		ordinal(cardinal: number): string;
		list(values: readonly string[], conjunction: string): string;
		groupDigits(number: number): string;

		get<T extends LanguageKeysSimple>(term: T): LanguageKeys[T];
		get<T extends LanguageKeysComplex>(term: T, ...args: Parameters<LanguageKeys[T]>): ReturnType<LanguageKeys[T]>;
		tget<T extends LanguageKeysSimple>(term: T): LanguageKeys[T];
		tget<T extends LanguageKeysComplex>(term: T, ...args: Parameters<LanguageKeys[T]>): ReturnType<LanguageKeys[T]>;
	}
}

declare module 'klasa/dist/src/lib/structures/Argument' {
	interface Argument {
		// @ts-expect-error 1070
		run<T>(
			argument: string,
			possible: Possible,
			message: Message,
			custom?: CustomUsageArgument,
			filter?: (entry: T) => boolean
		): unknown | Promise<unknown>;
	}
}

declare module 'klasa/dist/src/lib/settings/Settings' {
	interface Settings {
		get<K extends string, S>(key: CustomGet<K, S>): S;
	}
}

interface Fn {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(...args: readonly any[]): unknown;
}

export type LanguageKeysSimple = {
	[K in keyof LanguageKeys]: LanguageKeys[K] extends Fn ? never : K;
}[keyof LanguageKeys];

export type LanguageKeysComplex = {
	[K in keyof LanguageKeys]: LanguageKeys[K] extends Fn ? K : never;
}[keyof LanguageKeys];
