import { DMChannel, GuildMember, Message, Permissions, PermissionsFlags, TextBasedChannel } from '@klasa/core';
import { ChannelType } from '@klasa/dapi-types';
import { constants } from '@klasa/timestamp';
import { ReactionHandler, ReactionHandlerOptions, RichDisplay, RichDisplayOptions } from 'klasa';

export class UserRichDisplay extends RichDisplay {
	public constructor(options?: RichDisplayOptions) {
		super(options);
		this.useCustomFooters();
	}

	public async start(message: Message, target: string = message.author.id, options: ReactionHandlerOptions = {}): Promise<ReactionHandler> {
		if (target) {
			// Stop the previous display and cache the new one
			const display = UserRichDisplay.handlers.get(target);
			if (display) display.stop();
		}

		this.setAuthorizedFooter(message.guild?.me ?? null, message.channel);

		const handler = await super.run(message, {
			filter: ([, user]) => user.id === target,
			idle: constants.MINUTE * 5,
			onceDone: () => {
				UserRichDisplay.messages.delete(message.id);
				UserRichDisplay.handlers.delete(target);
			},
			...options
		});

		UserRichDisplay.messages.set(message.id, handler);
		UserRichDisplay.handlers.set(target, handler);

		return handler;
	}

	private isDmChannel(channel: TextBasedChannel): channel is DMChannel {
		return channel.type === ChannelType.DM;
	}

	private setAuthorizedFooter(guildMember: GuildMember | null, channel: TextBasedChannel) {
		const priviledged =
			this.isDmChannel(channel) || guildMember === null
				? true
				: channel.permissionsFor(guildMember)?.has(UserRichDisplay.kPermissions) ?? false;

		if (priviledged) {
			for (let i = 1; i <= this.pages.length; i++)
				this.pages[i - 1].setFooter(`${this['footerPrefix']}${i}/${this.pages.length}${this['footerSuffix']}`);
			if (this.infoPage) this.infoPage.setFooter('ℹ');
		}
	}

	public static readonly messages = new Map<string, ReactionHandler>();
	public static readonly handlers = new Map<string, ReactionHandler>();

	private static readonly kPermissions = new Permissions([PermissionsFlags.AddReactions, PermissionsFlags.ManageMessages]).freeze();
}
