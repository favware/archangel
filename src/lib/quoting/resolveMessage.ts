/**
 * @license MIT
 * @copyright 2020 The Sapphire Community and its contributors
 * @see https://github.com/sapphiredev/framework/blob/v2.2.2/src/lib/resolvers/message.ts
 */

import { ChannelMessageRegex, MessageLinkRegex, SnowflakeRegex } from '@sapphire/discord-utilities';
import { GuildBasedChannelTypes, isNewsChannel, isTextChannel } from '@sapphire/discord.js-utilities';
import { err, Identifiers, ok, type Result } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import type { Awaitable } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { CommandInteraction, Message, Snowflake, User } from 'discord.js';

interface MessageResolverOptions {
	parameter: string;
	interaction: CommandInteraction;
}

export async function resolveMessage(parameters: MessageResolverOptions): Promise<Result<Message, Identifiers.ArgumentMessageError>> {
	const message =
		(await resolveById(parameters)) ?? //
		(await resolveByLink(parameters)) ??
		(await resolveByChannelAndMessage(parameters));

	if (message) {
		return ok(message);
	}

	return err(Identifiers.ArgumentMessageError);
}

function resolveById({ parameter, interaction }: MessageResolverOptions): Awaitable<Message | null> {
	const channel = interaction.channel!;

	return SnowflakeRegex.test(parameter) ? channel.messages.fetch(parameter as Snowflake) : null;
}

async function resolveByLink({ parameter, interaction }: MessageResolverOptions): Promise<Message | null> {
	if (!interaction.guild) return null;

	const matches = MessageLinkRegex.exec(parameter);
	if (!matches) return null;
	const [, guildId, channelId, messageId] = matches;

	const guild = container.client.guilds.cache.get(guildId as Snowflake);
	if (guild !== interaction.guild) return null;

	return getMessageFromChannel(channelId, messageId, interaction.member!.user as User);
}

async function resolveByChannelAndMessage({ parameter, interaction }: MessageResolverOptions): Promise<Message | null> {
	const result = ChannelMessageRegex.exec(parameter)?.groups;
	if (!result) return null;

	return getMessageFromChannel(result.channelId, result.messageId, interaction.member!.user as User);
}

async function getMessageFromChannel(channelId: Snowflake, messageId: Snowflake, originalAuthor: User): Promise<Message | null> {
	const channel = container.client.channels.cache.get(channelId) as GuildBasedChannelTypes;
	if (!channel) return null;
	if (!(isNewsChannel(channel) || isTextChannel(channel))) return null;
	if (!channel.viewable) return null;
	if (!channel.permissionsFor(originalAuthor)?.has(PermissionFlagsBits.ViewChannel)) return null;

	return channel.messages.fetch(messageId);
}
