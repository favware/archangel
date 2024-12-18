import { quoteCache, type Quote } from '#lib/quoting/quoteCache';
import { resolveMessage } from '#lib/quoting/resolveMessage';
import type { GuildMessage } from '#lib/types/Discord';
import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { Command, type ContextMenuCommand } from '@sapphire/framework';
import { inlineCodeBlock } from '@sapphire/utilities';
import { ApplicationCommandType } from 'discord.js';

@ApplyOptions<ContextMenuCommand.Options>({
  description: 'Sets the message at which I will start quoting.'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry //
      .registerContextMenuCommand(
        (builder) =>
          builder //
            .setName('1 - Start quote')
            // @ts-expect-error temporarily ignore the error because discord.js broke types
            .setType(ApplicationCommandType.Message),
        { guildIds: getGuildIds() }
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
        { guildIds: getGuildIds() }
      );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const interactionMemberId = interaction.member!.user.id;
    const messageToQuoteFrom = await resolveMessage({ parameter: interaction.options.getString('message', true), interaction });

    if (messageToQuoteFrom.isErr()) {
      return interaction.reply({
        content:
          "I was unable to find a message for the provided argument. Check that it's a message in the current channel, or you've provided a message link. ",
        ephemeral: true
      });
    }

    const hadAlreadySetQuote = this.setQuoteCache(interactionMemberId, messageToQuoteFrom.unwrap() as GuildMessage);

    return interaction.reply({
      content: this.getContent({ hadAlreadySetQuote }),
      ephemeral: true
    });
  }

  public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
    if (interaction.isMessageContextMenuCommand() && isMessageInstance(interaction.targetMessage)) {
      const interactionMemberId = interaction.member!.user.id;

      const hadAlreadySetQuote = this.setQuoteCache(interactionMemberId, interaction.targetMessage as GuildMessage);

      return interaction.reply({
        content: this.getContent({ hadAlreadySetQuote }),
        ephemeral: true
      });
    }

    return interaction.reply({
      content: 'This command can only be used on messages.',
      ephemeral: true
    });
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
