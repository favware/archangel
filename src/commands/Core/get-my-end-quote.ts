import { quoteCache } from '#lib/quoting/quoteCache';
import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Retrieves the message you have configured as your end message for quoting.'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => {
        builder.setName(this.name).setDescription(this.description);
      },
      {
        guildIds: getGuildIds(),
        idHints: ['925555784518086657', '925592838622806086']
      }
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    const interactionMemberId = interaction.member!.user.id;

    const quoteCacheForUser = quoteCache.get(interactionMemberId);

    if (!quoteCacheForUser) {
      return interaction.reply({
        content: "Looks like you didn't initialise a quote yet using `Start quote` or `End quote` context menu actions.",
        ephemeral: true
      });
    }

    const { endMessage } = quoteCacheForUser;

    if (!endMessage) {
      return interaction.reply({
        content: "Looks like you didn't set the message at which to end quoting yet using the `End quote` context menu action.",
        ephemeral: true
      });
    }

    return interaction.reply({ content: `The messages at which your current quote will end is: ${endMessage.url}`, ephemeral: true });
  }
}
