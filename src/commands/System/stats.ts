import { ArchAngelCommand } from '#lib/extensions/ArchAngelCommand';
import { BrandingColors } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { roundNumber } from '@sapphire/utilities';
import { Message, MessageEmbed, version } from 'discord.js';
import { CpuInfo, cpus, uptime } from 'os';

@ApplyOptions<ArchAngelCommand.Options>({
	aliases: ['stats', 'sts'],
	description: 'Provides some details about the bot and stats.',
	permissions: ['EMBED_LINKS']
})
export class UserCommand extends ArchAngelCommand {
	public run(message: Message) {
		return message.send(this.buildEmbed());
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
			stats: `• **Users**: ${stats.users}}\n• **Guilds**: ${stats.guilds}\n• **Channels**: ${stats.channels}}\n• **Discord.js**: ${stats.version}}\n• **Node.js**: ${stats.nodeJs}`,
			uptime: `• **Host**: ${this.context.client.EnGbHandler.duration.format(
				uptime.host
			)}\n• **Total**: ${this.context.client.EnGbHandler.duration.format(
				uptime.total
			)}\n• **Client**: ${this.context.client.EnGbHandler.duration.format(uptime.client)}`,
			serverUsage: `• **CPU Load**: ${usage.cpuLoad}}\n• **Heap**: ${usage.ramUsed}MB (Total: ${usage.ramTotal}}MB)`
		};

		return new MessageEmbed()
			.setColor(BrandingColors.Primary)
			.addField(titles.stats, fields.stats)
			.addField(titles.uptime, fields.uptime)
			.addField(titles.serverUsage, fields.serverUsage);
	}

	private get generalStatistics(): StatsGeneral {
		const { client } = this.context;
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
			client: this.context.client.uptime!,
			host: uptime() * 1000,
			total: process.uptime() * 1000
		};
	}

	private get usageStatistics(): StatsUsage {
		const usage = process.memoryUsage();
		return {
			cpuLoad: cpus().map(UserCommand.formatCpuInfo.bind(null)).join(' | '),
			ramTotal: usage.heapTotal / 1048576,
			ramUsed: usage.heapUsed / 1048576
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
	client: number;
	host: number;
	total: number;
}

export interface StatsUsage {
	cpuLoad: string;
	ramTotal: number;
	ramUsed: number;
}
