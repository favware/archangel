// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

// Config must be the first to be loaded, as it sets the env:
import 'reflect-metadata';
import '#root/config';

// Import everything else:
import '@sapphire/plugin-logger/register';

import * as colorette from 'colorette';
import { inspect } from 'util';
import { srcFolder } from '#utils/constants';
import { setup, ArrayString } from '@skyra/env-utilities';
import { join } from 'path';
import { fileURLToPath } from 'url';

setup(join(fileURLToPath(srcFolder), '.env'));

inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });

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
