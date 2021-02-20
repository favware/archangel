import { levenshtein } from '#utils/External/levenshtein';
import type { Collection } from '@discordjs/collection';
import { codeBlock } from '@sapphire/utilities';
import type { Message } from 'discord.js';

type FuzzySearchAccess<V> = (value: V) => string;
type FuzzySearchFilter<V> = (value: V) => boolean;

export class FuzzySearch<K extends string, V> {
	private readonly kCollection: Collection<K, V>;
	private readonly kAccess: FuzzySearchAccess<V>;
	private readonly kFilter: FuzzySearchFilter<V>;

	public constructor(collection: Collection<K, V>, access: FuzzySearchAccess<V>, filter: FuzzySearchFilter<V> = () => true) {
		this.kCollection = collection;
		this.kAccess = access;
		this.kFilter = filter;
	}

	public run(message: Message, query: string, threshold = 2) {
		const lowerCaseQuery = query.toLowerCase();
		const results: [K, V, number][] = [];

		let lowerCaseName: string | undefined = undefined;
		let current: string | undefined = undefined;
		let distance: number | undefined = undefined;
		let almostExacts = 0;
		for (const [id, entry] of this.kCollection.entries()) {
			if (!this.kFilter(entry)) continue;

			current = this.kAccess(entry);
			lowerCaseName = current.toLowerCase();

			// If lowercase result, go next
			if (lowerCaseName === lowerCaseQuery) {
				distance = 0;
			} else if (lowerCaseName.includes(lowerCaseQuery)) {
				distance = lowerCaseName.length - lowerCaseQuery.length;
			} else {
				distance = levenshtein(lowerCaseQuery, lowerCaseName);
			}

			// If the distance is bigger than the threshold, skip
			if (distance > threshold) continue;

			// Push the results
			results.push([id, entry, distance]);

			// Continue earlier
			if (distance <= 1) almostExacts++;
			if (almostExacts === 10) break;
		}

		if (!results.length) return Promise.resolve(null);

		// Almost precisive matches
		const sorted = results.sort((a, b) => a[2] - b[2]);
		const precision = sorted[0][2];
		if (precision <= 2) {
			let i = 0;
			while (i < sorted.length && sorted[i][2] === precision) i++;
			return this.select(message, sorted.slice(0, i));
		}

		return this.select(message, sorted);
	}

	private async select(message: Message, results: [K, V, number][]) {
		if (results.length === 1) return results[0];
		if (results.length > 10) results.length = 10;

		const { content: n } = await message.prompt(
			`I found multiple matches! **Please select a number within 0 and ${results.length - 1}**:\n${codeBlock(
				'http',
				results.map(([id, result], i) => `${i} : [ ${id.padEnd(18, ' ')} ] ${this.kAccess(result)}`).join('\n')
			)}\nWrite **ABORT** if you want to exit the prompt.`
		);

		if (n.toLowerCase() === 'abort') throw 'Successfully aborted the prompt.';
		const parsed = Number(n);
		if (!Number.isSafeInteger(parsed)) throw 'I expected you to give me a (single digit) number, got a potato.';
		if (parsed < 0 || parsed >= results.length) throw 'That number was out of range, aborting prompt.';
		return results[parsed];
	}
}
