import { Emojis } from '#utils/constants';
import { getGuildIds, isMessageInstance } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, MessageCommand } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { CommandInteraction, Message } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Runs a connection test to Discord.',
	chatInputCommand: {
		register: true,
		guildIds: getGuildIds(),
		idHints: ['925499991517184091']
	}
})
export class UserCommand extends Command {
	public async chatInputRun(...[interaction]: Parameters<ChatInputCommand['chatInputRun']>) {
		const msg = await interaction.reply({ content: `${Emojis.Loading} Ping?`, ephemeral: true, fetchReply: true });

		if (isMessageInstance(msg)) {
			const { diff, ping } = this.getPing(msg, interaction);

			return interaction.editReply(`Pong 🏓! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
		}

		return interaction.editReply('Failed to retrieve ping :(');
	}

	public async messageRun(...[message]: Parameters<MessageCommand['messageRun']>) {
		const msg = await send(message, `${Emojis.Loading} Ping?`);

		const { diff, ping } = this.getPing(msg, message);

		return msg.edit(`Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
	}

	private getPing(message: Message, interactionOrMessage: Message | CommandInteraction) {
		const diffReducer = isMessageInstance(interactionOrMessage)
			? message.editedTimestamp || message.createdTimestamp
			: interactionOrMessage.createdTimestamp;

		const diff = (message.editedTimestamp || message.createdTimestamp) - diffReducer;
		const ping = Math.round(this.container.client.ws.ping);

		return { diff, ping };
	}
}
