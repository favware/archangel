import { Quote, quoteCache } from '#lib/quoting/quoteCache';
import type { GuildMessage } from '#lib/types/Discord';
import { getGuildIds, isMessageInstance } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, ContextMenuCommand } from '@sapphire/framework';
import { inlineCodeBlock } from '@sapphire/utilities';
import { ApplicationCommandType } from 'discord-api-types/v9';

@ApplyOptions<ContextMenuCommand.Options>({
	description: 'Sets the message at which I will start quoting.'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(...[registry]: Parameters<ContextMenuCommand['registerApplicationCommands']>) {
		registry //
			.registerContextMenuCommand(
				(builder) =>
					builder //
						.setName('Start quote')
						.setType(ApplicationCommandType.Message),
				{ guildIds: getGuildIds(), idHints: ['925521429368307853'] }
			);
	}

	public async contextMenuRun(...[interaction]: Parameters<ContextMenuCommand['contextMenuRun']>) {
		if (interaction.isMessageContextMenu() && isMessageInstance(interaction.targetMessage)) {
			const interactionMemberId = interaction.member!.user.id;

			const quoteCacheForUser = quoteCache.get(interactionMemberId);

			if (quoteCacheForUser) {
				quoteCacheForUser.startMessage = interaction.targetMessage as GuildMessage;
				quoteCacheForUser.timeCreated = Date.now();
				quoteCache.set(interactionMemberId, quoteCacheForUser);
			} else {
				const newQuoteCacheEntry: Quote = {
					startMessage: interaction.targetMessage as GuildMessage,
					timeCreated: Date.now()
				};
				quoteCache.set(interactionMemberId, newQuoteCacheEntry);
			}

			return interaction.reply({
				content: this.getContent({ hadAlreadySetQuote: quoteCacheForUser !== undefined }),
				ephemeral: true
			});
		}
	}

	private getContent({ hadAlreadySetQuote }: { hadAlreadySetQuote: boolean }) {
		const content = ['Successfully stored the message at which to start quoting.'];

		if (hadAlreadySetQuote) {
			content.push(`You can send the quote with ${inlineCodeBlock('/quote')}`);
		} else {
			content.push(
				`You can either send the quote with ${inlineCodeBlock('/quote')}, or first set the end message by using the ${inlineCodeBlock(
					'End quote'
				)} message context menu action.`
			);
		}

		return content.join(' ');
	}
}
