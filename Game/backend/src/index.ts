import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyPostgres from "@fastify/postgres";
import fastifyFormbody from "@fastify/formbody";
import path from "path";

import leaderboardRoute from "./routes/leaderboard/leaderboard";
import analyticsRoute from "./routes/analytics/analytics";

const fastify = Fastify({
	logger: false,
});

// Setup plugins
fastify.register(fastifyFormbody);

fastify.register(fastifyPostgres, {
	connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@database:5432/${process.env.POSTGRES_DATABASE}`,
});

fastify.register(fastifyStatic, {
	root: path.join(__dirname, "frontend"),
	preCompressed: true,
	setHeaders: (res, path, stat) => {
		if (path.includes(".br")) res.setHeader("Content-Encoding", "br");

		if (path.includes("wasm")) res.setHeader("Content-Type", "application/wasm");
	},
});

// Register Routes
fastify.register(leaderboardRoute);
fastify.register(analyticsRoute);

// Start Server
fastify.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
