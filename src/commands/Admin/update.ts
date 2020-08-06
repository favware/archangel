import type { Message } from '@klasa/core';
import { codeBlock, exec, sleep } from '@klasa/utils';
import { ArchAngelCommand, ArchAngelCommandOptions } from '@lib/structures/ArchAngelCommand';
import { PermissionLevels } from '@lib/types/Enums';
import { ApplyOptions } from '@skyra/decorators';
import { cutText } from '@utils/util';
import { remove } from 'fs-nextra';
import { resolve } from 'path';
import { Emojis, rootFolder } from '../../lib/util/constants';

@ApplyOptions<ArchAngelCommandOptions>({
	aliases: ['pull'],
	description: 'Update the bot',
	guarded: true,
	permissionLevel: PermissionLevels.BotOwner,
	usage: '[branch:string]'
})
export default class extends ArchAngelCommand {
	public async run(message: Message, [branch = 'main']: [string?]) {
		await this.fetch(message, branch);
		await this.updateDependencies(message);
		await this.cleanDist(message);
		await this.compile(message);
		return message.responses;
	}

	private async compile(message: Message) {
		const { stderr, code } = await this.exec('yarn build');
		if (code !== 0 && stderr.length) throw stderr.trim();
		return message.channel.send((mb) => mb.setContent(`${Emojis.GreenTick} Successfully compiled.`));
	}

	private async cleanDist(message: Message) {
		if (message.flagArgs.fullRebuild) {
			await remove(resolve(rootFolder, 'dist'));
			return message.channel.send((mb) => mb.setContent(`${Emojis.GreenTick} Successfully cleaned old dist directory.`));
		}

		return;
	}

	private async updateDependencies(message: Message) {
		const { stderr, code } = await this.exec('yarn install --frozen-lockfile');
		if (code !== 0 && stderr.length) throw stderr.trim();
		return message.channel.send((mb) => mb.setContent(`${Emojis.GreenTick} Successfully updated dependencies.`));
	}

	private async fetch(message: Message, branch: string) {
		await this.exec('git fetch');
		const { stdout, stderr } = await this.exec(`git pull origin ${branch}`);

		// If it's up to date, do nothing
		if (/already up(?: |-)to(?: |-)date/i.test(stdout)) throw `${Emojis.GreenTick} Up to date.`;

		// If it was not a successful pull, return the output
		if (!this.isSuccessfulPull(stdout)) {
			// If the pull failed because it was in a different branch, run checkout
			if (!(await this.isCurrentBranch(branch))) {
				return this.checkout(message, branch);
			}

			// If the pull failed because local changes, run a stash
			if (this.needsStash(stdout + stderr)) return this.stash(message);
		}

		// For all other cases, return the original output
		return message.reply((mb) =>
			mb.setContent(codeBlock('prolog', [cutText(stdout, 1800) || Emojis.GreenTick, cutText(stderr, 100) || Emojis.GreenTick].join('\n-=-=-=-\n')))
		);
	}

	private async stash(message: Message) {
		await message.reply((mb) => mb.setContent('Unsuccessful pull, stashing...'));
		await sleep(1000);
		const { stdout, stderr } = await this.exec(`git stash`);
		if (!this.isSuccessfulStash(stdout + stderr)) {
			throw `Unsuccessful pull, stashing:\n\n${codeBlock('prolog', [stdout || '✔', stderr || '✔'].join('\n-=-=-=-\n'))}`;
		}

		return message.reply((mb) => mb.setContent(codeBlock('prolog', [cutText(stdout, 1800) || '✔', cutText(stderr, 100) || '✔'].join('\n-=-=-=-\n'))));
	}

	private async checkout(message: Message, branch: string) {
		await message.reply((mb) => mb.setContent(`Switching to ${branch}...`));
		await this.exec(`git checkout ${branch}`);
		return message.reply((mb) => mb.setContent(`${Emojis.GreenTick} Switched to ${branch}.`));
	}

	private async isCurrentBranch(branch: string) {
		const { stdout } = await this.exec('git symbolic-ref --short HEAD');
		return stdout === `refs/heads/${branch}\n` || stdout === `${branch}\n`;
	}

	private isSuccessfulPull(output: string) {
		return /\d+\s*file\s*changed,\s*\d+\s*insertions?\([+-]\),\s*\d+\s*deletions?\([+-]\)/.test(output);
	}

	private isSuccessfulStash(output: string) {
		return output.includes('Saved working directory and index state WIP on');
	}

	private needsStash(output: string) {
		return output.includes('Your local changes to the following files would be overwritten by merge');
	}

	private async exec(script: string) {
		try {
			const result = await exec(script);
			return { ...result, code: 0 };
		} catch (error) {
			return { stdout: '', stderr: (error as Error).message, code: (error as Error & { code: number }).code ?? 1 };
		}
	}
}
