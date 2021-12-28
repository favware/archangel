import { BrandingColors } from '#utils/constants';
import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, MessageCommand } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { roundNumber } from '@sapphire/utilities';
import { MessageEmbed, version } from 'discord.js';
import { cpus, uptime, type CpuInfo } from 'node:os';

@ApplyOptions<ChatInputCommand.Options>({
	aliases: ['stats', 'sts'],
	description: 'Provides some details about the bot and stats.',
	requiredClientPermissions: ['EMBED_LINKS'],
	chatInputCommand: {
		register: true,
		guildIds: getGuildIds(),
		idHints: ['925503021197189150']
	}
})
export class UserCommand extends Command {
	public async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		return interaction.reply({ embeds: [this.buildEmbed()], ephemeral: true });
	}

	public messageRun(...[message]: Parameters<MessageCommand['messageRun']>) {
		return send(message, { embeds: [this.buildEmbed()] });
	}

	private buildEmbed() {
		const titles = {
			stats: 'Statistics',
			uptime: 'Uptime',
			serverUsage: 'Server Usage'
		};
		const stats = this.generalStatistics;
		const uptime = this.uptimeStatistics;
		const usage = this.usageStatistics;

		const fields = {
			stats: `• **Users**: ${stats.users}\n• **Guilds**: ${stats.guilds}\n• **Channels**: ${stats.channels}\n• **Discord.js**: ${stats.version}\n• **Node.js**: ${stats.nodeJs}`,
			uptime: `• **Host**: ${uptime.host}\n• **Total**: ${uptime.total}\n• **Client**: ${uptime.client}`,
			serverUsage: `• **CPU Load**: ${usage.cpuLoad}\n• **Heap**: ${usage.ramUsed}MB (Total: ${usage.ramTotal}}MB)`
		};

		return new MessageEmbed()
			.setColor(BrandingColors.Primary)
			.addField(titles.stats, fields.stats)
			.addField(titles.uptime, fields.uptime)
			.addField(titles.serverUsage, fields.serverUsage);
	}

	private get generalStatistics(): StatsGeneral {
		const { client } = this.container;
		return {
			channels: client.channels.cache.size,
			guilds: client.guilds.cache.size,
			nodeJs: process.version,
			users: client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0),
			version: `v${version}`
		};
	}

	private get uptimeStatistics(): StatsUptime {
		return {
			client: this.container.client.EnGbHandler.duration.format(this.container.client.uptime!),
			host: this.container.client.EnGbHandler.duration.format(uptime() * 1000),
			total: this.container.client.EnGbHandler.duration.format(process.uptime() * 1000)
		};
	}

	private get usageStatistics(): StatsUsage {
		const usage = process.memoryUsage();
		return {
			cpuLoad: cpus().map(UserCommand.formatCpuInfo.bind(null)).join(' | '),
			ramTotal: this.container.client.EnGbHandler.number.format(usage.heapTotal / 1048576),
			ramUsed: this.container.client.EnGbHandler.number.format(usage.heapUsed / 1048576)
		};
	}

	private static formatCpuInfo({ times }: CpuInfo) {
		return `${roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100}%`;
	}
}

export interface StatsGeneral {
	channels: number;
	guilds: number;
	nodeJs: string;
	users: number;
	version: string;
}

export interface StatsUptime {
	client: string;
	host: string;
	total: string;
}

export interface StatsUsage {
	cpuLoad: string;
	ramTotal: string;
	ramUsed: string;
}
