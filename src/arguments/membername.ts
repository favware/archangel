import { Cache } from '@klasa/cache';
import { GuildMember, GuildMemberStore } from '@klasa/core';
import { FuzzySearch } from '@utils/FuzzySearch';
import { Argument, CustomUsageArgument, KlasaMessage, Possible } from 'klasa';

const USER_REGEXP = Argument.regex.userOrMember;
const USER_TAG = /^\w{1,32}#\d{4}$/;

export default class extends Argument {
	public async run(
		arg: string,
		possible: Possible,
		message: KlasaMessage,
		_?: CustomUsageArgument,
		filter?: (entry: string) => boolean
	): Promise<GuildMember> {
		if (!arg) throw message.language.tget('RESOLVER_INVALID_USERNAME', possible.name);
		const resMember = await this.resolveMember(message, arg);
		if (resMember) return resMember;

		const result = await new FuzzySearch(this.getMembersCache(message.guild!.members), (entry) => entry, filter).run(
			message,
			arg,
			possible.min || undefined
		);
		if (result) {
			const id = result[0];
			const guildMember = await message.guild!.members.fetch(id);
			if (guildMember) return guildMember;
			throw message.language.tget('RESOLVER_MEMBERNAME_USER_LEFT_DURING_PROMPT');
		}
		throw message.language.tget('RESOLVER_INVALID_USERNAME', possible.name);
	}

	public async resolveMember(message: KlasaMessage, query: string): Promise<GuildMember | null> {
		const id = USER_REGEXP.test(query) ? USER_REGEXP.exec(query)![1] : USER_TAG.test(query) ? this.getKeyFromTag(query) || null : null;

		if (id) {
			const guildMember = await message.guild!.members.fetch(id);
			if (guildMember) return guildMember;
			throw message.language.tget('USER_NOT_EXISTENT');
		}
		return null;
	}

	private getMembersCache(members: GuildMemberStore) {
		const output = new Cache<string, string>();
		for (const key of members.keys()) {
			const username = members.get(key)?.user?.username;
			if (typeof username === 'string') output.set(key, username);
		}

		return output;
	}

	private getKeyFromTag(tag: string) {
		const pieces = tag.split('#');
		if (pieces.length !== 2 || pieces[1].length !== 4) return;

		const [username, discriminator] = pieces;
		for (const [key, value] of this.client.users.entries()) {
			if (username === value.username && discriminator === value.discriminator) return key;
		}

		return null;
	}
}
