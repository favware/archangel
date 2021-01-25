import { Embed, PermissionsFlags } from '@klasa/core';
import { codeBlock, toTitleCase } from '@sapphire/utilities';
import type { LanguageKeys } from '@lib/types/Languages';
import { Emojis } from '@utils/constants';
import friendlyDuration, { DurationFormatAssetsTime, TimeTypes } from '@utils/FriendlyDuration';
import { LanguageHelp } from '@utils/LanguageHelp';
import { createPick } from '@utils/util';
import { Language } from 'klasa';

const LOADING = Emojis.Loading;
const GREENTICK = Emojis.GreenTick;
const REDCROSS = Emojis.RedCross;

const builder = new LanguageHelp()
	.setExplainedUsage('⚙ | ***Explained usage***')
	.setPossibleFormats('🔢 | ***Possible formats***')
	.setExamples('🔗 | ***Examples***')
	.setReminder('⏰ | ***Reminder***');

const TIMES: DurationFormatAssetsTime = {
	[TimeTypes.Year]: {
		1: 'year',
		DEFAULT: 'years'
	},
	[TimeTypes.Month]: {
		1: 'month',
		DEFAULT: 'months'
	},
	[TimeTypes.Week]: {
		1: 'week',
		DEFAULT: 'weeks'
	},
	[TimeTypes.Day]: {
		1: 'day',
		DEFAULT: 'days'
	},
	[TimeTypes.Hour]: {
		1: 'hour',
		DEFAULT: 'hours'
	},
	[TimeTypes.Minute]: {
		1: 'minute',
		DEFAULT: 'minutes'
	},
	[TimeTypes.Second]: {
		1: 'second',
		DEFAULT: 'seconds'
	}
};

const PERMS = {
	[PermissionsFlags.Administrator]: 'Administrator',
	[PermissionsFlags.ViewAuditLog]: 'View Audit Log',
	[PermissionsFlags.ManageGuild]: 'Manage Server',
	[PermissionsFlags.ManageRoles]: 'Manage Roles',
	[PermissionsFlags.ManageChannels]: 'Manage Channels',
	[PermissionsFlags.KickMembers]: 'Kick Members',
	[PermissionsFlags.BanMembers]: 'Ban Members',
	[PermissionsFlags.CreateInstantInvite]: 'Create Instant Invite',
	[PermissionsFlags.ChangeNickname]: 'Change Nickname',
	[PermissionsFlags.ManageNicknames]: 'Manage Nicknames',
	[PermissionsFlags.ManageEmojis]: 'Manage Emojis',
	[PermissionsFlags.ManageWebhooks]: 'Manage Webhooks',
	[PermissionsFlags.ViewChannel]: 'Read Messages',
	[PermissionsFlags.SendMessages]: 'Send Messages',
	[PermissionsFlags.SendTTSMessages]: 'Send TTS Messages',
	[PermissionsFlags.ManageMessages]: 'Manage Messages',
	[PermissionsFlags.EmbedLinks]: 'Embed Links',
	[PermissionsFlags.AttachFiles]: 'Attach Files',
	[PermissionsFlags.ReadMessageHistory]: 'Read Message History',
	[PermissionsFlags.MentionEveryone]: 'Mention Everyone',
	[PermissionsFlags.UseExternalEmojis]: 'Use External Emojis',
	[PermissionsFlags.AddReactions]: 'Add Reactions',
	[PermissionsFlags.Connect]: 'Connect',
	[PermissionsFlags.Speak]: 'Speak',
	[PermissionsFlags.Stream]: 'Stream',
	[PermissionsFlags.MuteMembers]: 'Mute Members',
	[PermissionsFlags.DeafenMembers]: 'Deafen Members',
	[PermissionsFlags.MoveMembers]: 'Move Members',
	[PermissionsFlags.UseVAD]: 'Use Voice Activity',
	[PermissionsFlags.PrioritySpeaker]: 'Priority Speaker',
	[PermissionsFlags.ViewGuildInsights]: 'View Guild Insights'
};

