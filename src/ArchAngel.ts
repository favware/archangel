import { ArchAngelClient } from '#lib/extensions/ArchAngelClient';
import '#lib/setup';
import { TOKEN } from '#root/config';

const client = new ArchAngelClient();

async function main() {
	try {
		await client.login(TOKEN);
	} catch (error) {
		client.logger.error(error);
		client.destroy();
		process.exit(1);
	}
}

void main();
