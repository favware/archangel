import { Quote, quoteCache } from '#lib/quoting/quoteCache';
import { resolveMessage } from '#lib/quoting/resolveMessage';
import type { GuildMessage } from '#lib/types/Discord';
import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { Command, type ContextMenuCommand } from '@sapphire/framework';
import { inlineCodeBlock } from '@sapphire/utilities';
import { ApplicationCommandType } from 'discord.js';

@ApplyOptions<ContextMenuCommand.Options>({
  description: 'Optionally sets the message at which I will stop quoting.'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry //
      .registerContextMenuCommand(
        (builder) =>
          builder //
            .setName('2 - End quote')
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
                .setDescription('The ID or link of the message at which to end quoting.')
                .setRequired(true)
            ),
        {
          guildIds: getGuildIds()
        }
      );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const interactionMemberId = interaction.member!.user.id;
    const messageToQuoteFrom = await resolveMessage({ parameter: interaction.options.getString('message', true), interaction });

    if (messageToQuoteFrom.isErr()) {
      return interaction.reply({
        content:
          "I was unable to find a message for the provided argument. Check that it's a message in the current channel, or you've provided a message link.",
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
    const content = ['Successfully stored the message at which to end quoting.'];

    if (hadAlreadySetQuote) {
      content.push(`You can send the quote with ${inlineCodeBlock('/quote')}`);
    } else {
      content.push(`Before sending the quote with ${inlineCodeBlock('/quote')} make sure you set the message from where to start quoting.`);
    }

    return content.join(' ');
  }

  private setQuoteCache(interactionMemberId: string, messageToQuoteFrom: GuildMessage) {
    const quoteCacheForUser = quoteCache.get(interactionMemberId);

    if (quoteCacheForUser) {
      quoteCacheForUser.endMessage = messageToQuoteFrom;
      quoteCacheForUser.timeCreated = Date.now();
      quoteCache.set(interactionMemberId, quoteCacheForUser);
    } else {
      const newQuoteCacheEntry: Quote = {
        endMessage: messageToQuoteFrom,
        timeCreated: Date.now()
      };
      quoteCache.set(interactionMemberId, newQuoteCacheEntry);
    }

    return quoteCacheForUser !== undefined;
  }
}
