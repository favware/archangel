import type { CommandInteraction, ContextMenuCommandInteraction, Guild, GuildMember, Message, NewsChannel, TextChannel } from 'discord.js';

export interface GuildCommandInteraction extends CommandInteraction {
  readonly guild: Guild;
  readonly member: GuildMember;
}

export interface GuildContextMenuInteraction extends ContextMenuCommandInteraction {
  readonly guild: Guild;
  readonly member: GuildMember;
}

export interface GuildMessage extends Message {
  channel: TextChannel | NewsChannel;
  readonly guild: Guild;
  readonly member: GuildMember;
}
