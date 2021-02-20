import '#lib/extensions/ArchAngelMessage';
import '#utils/Sanitizer/initClean';
import '@sapphire/plugin-logger/register';
import '@skyra/editable-commands';
import 'reflect-metadata';
import { inspect } from 'node:util';

inspect.defaultOptions.depth = 1;
