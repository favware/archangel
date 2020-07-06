import { Constructor } from '@klasa/core';
import { LanguageKeysComplex, LanguageKeysSimple } from '@lib/types/Augments';
import { LanguageKeys } from '@lib/types/Languages';
import { ApplyOptions } from '@skyra/decorators';
import { Extendable, ExtendableOptions, Language } from 'klasa';

@ApplyOptions<ExtendableOptions>({
	appliesTo: [Language as Constructor<Language>]
})
export default class extends Extendable {
	public tget<T extends LanguageKeysSimple>(term: T): LanguageKeys[T];
	public tget<T extends LanguageKeysComplex>(term: T, ...args: Parameters<LanguageKeys[T]>): ReturnType<LanguageKeys[T]>;
	public tget(this: Language, key: string, ...args: readonly unknown[]): unknown {
		return this.get(key, ...args);
	}
}
