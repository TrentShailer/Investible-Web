declare module "fastify" {
	interface Session {
		authenticated: boolean;
	}
}

export {};
