import { quoteCache } from '#lib/quoting/quoteCache';
import { BrandingColors } from '#utils/constants';
import { discordMessageGenerator, discordMessagesGenerator, htmlGenerator } from '#utils/HtmlGenerator';
import { getAttachment, getGuildIds, oneLine } from '#utils/util';
import { channelMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { isTextBasedChannel } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { Timestamp } from '@sapphire/time-utilities';
import { AttachmentBuilder, Guild, Message, UserFlags, type GuildBasedChannel, type TextBasedChannelFields } from 'discord.js';
import imageGenerator from 'node-html-to-image';

@ApplyOptions<Command.Options>({
  description: 'Quotes one or more messages given the configuration from "Start quote" and "End quote".'
})
export class UserCommand extends Command {
  private readonly timestamp = new Timestamp('MM/DD/YYYY');

  public override registerApplicationCommands(registry: Command.Registry) {
    registry //
      .registerChatInputCommand(
        (builder) =>
          builder //
            .setName(this.name)
            .setDescription(this.description)
            .addChannelOption((input) =>
              input //
                .setName('output-channel')
                .setDescription('The channel to which the quote should be sent')
                .setRequired(true)
            ),
        { guildIds: getGuildIds() }
      );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const interactionMemberId = interaction.member!.user.id;

    const quoteCacheForUser = quoteCache.get(interactionMemberId);

    if (!quoteCacheForUser) {
      return interaction.reply({
        content:
          "Looks like you didn't initialise a quote yet using `Start quote` or `End quote` context menu actions. You need to do that before you can quote messages.",
        ephemeral: true
      });
    }

    const { startMessage, endMessage } = quoteCacheForUser;

    if (!startMessage) {
      return interaction.reply({
        content:
          "Looks like you didn't set the message at which to start quoting yet using the `Start quote` context menu action. You need to do that before you can quote messages.",
        ephemeral: true
      });
    }

    if (startMessage && endMessage && startMessage.channelId !== endMessage?.channelId) {
      return interaction.reply({
        content:
          'Looks like set a start message in a different channel as the end message. I cannot determine a proper start and end that way. Please set the message in the same channel.',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const channelForMessages = await interaction.guild!.channels.fetch(startMessage.channelId);

    if (!channelForMessages) {
      return interaction.editReply({
        content: 'Could not find the channel where the messages are.'
      });
    }

    // If only start message is provided then we quote just that message
    let messages: Message[] = [startMessage];

    // If end message is also provided then we want to get all messages in between
    if (endMessage) {
      const messagesAfterStart = await (channelForMessages as TextBasedChannelFields<true>).messages.fetch({
        after: startMessage.id
      });

      const messagesBeforeEnd = messagesAfterStart.filter((message) => message.createdTimestamp < endMessage.createdTimestamp);

      messages.push(...messagesBeforeEnd.values(), endMessage);

      messages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
    }

    // After determining which messages to include in the quote we can get the content of each
    const content: string[] = [];

    // For every quotable message generate the HTML
    for (const quotableMessage of messages) {
      content.push(await this.messageToHtml(quotableMessage, interaction.guild!));
    }

    // Generate the HTML
    const html = oneLine(
      htmlGenerator(
        discordMessagesGenerator({
          content: content.join('')
        })
      )
    );

    // Generate the image
    const buffer = (await imageGenerator({
      html,
      puppeteerArgs: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-translate', '--disable-extensions'],
        acceptInsecureCerts: true
      }
    })) as Buffer;

    try {
      this.clearUserQuoteData(interactionMemberId);

      const targetChannel = interaction.options.getChannel('output-channel', true) as GuildBasedChannel;
      if (isTextBasedChannel(targetChannel)) {
        await targetChannel.send({
          files: [new AttachmentBuilder(buffer).setName('archangel-quote.png')]
        });

        return interaction.editReply({ content: `Successfully sent the quoted messages to ${channelMention(targetChannel.id)}.` });
      }

      return interaction.editReply({
        content:
          'Sorry, but I was not able to send the quoted messages to the output channel. It appears that you chose a channel that is not a text channel.'
      });
    } catch {
      return interaction.editReply({
        content:
          'Sorry, but I was not able to send the quoted messages to the output channel. Do I have sufficient permissions to send messages to that channel?'
      });
    }
  }

  private messageToHtml(message: Message, guild: Guild): Promise<string> {
    const member = guild.members.cache.get(message.author.id);
    const attachment = getAttachment(message);

    return discordMessageGenerator({
      author: member?.displayName ?? message.author.tag,
      avatar: message.author.displayAvatarURL({ extension: 'png', size: 128 })!,
      bot: message.author.bot,
      content: message.cleanContent,
      edited: Boolean(message.editedAt),
      highlight: false,
      image: attachment,
      roleColor: member?.displayHexColor ?? `#${BrandingColors.Primary}`,
      server: false,
      timestamp: this.timestamp.display(message.createdAt),
      twentyFour: true,
      ephemeral: false,
      verified: message.author.flags?.has(UserFlags.VerifiedBot) ?? false
    });
  }

  private clearUserQuoteData(interactionMemberId: string) {
    quoteCache.delete(interactionMemberId);
  }
}
