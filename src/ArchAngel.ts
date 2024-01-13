import '#lib/setup';

import { ArchAngelClient } from '#lib/extensions/ArchAngelClient';
import { green } from 'colorette';

const client = new ArchAngelClient();

try {
  await client.login();
  client.logger.info(`${green('WS     ')} - Successfully logged in.`);
} catch (error) {
  client.logger.error(error);
  client.destroy();
  process.exit(1);
}
