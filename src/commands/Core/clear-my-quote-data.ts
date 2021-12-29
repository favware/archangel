import { quoteCache } from '#lib/quoting/quoteCache';
import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Clears all quoting data that I have on you.',
	chatInputCommand: {
		register: true,
		guildIds: getGuildIds(),
		idHints: ['925555783981203477']
	}
})
export class UserCommand extends Command {
	public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
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
