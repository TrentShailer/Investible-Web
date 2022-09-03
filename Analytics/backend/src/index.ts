import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyPostgres from "@fastify/postgres";
import fastifySession from "@fastify/session";
import connectPgSimple from "connect-pg-simple";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import path from "path";

const PGStore = connectPgSimple(fastifySession as any);

const fastify = Fastify({
	logger: false,
});

fastify.register(fastifyCookie, {
	parseOptions: { signed: true },
} as FastifyCookieOptions);

fastify.register(fastifyPostgres, {
	connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@database:5432/${process.env.POSTGRES_DATABASE}`,
});

if (process.env.SESSION_SECRET) {
	fastify.register(fastifySession, {
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
		secret: process.env.SESSION_SECRET,
		rolling: true,
		store: new PGStore({ pool: fastify.pg.pool }) as any,
	});
} else {
	console.error("Session secret not found");
	process.exit(1);
}

fastify.register(fastifyStatic, {
	root: path.join(__dirname, "frontend"),
});

// Start Server
fastify.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
