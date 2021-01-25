import { PermissionsFlags, version as klasaCoreVersion } from '@klasa/core';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { ApplyOptions } from '@skyra/decorators';
import { getColor, roundNumber } from '@utils/util';
import { KlasaMessage, version as klasaVersion } from 'klasa';
import { cpus, uptime } from 'os';

@ApplyOptions<ArchAngelCommandOptions>({
	aliases: ['stats', 'sts'],
	bucket: 2,
	cooldown: 15,
	description: (language) => language.tget('COMMAND_STATS_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_STATS_EXTENDED'),
	requiredPermissions: [PermissionsFlags.EmbedLinks]
})
export default class extends ArchAngelCommand {
	public async run(message: KlasaMessage) {
		return message.reply((mb) =>
			mb.setEmbed(
				message.language.tget('COMMAND_STATS', getColor(message), this.generalStatistics, this.uptimeStatistics, this.usageStatistics)
			)
		);
	}

	private get generalStatistics(): StatsGeneral {
		return {
			CHANNELS: this.client.channels.size.toLocaleString(),
			GUILDS: this.client.guilds.size.toLocaleString(),
			NODE_JS: process.version,
			USERS: this.client.guilds.reduce((a, b) => a + b.members.size, 0).toLocaleString(),
			KLASA_CORE_VERSION: `v${klasaCoreVersion}`,
			KLASA_VERSION: `v${klasaVersion}`
		};
	}

	private get uptimeStatistics(): StatsUptime {
		return {
			HOST: uptime() * 1000,
			PROCESS: process.uptime() * 1000
		};
	}

	private get usageStatistics(): StatsUsage {
		const usage = process.memoryUsage();
		return {
			CPU_LOAD: cpus().map(({ times }) => roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100),
			RAM_TOTAL: `${Math.round(100 * (usage.heapTotal / 1048576)) / 100}MB`,
			RAM_USED: `${Math.round(100 * (usage.heapUsed / 1048576)) / 100}MB`
		};
	}
}

export interface StatsGeneral {
	CHANNELS: string;
	GUILDS: string;
	NODE_JS: string;
	USERS: string;
	KLASA_CORE_VERSION: string;
	KLASA_VERSION: string;
}

export interface StatsUptime {
	HOST: number;
	PROCESS: number;
}

export interface StatsUsage {
	CPU_LOAD: number[];
	RAM_TOTAL: string;
	RAM_USED: string;
}
