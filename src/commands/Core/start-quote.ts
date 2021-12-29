import { Quote, quoteCache } from '#lib/quoting/quoteCache';
import { resolveMessage } from '#lib/quoting/resolveMessage';
import type { GuildMessage } from '#lib/types/Discord';
import { getGuildIds, isMessageInstance } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, isErr, type ContextMenuCommand } from '@sapphire/framework';
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
						.setName('1 - Start quote')
						.setType(ApplicationCommandType.Message),
				{ guildIds: getGuildIds(), idHints: ['925521429368307853', '925592837188354108'] }
			)
			.registerChatInputCommand(
				(builder) =>
					builder //
						.setName(this.name)
						.setDescription(this.description)
						.addStringOption((option) =>
							option //
								.setName('message')
								.setDescription('The ID or link of the message to start quoting from.')
								.setRequired(true)
						),
				{ guildIds: getGuildIds(), idHints: ['925571279803805697', '925592837972693072'] }
			);
	}

	public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		const interactionMemberId = interaction.member!.user.id;
		const messageToQuoteFrom = await resolveMessage({ parameter: interaction.options.getString('message', true), interaction });

		if (isErr(messageToQuoteFrom)) {
			return interaction.reply({
				content:
					"I was unable to find a message for the provided argument. Check that it's a message in the current channel, or you've provided a message link. ",
				ephemeral: true
			});
		}

		const hadAlreadySetQuote = this.setQuoteCache(interactionMemberId, messageToQuoteFrom.value as GuildMessage);

		return interaction.reply({
			content: this.getContent({ hadAlreadySetQuote }),
			ephemeral: true
		});
	}

	public override async contextMenuRun(...[interaction]: Parameters<ContextMenuCommand['contextMenuRun']>) {
		if (interaction.isMessageContextMenu() && isMessageInstance(interaction.targetMessage)) {
			const interactionMemberId = interaction.member!.user.id;

			const hadAlreadySetQuote = this.setQuoteCache(interactionMemberId, interaction.targetMessage as GuildMessage);

			return interaction.reply({
				content: this.getContent({ hadAlreadySetQuote }),
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
				)} message context menu action or ${inlineCodeBlock('/end-quote')} command.`
			);
		}

		return content.join(' ');
	}

	private setQuoteCache(interactionMemberId: string, messageToQuoteFrom: GuildMessage) {
		const quoteCacheForUser = quoteCache.get(interactionMemberId);

		if (quoteCacheForUser) {
			quoteCacheForUser.startMessage = messageToQuoteFrom;
			quoteCacheForUser.timeCreated = Date.now();
			quoteCache.set(interactionMemberId, quoteCacheForUser);
		} else {
			const newQuoteCacheEntry: Quote = {
				startMessage: messageToQuoteFrom,
				timeCreated: Date.now()
			};
			quoteCache.set(interactionMemberId, newQuoteCacheEntry);
		}

		return quoteCacheForUser !== undefined;
	}
}
