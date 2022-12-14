declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			GAME_SECRET: string;
			PORT: number;
			ANALYTICS_PASSWORD_HASH: string;
		}
	}
}

export {};
