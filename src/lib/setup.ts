// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

// Import everything else:
import '@sapphire/plugin-logger/register';

import { srcFolder } from '#utils/constants';
import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import { setup, type ArrayString } from '@skyra/env-utilities';
import * as colorette from 'colorette';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { inspect } from 'util';

setup(join(fileURLToPath(srcFolder), '.env'));

inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

declare module '@skyra/env-utilities' {
  export interface Env {
    NODE_ENV: 'test' | 'development' | 'production';

    CLIENT_VERSION: string;

    CLIENT_PRESENCE_NAME: string;
    CLIENT_PRESENCE_TYPE: string;

    COMMAND_GUILD_IDS: ArrayString;

    DISCORD_TOKEN: string;
  }
}
