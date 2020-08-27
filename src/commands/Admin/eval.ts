import { Stopwatch } from '@klasa/stopwatch';
import { Type } from '@klasa/type';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { Events, PermissionLevels } from '@lib/types/Enums';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { ApplyOptions } from '@skyra/decorators';
import { clean } from '@utils/clean';
import { EvalExtraData, handleMessage } from '@utils/ExceededLengthParser';
import { sleep } from '@utils/sleep';
import { KlasaMessage } from 'klasa';
import { inspect } from 'util';

@ApplyOptions<ArchAngelCommandOptions>({
	aliases: ['ev'],
	description: (language) => language.tget('COMMAND_EVAL_DESCRIPTION'),
	extendedHelp: (language) => language.tget('COMMAND_EVAL_EXTENDED'),
	guarded: true,
	permissionLevel: PermissionLevels.BotOwner,
	usage: '<expression:str>',
	flagSupport: true
})
export default class extends ArchAngelCommand {
	private readonly kTimeout = 60000;

	public async run(message: KlasaMessage, [code]: [string]) {
		const flagTime = 'no-timeout' in message.flagArgs ? ('wait' in message.flagArgs ? Number(message.flagArgs.wait) : this.kTimeout) : Infinity;
		const language = message.flagArgs.lang || message.flagArgs.language || (message.flagArgs.json ? 'json' : 'js');
		const { success, result, time, type } = await this.timedEval(message, code, flagTime);

		if (message.flagArgs.silent) {
			if (!success && result && ((result as unknown) as Error).stack) this.client.emit(Events.Wtf, ((result as unknown) as Error).stack);
			return null;
		}

		const footer = codeBlock('ts', type);
		const sendAs = message.flagArgs.output || message.flagArgs['output-to'] || (message.flagArgs.log ? 'log' : null);
		return handleMessage<Partial<EvalExtraData>>(message, {
			sendAs,
			hastebinUnavailable: false,
			url: null,
			canLogToConsole: true,
			success,
			result,
			time,
			footer,
			language
		});
	}

	private timedEval(message: KlasaMessage, code: string, flagTime: number) {
		if (flagTime === Infinity || flagTime === 0) return this.eval(message, code);
		return Promise.race([
			sleep(flagTime).then(() => ({
				result: message.language.tget('COMMAND_EVAL_TIMEOUT', flagTime / 1000),
				success: false,
				time: '⏱ ...',
				type: 'EvalTimeoutError'
			})),
			this.eval(message, code)
		]);
	}

	// Eval the input
	private async eval(message: KlasaMessage, code: string) {
		const stopwatch = new Stopwatch();
		let success: boolean | undefined = undefined;
		let syncTime: string | undefined = undefined;
		let asyncTime: string | undefined = undefined;
		let result: unknown | undefined = undefined;
		let thenable = false;
		let type: Type | undefined = undefined;
		try {
			if (message.flagArgs.async) code = `(async () => {\n${code}\n})();`;

			// @ts-expect-error 6133
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const msg = message;
			// eslint-disable-next-line no-eval
			result = eval(code);
			syncTime = stopwatch.toString();
			type = new Type(result);
			if (isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (thenable && !asyncTime) asyncTime = stopwatch.toString();
			if (!type!) type = new Type(error);
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (typeof result !== 'string') {
			result =
				result instanceof Error
					? result.stack
					: message.flagArgs.json
					? JSON.stringify(result, null, 4)
					: inspect(result, {
							depth: message.flagArgs.depth ? parseInt(message.flagArgs.depth, 10) || 0 : 0,
							showHidden: Boolean(message.flagArgs.showHidden)
							// prettier-ignore
					 	}); // eslint-disable-line
		}
		return { success, type: type!, time: this.formatTime(syncTime, asyncTime ?? ''), result: clean(result as string) };
	}

	private formatTime(syncTime: string, asyncTime: string) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}
}
