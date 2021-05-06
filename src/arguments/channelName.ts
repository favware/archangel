import { FuzzySearch } from '#utils/Parsers/FuzzySearch';
import { validateChannelAccess } from '#utils/util';
import { ChannelMentionRegex, SnowflakeRegex } from '@sapphire/discord.js-utilities';
import type { ArgumentContext } from '@sapphire/framework';
import { Argument, Identifiers } from '@sapphire/framework';
import type { Guild, GuildChannel, User } from 'discord.js';

export class UserArgument extends Argument<GuildChannel> {
	public resolveChannel(query: string, guild: Guild) {
		const channelID = ChannelMentionRegex.exec(query) ?? SnowflakeRegex.exec(query);
		return (channelID !== null && guild.channels.cache.get(channelID[1])) ?? null;
	}

	public async run(parameter: string, { message, minimum, context, filter }: ChannelArgumentContext) {
		if (!message.guild)
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentGuildChannelMissingGuild,
				context,
				message: `I was not able to resolve \`${parameter}\` because this argument requires to be run in a server channel.`
			});
		filter = this.getFilter(message.author, filter);

		const resChannel = this.resolveChannel(parameter, message.guild);
		if (resChannel && filter(resChannel)) return this.ok(resChannel);

		const result = await new FuzzySearch(message.guild.channels.cache, (entry) => entry.name, filter).run(message, parameter, minimum);
		if (result) return this.ok(result[1]);
		return this.error({
			parameter,
			identifier: Identifiers.ArgumentGuildChannel,
			context,
			message: `I could not resolve \`${parameter}\` to a channel from this server, please make sure you typed its name or ID correctly!`
		});
	}

	private getFilter(author: User, filter?: (entry: GuildChannel) => boolean) {
		const clientUser = author.client.user!;
		return typeof filter === 'undefined'
			? (entry: GuildChannel) => validateChannelAccess(entry, author) && validateChannelAccess(entry, clientUser)
			: (entry: GuildChannel) => filter(entry) && validateChannelAccess(entry, author) && validateChannelAccess(entry, clientUser);
	}
}

interface ChannelArgumentContext extends ArgumentContext<GuildChannel> {
	filter?: (entry: GuildChannel) => boolean;
}
