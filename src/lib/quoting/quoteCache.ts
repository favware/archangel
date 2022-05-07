import type { GuildMessage } from '#lib/types/Discord';
import { Collection, Snowflake } from 'discord.js';

export const quoteCache = new Collection<Snowflake, Quote>();

export interface Quote {
  timeCreated: number;
  startMessage?: GuildMessage;
  endMessage?: GuildMessage;
}
