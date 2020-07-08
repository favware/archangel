import { Embed, Piece, TextChannel } from '@klasa/core';
import { StatsGeneral, StatsUptime, StatsUsage } from '@root/commands/System/stats';

export interface LanguageKeys {
	/**
	 * #################################
	 * #             BASIC            #
	 * #################################
	 */

	DEFAULT: (key: string) => string;
	DEFAULT_LANGUAGE: string;
	PREFIX_REMINDER: (prefix: string) => string;

	/**
	 * #################################
	 * #            SETTINGS           #
	 * #################################
	 */

	CONFIGURATION_EQUALS: string;
	SETTING_GATEWAY_EXPECTS_GUILD: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	SETTING_GATEWAY_INVALID_FILTERED_VALUE(piece: any, key: string): string;
	SETTING_GATEWAY_INVALID_TYPE: string;
	SETTING_GATEWAY_KEY_NOEXT(key: string): string;
	SETTING_GATEWAY_KEY_NOT_ARRAY(key: string): string;
	SETTING_GATEWAY_SPECIFY_VALUE: string;
	SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT(data: string, value: string): string;
	SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT(data: string, value: string): string;

	/**
	 * #################################
	 * #           RESOLVERS           #
	 * #################################
	 */

	RESOLVER_CHANNEL_NOT_IN_GUILD: string;
	RESOLVER_INVALID_BOOL(name: string): string;
	RESOLVER_INVALID_CHANNEL(name: string): string;
	RESOLVER_INVALID_CHANNELNAME: (name: string) => string;
	RESOLVER_INVALID_CUSTOM(name: string, type: string): string;
	RESOLVER_INVALID_DATE(name: string): string;
	RESOLVER_INVALID_DURATION(name: string): string;
	RESOLVER_INVALID_EMOJI(name: string): string;
	RESOLVER_INVALID_FLOAT(name: string): string;
	RESOLVER_INVALID_GUILD(name: string): string;
	RESOLVER_INVALID_INT(name: string): string;
	RESOLVER_INVALID_LITERAL(name: string): string;
	RESOLVER_INVALID_MEMBER(name: string): string;
	RESOLVER_INVALID_MESSAGE(name: string): string;
	RESOLVER_INVALID_PIECE(name: string, piece: Piece): string;
	RESOLVER_INVALID_REGEX_MATCH(name: string, pattern: RegExp): string;
	RESOLVER_INVALID_ROLE(name: string): string;
	RESOLVER_INVALID_STRING(name: string): string;
	RESOLVER_INVALID_TIME(name: string): string;
	RESOLVER_INVALID_URL(name: string): string;
	RESOLVER_INVALID_USER(name: string): string;
	RESOLVER_INVALID_USERNAME: (name: string) => string;
	RESOLVER_MEMBERNAME_USER_LEFT_DURING_PROMPT: string;
	RESOLVER_MINMAX_BOTH(name: string, min: number, max: number, suffix: string): string;
	RESOLVER_MINMAX_EXACTLY(name: string, min: number, suffix: string): string;
	RESOLVER_MINMAX_MAX(name: string, max: number, suffix: string): string;
	RESOLVER_MINMAX_MIN(name: string, min: number, suffix: string): string;
	RESOLVER_MULTI_TOO_FEW(name: string, min?: number): string;
	RESOLVER_STRING_SUFFIX: string;

	/**
	 * #################################
	 * #        INTERNAL MISC          #
	 * #################################
	 */