function duration(time: number, precision?: number) {
	return friendlyDuration(time, TIMES, precision);
}

export default class extends Language {
	public PERMISSIONS = PERMS;
	public HUMAN_LEVELS = {
		0: 'None',
		1: 'Low',
		2: 'Medium',
		3: '(╯°□°）╯︵ ┻━┻',
		4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
	};

	public duration = duration;

	// @ts-expect-error:2416
	public language: LanguageKeys = {
		/**
		 * #################################
		 * #             BASIC            #
		 * #################################
		 */
		DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
		DEFAULT_LANGUAGE: 'Default Language',
		PREFIX_REMINDER: (prefix) => `The prefix in this guild is set to: \`${prefix}\``,

		/**
		 * #################################
		 * #            SETTINGS           #
		 * #################################
		 */

		CONFIGURATION_EQUALS: 'Successfully configured: no changes were made.',
		SETTING_GATEWAY_EXPECTS_GUILD: 'The parameter <Guild> expects either a Guild or a Guild Object.',
		SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `The value ${data} for the key ${key} does not exist.`,
		SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `The value ${data} for the key ${key} already exists.`,
		SETTING_GATEWAY_SPECIFY_VALUE: 'You must specify the value to add or filter.',
		SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `The key ${key} is not an Array.`,
		SETTING_GATEWAY_KEY_NOEXT: (key) => `The key ${key} does not exist in the current data schema.`,
		SETTING_GATEWAY_INVALID_TYPE: 'The type parameter must be either add or remove.',
		SETTING_GATEWAY_INVALID_FILTERED_VALUE: (piece, value) => `${piece.key} doesn't accept the value: ${value}`,

		/**
		 * #################################
		 * #           RESOLVERS           #
		 * #################################
		 */

		RESOLVER_CHANNEL_NOT_IN_GUILD: 'I am sorry, but that command can only be ran in a server.',
		RESOLVER_INVALID_BOOL: (name) => `${name} must be true or false.`,
		RESOLVER_INVALID_CHANNEL: (name) => `${name} must be a channel tag or valid channel id.`,
		RESOLVER_INVALID_CHANNELNAME: (name) => `${name} must be a valid channel name, id, or tag.`,
		RESOLVER_INVALID_CUSTOM: (name, type) => `${name} must be a valid ${type}.`,
		RESOLVER_INVALID_DATE: (name) => `${name} must be a valid date.`,
		RESOLVER_INVALID_DURATION: (name) => `${name} must be a valid duration string.`,
		RESOLVER_INVALID_EMOJI: (name) => `${name} must be a custom emoji tag or valid emoji id.`,
		RESOLVER_INVALID_FLOAT: (name) => `${name} must be a valid number.`,
		RESOLVER_INVALID_GUILD: (name) => `${name} must be a valid guild id.`,
		RESOLVER_INVALID_INT: (name) => `${name} must be an integer.`,
		RESOLVER_INVALID_LITERAL: (name) => `Your option did not match the only possibility: ${name}`,
		RESOLVER_INVALID_MEMBER: (name) => `${name} must be a mention or valid user id.`,
		RESOLVER_INVALID_MESSAGE: (name) => `${name} must be a valid message id.`,
		RESOLVER_INVALID_PIECE: (name, piece) => `${name} must be a valid ${piece} name.`,
		RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${name} must follow this regex pattern \`${pattern}\`.`,
		RESOLVER_INVALID_ROLE: (name) => `${name} must be a role mention or role id.`,
		RESOLVER_INVALID_STRING: (name) => `${name} must be a valid string.`,
		RESOLVER_INVALID_TIME: (name) => `${name} must be a valid duration or date string.`,
		RESOLVER_INVALID_URL: (name) => `${name} must be a valid url.`,
		RESOLVER_INVALID_USER: (name) => `${name} must be a mention or valid user id.`,
		RESOLVER_INVALID_USERNAME: (name) => `${name} must be a valid user name, id, or mention.`,
		RESOLVER_MEMBERNAME_USER_LEFT_DURING_PROMPT: 'User left during prompt.',
		RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} must be between ${min} and ${max}${suffix}.`,
		RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} must be exactly ${min}${suffix}.`,
		RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} must be less than ${max}${suffix}.`,
		RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} must be greater than ${min}${suffix}.`,
		RESOLVER_MULTI_TOO_FEW: (name, min = 1) => `Provided too few ${name}s. At least ${min} ${min === 1 ? 'is' : 'are'} required.`,
		RESOLVER_STRING_SUFFIX: ' characters',

		/**
		 * #################################
		 * #        INTERNAL MISC          #
		 * #################################
		 */

		COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Missing a required option: (${possibles})`,
		COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${name} is a required argument.`,
		COMMANDMESSAGE_MISSING: 'Missing one or more required arguments after end of input.',
		COMMANDMESSAGE_NOMATCH: (possibles) => `Your option didn't match any of the possibilities: (${possibles})`,
		INHIBITOR_COOLDOWN: (remaining, guildCooldown) =>
			`${guildCooldown ? 'Someone has' : 'You have'} already used this command. You can use this command again in ${remaining} second${
				remaining === 1 ? '' : 's'
			}.`,
		INHIBITOR_DISABLED_GLOBAL: 'This command has been globally disabled by the bot owner.',
		INHIBITOR_DISABLED_GUILD: 'This command has been disabled by an admin in this guild.',
		INHIBITOR_MISSING_BOT_PERMS: (missing) => `Insufficient permissions, missing: **${missing}**`,
		INHIBITOR_NSFW: 'You can only use NSFW commands in NSFW channels.',
		INHIBITOR_PERMISSIONS: 'You do not have permission to use this command.',
		INHIBITOR_REQUIRED_SETTINGS: (settings) =>
			`The guild is missing the **${settings.join(', ')}** guild setting${settings.length === 1 ? '' : 's'} and thus the command cannot run.`,
		INHIBITOR_RUNIN_NONE: (name) => `The ${name} command is not configured to run in any channel.`,
		INHIBITOR_RUNIN: (types) => `This command is only available in ${types} channels.`,
		MONITOR_COMMAND_HANDLER_ABORTED: 'Aborted',
		MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time, cancelOptions) =>
			`${tag} | **${name}** is a repeating argument | You have **${time}** seconds to respond to this prompt with additional valid arguments. Type **${cancelOptions.join(
				'**, **'
			)}** to cancel this prompt.`,
		MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time, abortTerm) =>
			`${tag} | **${error}** | You have **${time}** seconds to respond to this prompt with a valid argument. Type **${abortTerm}** to abort this prompt.`,
		REACTIONHANDLER_PROMPT: 'Which page would you like to jump to?',

		/**
		 * #################################
		 * #       CUSTOM ARGUMENTS        #
		 * #################################
		 */
		FUZZYSEARCH_INVALID_INDEX: 'That number was out of range, aborting prompt.',
		FUZZYSEARCH_INVALID_NUMBER: 'I expected you to give me a (single digit) number, got a potato.',
		FUZZYSEARCH_MATCHES: (matches, codeblock) =>
			`I found multiple matches! **Please select a number within 0 and ${matches}**:\n${codeblock}\nWrite **ABORT** if you want to exit the prompt.`,
		MESSAGE_PROMPT_TIMEOUT: 'The prompt has timed out.',
		TEXT_PROMPT_ABORT: 'abort',
		USER_NOT_EXISTENT: 'This user does not exist. Are you sure you used a valid user ID?',

		/**
		 * #################################
		 * #        INTERNAL COMMANDS      #
		 * #################################
		 */
		COMMAND_UNLOAD: (type, name) => `${GREENTICK} Unloaded ${type}: ${name}`,
		COMMAND_UNLOAD_DESCRIPTION: 'Unloads the klasa piece.',
		COMMAND_UNLOAD_WARN: "You probably don't want to unload that, since you wouldn't be able to run any command to enable it again",
		COMMAND_TRANSFER_ERROR: `${REDCROSS} That file has been transfered already or never existed.`,
		COMMAND_TRANSFER_SUCCESS: (type, name) => `${GREENTICK} Successfully transferred ${type}: ${name}.`,
		COMMAND_TRANSFER_FAILED: (type, name) => `Transfer of ${type}: ${name} to Client has failed. Please check your Console.`,
		COMMAND_TRANSFER_DESCRIPTION: 'Transfers a core piece to its respective folder.',
		COMMAND_RELOAD: (type, name, time) => `${GREENTICK} Reloaded ${type}: ${name}. (Took: ${time})`,
		COMMAND_RELOAD_FAILED: (type, name) => `${REDCROSS} Failed to reload ${type}: ${name}. Please check your Console.`,
		COMMAND_RELOAD_ALL: (type, time) => `${GREENTICK} Reloaded all ${type}. (Took: ${time})`,
		COMMAND_RELOAD_EVERYTHING: (time) => `${GREENTICK} Reloaded everything. (Took: ${time})`,
		COMMAND_RELOAD_DESCRIPTION: 'Reloads a klasa piece, or all pieces of a klasa store.',
		COMMAND_REBOOT: 'Rebooting...',
		COMMAND_REBOOT_DESCRIPTION: 'Reboots the bot.',
		COMMAND_LOAD: (time, type, name) => `${GREENTICK} Successfully loaded ${type}: ${name}. (Took: ${time})`,
		COMMAND_LOAD_FAIL: 'The file does not exist, or an error occurred while loading your file. Please check your console.',
		COMMAND_LOAD_ERROR: (type, name, error) => `${REDCROSS} Failed to load ${type}: ${name}. Reason:${codeBlock('js', error)}`,
		COMMAND_LOAD_DESCRIPTION: 'Load a piece from your bot.',
		COMMAND_PING: `${LOADING} Ping?`,
		COMMAND_PING_DESCRIPTION: 'Runs a connection test to Discord.',
		COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`,
		COMMAND_INVITE: () =>
			[
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				`To add ${this.client.user!.username} to your discord guild:`,
				`<${this.client.invite}>`,
				codeBlock(
					'',
					[
						'The above link is generated requesting the minimum permissions required to use every command currently.',
						"I know not all permissions are right for every guild, so don't be afraid to uncheck any of the boxes.",
						'If you try to use a command that requires more permissions than the bot is granted, it will let you know.'
					].join(' ')
				),
				'Please file an issue at <https://github.com/dirigeants/klasa> if you find any bugs.'
			].join('\n'),
		COMMAND_INVITE_DESCRIPTION: 'Displays the invite link of the bot, to invite it to your guild.',
		COMMAND_INFO: [
			`ArchAngel is a private discord bot for Populous Gaming.`,
			'This bot uses the Klasa framework build on top of the @klasa/core library.',
			'',
			'ArchAngel features:',
			'• Quoting messages in a rich and awesome way.',
			'And more!'
		].join('\n'),
		COMMAND_INFO_DESCRIPTION: 'Provides some information about this bot.',
		COMMAND_ENABLE: (type, name) => `+ Successfully enabled ${type}: ${name}`,
		COMMAND_ENABLE_DESCRIPTION: 'Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',
		COMMAND_DISABLE: (type, name) => `+ Successfully disabled ${type}: ${name}`,
		COMMAND_DISABLE_DESCRIPTION:
			'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.',
		COMMAND_DISABLE_WARN: "You probably don't want to disable that, since you wouldn't be able to run any command to enable it again",
		COMMAND_CONF_NOKEY: 'You must provide a key',
		COMMAND_CONF_NOVALUE: 'You must provide a value',
		COMMAND_CONF_GUARDED: (name) => `${toTitleCase(name)} may not be disabled.`,
		COMMAND_CONF_UPDATED: (key, response) => `Successfully updated the key **${key}**: \`${response}\``,
		COMMAND_CONF_KEY_NOT_ARRAY: "This key is not array type. Use the action 'reset' instead.",
		COMMAND_CONF_GET_NOEXT: (key) => `The key **${key}** does not seem to exist.`,
		COMMAND_CONF_GET: (key, value) => `The value for the key **${key}** is: \`${value}\``,
		COMMAND_CONF_RESET: (key, response) => `The key **${key}** has been reset to: \`${response}\``,
		COMMAND_CONF_NOCHANGE: (key) => `The value for **${key}** was already that value.`,
		COMMAND_CONF_SERVER_DESCRIPTION: 'Define per-guild settings.',
		COMMAND_CONF_SERVER: (key, list) => `**Guild Settings${key}**\n${list}`,
		COMMAND_CONF_USER_DESCRIPTION: 'Define per-user settings.',
		COMMAND_CONF_USER: (key, list) => `**User Settings${key}**\n${list}`,
		COMMAND_CONF_SETTING_NOT_SET: 'Not Set',

		/**
		 * #################################
		 * #        ADMIN COMMANDS         #
		 * #################################
		 */

		COMMAND_EVAL_DESCRIPTION: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
		COMMAND_EVAL_EXTENDED: builder.display(
			'eval',
			{
				extendedHelp: `The eval command evaluates code as-in, any error thrown from it will be handled.
					It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.
					The --wait flag changes the time the eval will run. Defaults to 10 seconds. Accepts time in milliseconds.
					The --output and --output-to flag accept either 'file', 'log', 'haste' or 'hastebin'.
					The --delete flag makes the command delete the message that executed the message after evaluation.
					The --silent flag will make it output nothing.
					The --depth flag accepts a number, for example, --depth=2, to customize util.inspect's depth.
					The --async flag will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword
					The --showHidden flag will enable the showHidden option in util.inspect.
					The --lang and --language flags allow different syntax highlight for the output.
					The --json flag converts the output to json
					The --no-timeout flag disables the timeout
					If the output is too large, it'll send the output as a file, or in the console if the bot does not have the ${PERMS.ATTACH_FILES} permission.`,
				examples: ['msg.author!.username;', '1 + 1;']
			},
			true
		),
		COMMAND_EVAL_TIMEOUT: (seconds) => `TIMEOUT: Took longer than ${seconds} seconds.`,
		COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Type**:${type}\n${time}`,
		COMMAND_EXEC_DESCRIPTION: 'Execute Order 66.',
		COMMAND_EXEC_EXTENDED: builder.display('exec', {
			extendedHelp: 'You better not know about this.'
		}),
		COMMAND_ECHO_DESCRIPTION: 'Make Archangel send a message to this (or another) channel.',
		COMMAND_ECHO_EXTENDED: builder.display('echo', {
			extendedHelp: 'This should be very obvious...'
		}),
		COMMAND_SAMPLE_DESCRIPTION: 'Testing command',
		COMMAND_SAMPLE_EXTENDED: builder.display('sample', {
			extendedHelp: 'Generates a hardcoded sample image using the image generator. This is for testing purposes'
		}),

		/**
		 * #################################
		 * #    CONFIGURATION COMMANDS     #
		 * #################################
		 */
		COMMAND_MANAGECOMMANDAUTODELETE_ADD: (channel, time) =>
			`${GREENTICK} Success! All successful commands in ${channel} will be deleted after ${duration(time)}!`,
		COMMAND_MANAGECOMMANDAUTODELETE_DESCRIPTION: 'Manage per-channel autodelete timer.',
		COMMAND_MANAGECOMMANDAUTODELETE_EXTENDED: builder.display('manageCommandAutodelete', {
			extendedHelp:
				"This command manages this guild's per-channel command autodelete timer, it serves well to leave a channel clean from commands.",
			explainedUsage: [
				['show', 'Show the autodelete timer for all channels.'],
				['add [channel] <command>', 'Add an autodelete timer for the specified channel.'],
				['remove [channel]', 'Remove the autotimer from the specified channel.'],
				['reset', 'Clear all autodelete timers.']
			],
			reminder: "The channel argument is optional, defaulting to the message's channel, but it uses fuzzy search when possible.",
			examples: ['show', 'add #general 4s', 'remove #general', 'reset']
		}),
		COMMAND_MANAGECOMMANDAUTODELETE_REMOVE_NOTSET: (channel) =>
			`${REDCROSS} The channel ${channel} was not configured to automatically delete messages!`,
		COMMAND_MANAGECOMMANDAUTODELETE_REMOVE: (channel) =>
			`${GREENTICK} Success! Commands will not be automatically deleted in ${channel} anymore!`,
		COMMAND_MANAGECOMMANDAUTODELETE_REQUIRED_DURATION: 'You must specify an amount of seconds for the command to be automatically deleted.',
		COMMAND_MANAGECOMMANDAUTODELETE_RESET: 'All the command autodeletes have been reset.',
		COMMAND_MANAGECOMMANDAUTODELETE_SHOW_EMPTY: 'There are no command autodelete configured right now.',
		COMMAND_MANAGECOMMANDAUTODELETE_SHOW: (codeblock) => `All command autodeletes configured:${codeblock}`,
		COMMAND_MANAGECOMMANDAUTODELETE_TEXTCHANNEL:
			'You must input a valid text channel, people cannot use commands in a voice or a category channel!',
		COMMAND_SETPREFIX_DESCRIPTION: "Set Archangel's prefix.",
		COMMAND_SETPREFIX_EXTENDED: builder.display('setPrefix', {
			extendedHelp: `This command helps you setting up Archangel's prefix. A prefix is an affix that is added in front of the word, in this case, the message.
					It allows bots to distinguish between a regular message and a command. By nature, the prefix between should be different to avoid conflicts. If
					you forget Archangel's prefix, simply mention her with nothing else and she will tell you the current prefix. Alternatively, you can take advantage
					of Archangel's NLP (Natural Language Processing) and prefix the commands with her name and a comma. For example, "Archangel, ping".`,
			explainedUsage: [['prefix', `The prefix to set. Default one in Archangel is "${this.client.options.commands.prefix}".`]],
			reminder: 'Your prefix should only contain characters everyone can write and type.',
			examples: ['&', '=']
		}),
		COMMAND_SETPREFIX_SET: (prefix) => `Successfully set the prefix to \`${prefix}\`. Use \`${prefix}setPrefix\` <prefix> to change it again.`,

		/**
		 * #################################
		 * #         CORE COMMANDS         #
		 * #################################
		 */
		COMMAND_QUOTE_DESCRIPTION: 'Quotes one or more messages and outputs them in a channel',
		COMMAND_QUOTE_EXTENDED: builder.display(
			'quote',
			{
				extendedHelp: `Ever wanted to quote Arc's misadventures in style? This is your chance!
				By default this command will look for messages in the current channel, as well as output to the current channel. This behaviour can be modified with flags.
				Add \`--channel=<channelID>\` (or \`--sourcechannel=<channelID>\`) to get messages from another, given, channel
				Add \`--targetchannel=<channelID>\` to output the quote to another message`,
				explainedUsage: [['messageIds', 'The message ID or message IDs to include in the quote']],
				examples: [
					'quote 730445626705444947',
					'quote 730445626705444947 726548049731518515',
					'quote 730445626705444947 726548049731518515 --channel=512351625428336700',
					'quote 730445626705444947 726548049731518515 --channel=512351625428336700 --targetchannel=512352714190225409'
				]
			},
			true
		),
		COMMAND_QUOTE_NO_MESSAGES: `${REDCROSS} I'm sorry, but I was unable to find any messages to quote`,

		/**
		 * #################################
		 * #        SYSTEM COMMANDS        #
		 * #################################
		 */
		COMMAND_HELP_DESCRIPTION: 'Display help for a command.',
		COMMAND_HELP_NO_EXTENDED: 'No extended help available.',
		COMMAND_HELP_DM: '📥 | The list of commands you have access to has been sent to your DMs.',
		COMMAND_HELP_NODM: `${REDCROSS} | You have DMs disabled, I couldn't send you the commands in DMs.`,
		COMMAND_HELP_ALL_FLAG: (prefix) =>
			`Displaying one category per page. Have issues with the embed? Run \`${prefix}help --all\` for a full list in DMs.`,
		COMMAND_HELP_COMMAND_COUNT: (n) => `${n} command${n === 1 ? '' : 's'}`,
		COMMAND_HELP_DATA: {
			TITLE: (description) => `${description}`,
			USAGE: (usage) => `📝 | ***Command Usage***\n\`${usage}\`\n`,
			EXTENDED: (extendedHelp) => `🔍 | ***Extended Help***\n${extendedHelp}`,
			FOOTER: (name) => `Command help for ${name}`
		},
		COMMAND_STATS_DESCRIPTION: 'Provides some details about the bot and stats.',
		COMMAND_STATS_EXTENDED: builder.display('stats', {
			extendedHelp: 'This should be very obvious...'
		}),
		COMMAND_STATS: (color, stats, uptime, usage) =>
			new Embed()
				.setColor(color)
				.addField(
					'Statistics',
					[
						`• **Users**: ${stats.USERS}`,
						`• **Guilds**: ${stats.GUILDS}`,
						`• **Channels**: ${stats.CHANNELS}`,
						`• **@klasa/core**: ${stats.KLASA_CORE_VERSION}`,
						`• **Klasa**: ${stats.KLASA_VERSION}`,
						`• **Node.js**: ${stats.NODE_JS}`
					].join('\n')
				)
				.addField('Uptime', [`• **Host**: ${duration(uptime.HOST, 2)}`, `• **Bot**: ${duration(uptime.PROCESS, 2)}`].join('\n'))
				.addField(
					'Server Usage',
					[`• **CPU Load**: ${usage.CPU_LOAD.join('% | ')}%`, `• **Heap**: ${usage.RAM_USED} (Total: ${usage.RAM_TOTAL})`].join('\n')
				),

		/**
		 * #################################
		 * #       ARCHANGEL SYSTEM        #
		 * #################################
		 */

		SYSTEM_CANNOT_ACCESS_CHANNEL: 'I am sorry, but you do not have permission to see that channel.',
		SYSTEM_EXCEEDED_LENGTH_OUTPUT: (output, time, type) =>
			`**Output**:${output}${type !== undefined && time !== undefined ? `\n**Type**:${type}\n${time}` : ''}`,
		SYSTEM_EXCEEDED_LENGTH_OUTPUT_CONSOLE: (time, type) =>
			`Sent the result to console.${type !== undefined && time !== undefined ? `\n**Type**:${type}\n${time}` : ''}`,
		SYSTEM_EXCEEDED_LENGTH_OUTPUT_FILE: (time, type) =>
			`Sent the result as a file.${type !== undefined && time !== undefined ? `\n**Type**:${type}\n${time}` : ''}`,
		SYSTEM_EXCEEDED_LENGTH_OUTPUT_HASTEBIN: (url, time, type) =>
			`Sent the result to hastebin: ${url}${type !== undefined && time !== undefined ? `\n**Type**:${type}\n${time}` : ''}`,
		SYSTEM_EXCEEDED_LENGTH_CHOOSE_OUTPUT: (options) => `Choose one of the following options: ${this.list(options, 'or')}`,
		SYSTEM_LOADING: createPick([
			`${LOADING} Flying to heaven and back...`,
			`${LOADING} Man this tunnel sure is long...`,
			`${LOADING} Stichy there, stichy here, we'll get your result soon...`,
			`${LOADING} Brb, I just need to get a drink...`,
			`${LOADING} Let me finish this match...`,
			`${LOADING} Just give me a moment...`
		])
	};
}
