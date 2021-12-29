import { quoteCache } from '#lib/quoting/quoteCache';
import { getGuildIds } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Retrieves the message you have configured as your start message for quoting.',
	chatInputCommand: {
		register: true,
		guildIds: getGuildIds(),
		idHints: ['925555785575067758', '925592836584390657']
	}
})
export class UserCommand extends Command {
	public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		const interactionMemberId = interaction.member!.user.id;

		const quoteCacheForUser = quoteCache.get(interactionMemberId);

		if (!quoteCacheForUser) {
			return interaction.reply({
				content: "Looks like you didn't initialise a quote yet using `Start quote` or `End quote` context menu actions."
			});
		}

		const { startMessage } = quoteCacheForUser;

		if (!startMessage) {
			return interaction.reply({
				content: "Looks like you didn't set the message at which to start quoting yet using the `Start quote` context menu action."
			});
		}

		return interaction.reply({ content: `The messages from which your current quote will start is: ${startMessage.url}`, ephemeral: true });
	}
}
