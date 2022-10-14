require("dotenv").config();
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyPostgres from "@fastify/postgres";
import fastifyFormbody from "@fastify/formbody";
import fastifyAutoload from "@fastify/autoload";
import cors from "@fastify/cors";
import path from "path";

const fastify = Fastify({
	logger: false,
});

// Setup plugins
fastify.register(fastifyFormbody);

fastify.register(fastifyPostgres, {
	connectionString: process.env.DATABASE_URL,
});

fastify.register(cors, {
	origin: "https://investible.ippfa.com",
	methods: ["GET", "POST", "PUT", "DELETE"],
});

fastify.register(fastifyStatic, {
	root: path.join(__dirname, "frontend"),
	preCompressed: true,
	setHeaders: (res, path, stat) => {
		if (path.includes(".br")) res.setHeader("Content-Encoding", "br");

		if (path.includes("wasm")) res.setHeader("Content-Type", "application/wasm");
	},
});

fastify.register(fastifyAutoload, { dir: path.join(__dirname, "plugins") });

// Start Server
fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
