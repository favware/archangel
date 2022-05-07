import { BrandingColors } from '#utils/constants';
import { getGuildIds } from '#utils/util';
import { hideLinkEmbed, hyperlink, time, TimestampStyles } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, version as sapphireVersion, type ChatInputCommand } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { roundNumber } from '@sapphire/utilities';
import { MessageActionRow, MessageButton, MessageEmbed, version } from 'discord.js';
import { cpus, uptime, type CpuInfo } from 'node:os';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Provides information about ArchAngel',
  chatInputCommand: {
    register: true,
    guildIds: getGuildIds(),
    idHints: ['925521429770960917', '925592925340049478']
  }
})
export class UserCommand extends Command {
  readonly #sapphireNextVersionRegex = /-next\.[a-z0-9]+\.\d{1,}/i;

  readonly #descriptionContent = [
    `ArchAngel is a private discord bot for Populous Gaming built around Discord Interactions.`,
    `This bot uses the ${hyperlink('Sapphire Framework', hideLinkEmbed('https://sapphirejs.dev'))} build on top of ${hyperlink(
      'discord.js',
      hideLinkEmbed('https://discord.js.org')
    )}.`
  ].join('\n');

  public override chatInputRun(interaction: ChatInputCommand.Interaction) {
    return interaction.reply({
      //
      embeds: [this.embed],
      components: this.components,
      ephemeral: true
    });
  }

  private get components(): MessageActionRow[] {
    return [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle('LINK')
          .setURL('https://github.com/favware/archangel')
          .setLabel('GitHub Repository')
          .setEmoji('<:github2:950888087188283422>'),
        new MessageButton() //
          .setStyle('LINK')
          .setURL('https://github.com/sponsors/favna')
          .setLabel('Donate')
          .setEmoji('💞')
      )
    ];
  }

  private get embed(): MessageEmbed {
    const titles = {
      stats: 'Statistics',
      uptime: 'Uptime',
      serverUsage: 'Server Usage'
    };
    const stats = this.generalStatistics;
    const uptime = this.uptimeStatistics;
    const usage = this.usageStatistics;

    const fields = {
      stats: [
        //
        `• **Users**: ${stats.users}`,
        `• **Guilds**: ${stats.guilds}`,
        `• **Channels**: ${stats.channels}`,
        `• **Node.js**: ${stats.nodeJs}`,
        `• **Discord.js**: ${stats.version}`,
        `• **Sapphire Framework**: ${stats.sapphireVersion}`
      ].join('\n'),
      uptime: [
        //
        `• **Host**: ${uptime.host}`,
        `• **Total**: ${uptime.total}`,
        `• **Client**: ${uptime.client}`
      ].join('\n'),
      serverUsage: [
        //
        `• **CPU Load**: ${usage.cpuLoad}`,
        `• **Heap**: ${usage.ramUsed}MB (Total: ${usage.ramTotal}MB)`
      ].join('\n')
    };

    return new MessageEmbed() //
      .setColor(BrandingColors.Primary)
      .setDescription(this.#descriptionContent)
      .setFields(
        {
          name: titles.stats,
          value: fields.stats,
          inline: true
        },
        {
          name: titles.uptime,
          value: fields.uptime
        },
        {
          name: titles.serverUsage,
          value: fields.serverUsage
        }
      );
  }

  private get generalStatistics(): StatsGeneral {
    const { client } = this.container;
    return {
      channels: client.channels.cache.size,
      guilds: client.guilds.cache.size,
      nodeJs: process.version,
      users: client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0),
      version: `v${version}`,
      sapphireVersion: `v${sapphireVersion.replace(this.#sapphireNextVersionRegex, '')}`
    };
  }

  private get uptimeStatistics(): StatsUptime {
    const now = Date.now();
    const nowSeconds = roundNumber(now / 1000);
    return {
      client: time(this.millisecondsToSeconds(now - this.container.client.uptime!), TimestampStyles.RelativeTime),
      host: time(roundNumber(nowSeconds - uptime()), TimestampStyles.RelativeTime),
      total: time(roundNumber(nowSeconds - process.uptime()), TimestampStyles.RelativeTime)
    };
  }

  private get usageStatistics(): StatsUsage {
    const usage = process.memoryUsage();
    return {
      cpuLoad: cpus().slice(0, 2).map(UserCommand.formatCpuInfo.bind(null)).join(' | '),
      ramTotal: this.container.client.EnGbHandler.number.format(usage.heapTotal / 1048576),
      ramUsed: this.container.client.EnGbHandler.number.format(usage.heapUsed / 1048576)
    };
  }

  /**
   * Converts a number of milliseconds to seconds.
   * @param milliseconds The amount of milliseconds
   * @returns The amount of seconds `milliseconds` equals to.
   */
  private millisecondsToSeconds(milliseconds: number): number {
    return roundNumber(milliseconds / Time.Second);
  }

  private static formatCpuInfo({ times }: CpuInfo) {
    return `${roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100}%`;
  }
}

interface StatsGeneral {
  channels: number;
  guilds: number;
  nodeJs: string;
  users: number;
  version: string;
  sapphireVersion: string;
}

interface StatsUptime {
  client: string;
  host: string;
  total: string;
}

interface StatsUsage {
  cpuLoad: string;
  ramTotal: string;
  ramUsed: string;
}
