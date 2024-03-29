import { quoteCache } from '#lib/quoting/quoteCache';
import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, type ChatInputCommand } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
  description: 'Clears all quoting data that I have on you.'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) => {
        builder.setName(this.name).setDescription(this.description);
      },
      {
        guildIds: getGuildIds()
      }
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const interactionMemberId = interaction.member!.user.id;

    const deleteResult = quoteCache.delete(interactionMemberId);

    if (deleteResult) {
      return interaction.reply({ content: `Successfully cleared your quote data`, ephemeral: true });
    }

    return interaction.reply({
      content: "Looks like you didn't initialise a quote yet using `Start quote` or `End quote` context menu actions.",
      ephemeral: true
    });
  }
}
