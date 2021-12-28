import type { GuildMessage } from '#lib/types/Discord';
import { FuzzySearch } from '#utils/Parsers/FuzzySearch';
import { validateChannelAccess } from '#utils/util';
import { ChannelMentionRegex, SnowflakeRegex } from '@sapphire/discord-utilities';
import { Argument } from '@sapphire/framework';
import { inlineCodeBlock } from '@sapphire/utilities';
import type { Guild, GuildChannel, Message, ThreadChannel, User } from 'discord.js';

export class UserArgument extends Argument<GuildChannel | ThreadChannel> {
	public resolveChannel(query: string, guild: Guild) {
		const channelId = ChannelMentionRegex.exec(query) ?? SnowflakeRegex.exec(query);
		return (channelId !== null && guild.channels.cache.get(channelId[1])) ?? null;
	}

	public async run(parameter: string, { message, minimum, context, filter }: ChannelArgumentContext) {
		if (!this.isGuildMessage(message)) {
			return this.error({
				parameter,
				message: `I was not able to resolve ${inlineCodeBlock(parameter)} because this argument requires to be run in a server channel.`,
				context
			});
		}

		filter = this.getFilter(message.author, filter);

		const resChannel = this.resolveChannel(parameter, message.guild);
		if (resChannel && filter(resChannel)) return this.ok(resChannel);

		const result = await new FuzzySearch(message.guild.channels.cache, (entry) => entry.name, filter).run(message, parameter, minimum);

		if (result) {
			return this.ok(result[1]);
		}

		return this.error({
			parameter,
			message: `I could not resolve ${inlineCodeBlock(
				parameter
			)} to a channel from this server, please make sure you typed its name or ID correctly!`,
			context
		});
	}

	private getFilter(author: User, filter?: (entry: GuildChannel | ThreadChannel) => boolean) {
		const clientUser = author.client.user!;
		return typeof filter === 'undefined'
			? (entry: GuildChannel | ThreadChannel) => validateChannelAccess(entry, author) && validateChannelAccess(entry, clientUser)
			: (entry: GuildChannel | ThreadChannel) =>
					filter(entry) && validateChannelAccess(entry, author) && validateChannelAccess(entry, clientUser);
	}

	private isGuildMessage(message: Message): message is GuildMessage {
		return message.guild !== null;
	}
}

interface ChannelArgumentContext extends Argument.Context<GuildChannel | ThreadChannel> {
	filter?: (entry: GuildChannel | ThreadChannel) => boolean;
}
