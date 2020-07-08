import { T } from './Shared';

/* eslint-disable @typescript-eslint/no-namespace */

export namespace GuildSettings {
	export const Prefix = T<string>('prefix');
	export const CommandAutodelete = T<readonly [string, number][]>('command-autodelete');
}