	COMMANDMESSAGE_MISSING_OPTIONALS: (possibles: string) => string;
	COMMANDMESSAGE_MISSING_REQUIRED: (name: string) => string;
	COMMANDMESSAGE_MISSING: string;
	COMMANDMESSAGE_NOMATCH: (possibles: string) => string;
	INHIBITOR_COOLDOWN: (remaining: number, guildCooldown: number) => string;
	INHIBITOR_DISABLED_GLOBAL: string;
	INHIBITOR_DISABLED_GUILD: string;
	INHIBITOR_MISSING_BOT_PERMS: (missing: string[]) => string;
	INHIBITOR_NSFW: string;
	INHIBITOR_PERMISSIONS: string;
	INHIBITOR_REQUIRED_SETTINGS: (settings: readonly string[]) => string;
	INHIBITOR_RUNIN_NONE: (name: string) => string;
	INHIBITOR_RUNIN: (type: string) => string;
	MONITOR_COMMAND_HANDLER_ABORTED: string;
	MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag: string, name: string, time: string, cancelOptions: readonly string[]) => string;
	MONITOR_COMMAND_HANDLER_REPROMPT: (tag: string, name: string, time: string, cancelOptions: readonly string[]) => string;
	REACTIONHANDLER_PROMPT: string;

	/**
	 * #################################
	 * #       CUSTOM ARGUMENTS        #
	 * #################################
	 */

	FUZZYSEARCH_INVALID_INDEX: string;
	FUZZYSEARCH_INVALID_NUMBER: string;
	FUZZYSEARCH_MATCHES: (matches: number, codeblock: string) => string;
	MESSAGE_PROMPT_TIMEOUT: string;
	TEXT_PROMPT_ABORT: string;
	USER_NOT_EXISTENT: string;

	/**
	 * #################################
	 * #        INTERNAL COMMANDS      #
	 * #################################
	 */

	COMMAND_UNLOAD: (type: string, name: string) => string;
	COMMAND_UNLOAD_DESCRIPTION: string;
	COMMAND_UNLOAD_WARN: string;
	COMMAND_TRANSFER_ERROR: string;
	COMMAND_TRANSFER_SUCCESS: (type: string, name: string) => string;
	COMMAND_TRANSFER_FAILED: (type: string, name: string) => string;
	COMMAND_TRANSFER_DESCRIPTION: string;
	COMMAND_RELOAD: (type: string, name: string, time: string) => string;
	COMMAND_RELOAD_ALL: (type: string, time: string) => string;
	COMMAND_RELOAD_EVERYTHING: (time: string) => string;
	COMMAND_RELOAD_DESCRIPTION: string;
	COMMAND_RELOAD_FAILED(type: string, name: string): string;
	COMMAND_REBOOT: string;
	COMMAND_REBOOT_DESCRIPTION: string;
	COMMAND_LOAD: (time: string, type: string, name: string) => string;
	COMMAND_LOAD_FAIL: string;
	COMMAND_LOAD_ERROR: (type: string, name: string, error: string) => string;
	COMMAND_LOAD_DESCRIPTION: string;
	COMMAND_PING: string;
	COMMAND_PING_DESCRIPTION: string;
	COMMAND_PINGPONG: (diff: string, ping: string) => string;
	COMMAND_INVITE(): string;
	COMMAND_INVITE_DESCRIPTION: string;
	COMMAND_INFO: string;
	COMMAND_INFO_DESCRIPTION: string;
	COMMAND_ENABLE: (type: string, name: string) => string;
	COMMAND_ENABLE_DESCRIPTION: string;
	COMMAND_DISABLE: (type: string, name: string) => string;
	COMMAND_DISABLE_DESCRIPTION: string;
	COMMAND_DISABLE_WARN: string;
	COMMAND_CONF_NOKEY: string;
	COMMAND_CONF_NOVALUE: string;
	COMMAND_CONF_GUARDED: (name: string) => string;
	COMMAND_CONF_UPDATED: (key: string, response: string) => string;
	COMMAND_CONF_KEY_NOT_ARRAY: string;
	COMMAND_CONF_GET_NOEXT: (key: string) => string;
	COMMAND_CONF_GET: (key: string, value: string) => string;
	COMMAND_CONF_RESET: (key: string, value: string) => string;
	COMMAND_CONF_NOCHANGE: (key: string) => string;
	COMMAND_CONF_SERVER_DESCRIPTION: string;
	COMMAND_CONF_SERVER: (key: string, list: string) => string;
	COMMAND_CONF_USER_DESCRIPTION: string;
	COMMAND_CONF_USER: (key: string, list: string) => string;
	COMMAND_CONF_SETTING_NOT_SET: string;

	/**
	 * #################################
	 * #        ADMIN COMMANDS         #
	 * #################################
	 */

	COMMAND_EVAL_DESCRIPTION: string;
	COMMAND_EVAL_EXTENDED: string;
	COMMAND_EVAL_TIMEOUT: (seconds: number) => string;
	COMMAND_EVAL_ERROR: (time: string, output: string, type: string) => string;
	COMMAND_ECHO_DESCRIPTION: string;
	COMMAND_ECHO_EXTENDED: string;
	COMMAND_SAMPLE_DESCRIPTION: string;
	COMMAND_SAMPLE_EXTENDED: string;

	/**
	 * #################################
	 * #    CONFIGURATION COMMANDS     #
	 * #################################
	 */

	COMMAND_MANAGECOMMANDAUTODELETE_ADD(channel: TextChannel, duration: number): string;
	COMMAND_MANAGECOMMANDAUTODELETE_DESCRIPTION: string;
	COMMAND_MANAGECOMMANDAUTODELETE_EXTENDED: string;
	COMMAND_MANAGECOMMANDAUTODELETE_REMOVE_NOTSET(channelName: string): string;
	COMMAND_MANAGECOMMANDAUTODELETE_REMOVE(channel: TextChannel): string;
	COMMAND_MANAGECOMMANDAUTODELETE_REQUIRED_DURATION: string;
	COMMAND_MANAGECOMMANDAUTODELETE_RESET: string;
	COMMAND_MANAGECOMMANDAUTODELETE_SHOW_EMPTY: string;
	COMMAND_MANAGECOMMANDAUTODELETE_SHOW(data: string): string;
	COMMAND_MANAGECOMMANDAUTODELETE_TEXTCHANNEL: string;
	COMMAND_SETPREFIX_DESCRIPTION: string;
	COMMAND_SETPREFIX_EXTENDED: string;
	COMMAND_SETPREFIX_SET: (prefix: string) => string;

	/**
	 * #################################
	 * #         CORE COMMANDS         #
	 * #################################
	 */
	COMMAND_QUOTE_DESCRIPTION: string;
	COMMAND_QUOTE_EXTENDED: string;
	COMMAND_QUOTE_NO_MESSAGES: string;

	/**
	 * #################################
	 * #        SYSTEM COMMANDS        #
	 * #################################
	 */
	COMMAND_HELP_DESCRIPTION: string;
	COMMAND_HELP_NO_EXTENDED: string;
	COMMAND_HELP_DM: string;
	COMMAND_HELP_NODM: string;
	COMMAND_HELP_ALL_FLAG: (prefix: string) => string;
	COMMAND_HELP_COMMAND_COUNT: (n: number) => string;
	COMMAND_HELP_DATA: {
		TITLE: (description: string) => string;
		USAGE: (usage: string) => string;
		EXTENDED: (extendedHelp: string) => string;
		FOOTER: (name: string) => string;
	};
	COMMAND_STATS_DESCRIPTION: string;
	COMMAND_STATS_EXTENDED: string;
	COMMAND_STATS: (color: number, stats: StatsGeneral, uptime: StatsUptime, usage: StatsUsage) => Embed;

	/**
	 * #################################
	 * #       ARCHANGEL SYSTEM        #
	 * #################################
	 */

	SYSTEM_CANNOT_ACCESS_CHANNEL: string;
	SYSTEM_EXCEEDED_LENGTH_OUTPUT: (output: string, time?: string, type?: string) => string;
	SYSTEM_EXCEEDED_LENGTH_OUTPUT_CONSOLE: (time?: string, type?: string) => string;
	SYSTEM_EXCEEDED_LENGTH_OUTPUT_FILE: (time?: string, type?: string) => string;
	SYSTEM_EXCEEDED_LENGTH_OUTPUT_HASTEBIN: (url: string, time?: string, type?: string) => string;
	SYSTEM_EXCEEDED_LENGTH_CHOOSE_OUTPUT: (output: string[]) => string;
	SYSTEM_LOADING: () => string;
}
