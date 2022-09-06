declare global {
	namespace NodeJS {
		interface ProcessEnv {
			POSTGRES_USER: string;
			POSTGRES_PASSWORD: string;
			POSTGRES_DATABASE: string;
			GAME_SECRET: string;
		}
	}
}

export {};
