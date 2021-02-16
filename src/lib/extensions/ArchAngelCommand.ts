import { PermissionLevels } from '#lib/types/Enums';
import { Args as SapphireArgs, CommandContext, PermissionsPrecondition, PieceContext, PreconditionEntryResolvable } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { PermissionResolvable } from 'discord.js';
import { sep } from 'path';

export abstract class ArchAngelCommand extends SubCommandPluginCommand<SapphireArgs, ArchAngelCommand> {
	public readonly permissionLevel: PermissionLevels;

	/**
	 * The full category for the command
	 * @since 0.0.1
	 * @type {string[]}
	 */
	public readonly fullCategory: readonly string[];

	public constructor(context: PieceContext, options: ArchAngelCommand.Options) {
		super(context, ArchAngelCommand.resolvePreConditions(context, options));

		this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;

		// Hack that works for ArchAngel as the commands are always in **/commands/**/*
		const paths = context.path.split(sep);
		this.fullCategory = paths.slice(paths.indexOf('commands') + 1, -1);
	}

	/**
	 * The main category for the command
	 */
	public get category(): string {
		return this.fullCategory.length > 0 ? this.fullCategory[0] : 'General';
	}

	/**
	 * The sub category for the command
	 */
	public get subCategory(): string {
		return this.fullCategory.length > 1 ? this.fullCategory[1] : 'General';
	}

	protected static resolvePreConditions(context: PieceContext, options: ArchAngelCommand.Options): ArchAngelCommand.Options {
		options.generateDashLessAliases ??= true;

		const preconditions = (options.preconditions ??= []) as PreconditionEntryResolvable[];

		if (options.permissions) preconditions.push(new PermissionsPrecondition(options.permissions));

		const runInPreCondition = this.resolveRunInPreCondition(context, options.runIn);
		if (runInPreCondition !== null) preconditions.push(runInPreCondition);

		const permissionLevelPreCondition = this.resolvePermissionLevelPreCondition(options.permissionLevel);
		if (permissionLevelPreCondition !== null) preconditions.push(permissionLevelPreCondition);

		return options;
	}

	protected static resolvePermissionLevelPreCondition(permissionLevel = 0): PreconditionEntryResolvable | null {
		if (permissionLevel === 0) return null;
		if (permissionLevel <= PermissionLevels.Moderator) return ['BotOwner', 'Moderator'];
		if (permissionLevel <= PermissionLevels.Administrator) return ['BotOwner', 'Administrator'];
		if (permissionLevel <= PermissionLevels.BotOwner) return 'BotOwner';
		return null;
	}

	protected static resolveRunInPreCondition(context: PieceContext, runIn?: ArchAngelCommand.RunInOption[]): PreconditionEntryResolvable | null {
		runIn = [...new Set(runIn ?? (['text', 'news', 'dm'] as const))];

		// If all channels are allowed, do not add a precondition:
		if (runIn.length === 3) return null;
		if (runIn.length === 0) throw new Error(`ArchAngelCommand[${context.name}]: "runIn" was specified as an empty array.`);

		const array: string[] = [];
		if (runIn.includes('dm')) array.push('DMOnly');

		const hasText = runIn.includes('text');
		const hasNews = runIn.includes('news');
		if (hasText && hasNews) array.push('GuildOnly');
		else if (hasText) array.push('TextOnly');
		else if (hasNews) array.push('NewsOnly');

		return array;
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ArchAngelCommand {
	export type RunInOption = 'text' | 'news' | 'dm';

	/**
	 * The ArchAngelCommand Options
	 */
	export type Options = SubCommandPluginCommand.Options & {
		permissionLevel?: number;
		permissions?: PermissionResolvable;
		runIn?: RunInOption[];
	};

	export type Args = SapphireArgs;
	export type Context = CommandContext;
}
