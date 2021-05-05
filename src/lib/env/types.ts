export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;

export type ArchAngelEnvAny = keyof ArchAngelEnv;
export type ArchAngelEnvString = { [K in ArchAngelEnvAny]: ArchAngelEnv[K] extends BooleanString | IntegerString ? never : K }[ArchAngelEnvAny];
export type ArchAngelEnvBoolean = { [K in ArchAngelEnvAny]: ArchAngelEnv[K] extends BooleanString ? K : never }[ArchAngelEnvAny];
export type ArchAngelEnvInteger = { [K in ArchAngelEnvAny]: ArchAngelEnv[K] extends IntegerString ? K : never }[ArchAngelEnvAny];

export interface ArchAngelEnv {
	NODE_ENV: 'test' | 'development' | 'production';
	DOTENV_DEBUG_ENABLED: BooleanString;

	CLIENT_NAME: string;
	CLIENT_VERSION: string;
	CLIENT_PREFIX: string;
	CLIENT_REGEX_PREFIX: string;
	CLIENT_OWNERS: string;
	CLIENT_ID: string;

	CLIENT_PRESENCE_NAME: string;
	CLIENT_PRESENCE_TYPE: string;

	WEBSOCKET_PORT: IntegerString;

	DISCORD_TOKEN: string;
}
