import { FSWatcher } from 'chokidar';

declare module '@klasa/core/dist/src/lib/client/Client' {
	interface ClientOptions {
		dev?: boolean;
	}

	interface Client {
		version: string;
		fsWatcher: FSWatcher | null;
	}
}
