require("dotenv").config();
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyPostgres from "@fastify/postgres";
import fastifyFormbody from "@fastify/formbody";
import fastifyAutoload from "@fastify/autoload";
import cors from "@fastify/cors";
import path from "path";
import fs from "fs";

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
	// if file "fixed_constraint" doesn't exist, create it
	if (!fs.existsSync("fixed_constraint")) {
		fs.writeFileSync("fixed_constraint", "true");
		fix_constraint();
	}
});

async function fix_constraint() {
	await fastify.pg.query(
		`ALTER TABLE device DROP CONSTRAINT device_player_id_fkey, ADD CONSTRAINT device_player_id_fkey FOREIGN KEY (player_id) REFERENCES player(id) ON DELETE SET NULL;`
	);
}
