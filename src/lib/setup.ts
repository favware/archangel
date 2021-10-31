// Config must be the first to be loaded, as it sets the env:
import 'reflect-metadata';
import '#root/config';

// Import everything else:
import '#utils/Sanitizer/initClean';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-editable-commands/register';

import * as colorette from 'colorette';
import { inspect } from 'util';

inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });
