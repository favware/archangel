import { quoteCache } from '#lib/quoting/quoteCache';
import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Retrieves the message you have configured as your end message for quoting.',
	chatInputCommand: {
		register: true,
		guildIds: getGuildIds(),
		idHints: ['925555783981203477']
	}
})
export class UserCommand extends Command {
	public async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		const interactionMemberId = interaction.member!.user.id;

		const deleteResult = quoteCache.delete(interactionMemberId);

		if (deleteResult) {
			return interaction.reply({ content: `Successfully cleared your quote data`, ephemeral: true });
		}

		return interaction.reply({
			content: "Looks like you didn't initialise a quote yet using `Start quote` or `End quote` context menu actions."
		});
	}
}
