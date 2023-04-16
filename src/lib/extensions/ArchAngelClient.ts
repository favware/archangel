import { ExtendedHandler as EnGbHandler } from '#utils/Intl/EnGbHandler';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { cast } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { ActivityType, GatewayIntentBits, type ActivitiesOptions } from 'discord.js';

export class ArchAngelClient extends SapphireClient {
  public override readonly EnGbHandler = new EnGbHandler();

  public constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
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
      type: cast<Exclude<ActivityType, ActivityType.Custom>>(envParseString('CLIENT_PRESENCE_TYPE', 'WATCHING'))
    }
  ];
}
