import { ExtendedHandler as EnGbHandler } from '#utils/Intl/EnGbHandler';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import type { ActivitiesOptions, ExcludeEnum } from 'discord.js';
import type { ActivityTypes } from 'discord.js/typings/enums';

export class ArchAngelClient extends SapphireClient {
  public override readonly EnGbHandler = new EnGbHandler();

  public constructor() {
    super({
      intents: ['GUILDS', 'GUILD_MESSAGES'],
      allowedMentions: { users: [], roles: [] },
      presence: { activities: parsePresenceActivity() },
      logger: { level: envParseString('NODE_ENV') === 'production' ? LogLevel.Info : LogLevel.Debug }
    });
  }
}

function parsePresenceActivity(): ActivitiesOptions[] {
  const { CLIENT_PRESENCE_NAME } = process.env;
  if (!CLIENT_PRESENCE_NAME) return [];

  return [
    {
      name: CLIENT_PRESENCE_NAME,
      type: envParseString('CLIENT_PRESENCE_TYPE', 'WATCHING') as ExcludeEnum<typeof ActivityTypes, 'CUSTOM'>
    }
  ];
}
