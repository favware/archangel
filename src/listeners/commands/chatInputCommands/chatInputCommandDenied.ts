import { ChatInputCommandDeniedPayload, Events, Listener, UserError } from '@sapphire/framework';

export class UserListener extends Listener<typeof Events.ChatInputCommandDenied> {
  public run({ context, message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    if (Reflect.get(Object(context), 'silent')) return;

    return interaction.reply({
      content,
      allowedMentions: { users: [interaction.member.user.id], roles: [] },
      ephemeral: true
    });
  }
}
