require("dotenv").config();
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyPostgres from "@fastify/postgres";
import fastifySession from "@fastify/session";
import connectPgSimple from "connect-pg-simple";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import path from "path";
import fastifyAutoload from "@fastify/autoload";
import { v4 } from "uuid";

const PGStore = connectPgSimple(fastifySession as any);

const fastify = Fastify({
	logger: false,
});

fastify.register(fastifyCookie, {});

fastify.register(fastifyPostgres, {
	connectionString: process.env.DATABASE_URL,
});

if (process.env.SESSION_SECRET) {
	fastify.register(fastifySession, {
		cookie: {
			maxAge: 1000 * 60 * 60 * 1,
			secure: process.env.DEV ? false : true,
		},
		secret: process.env.SESSION_SECRET,
		rolling: true,
		store: new PGStore({
			conString: process.env.DATABASE_URL,
		}) as any,
	});
} else {
	console.error("Session secret not found");
	process.exit(1);
}

fastify.register(fastifyStatic, {
	root: path.join(__dirname, "frontend"),
});

fastify.get("/", async (req, res) => {
	if (!req.session.authenticated) {
		return res.redirect("/login");
	}

	return res.sendFile("index.html", path.join(__dirname, "frontend"));
});

fastify.get("/login", async (req, res) => {
	if (req.session.authenticated) {
		return res.redirect("/");
	}

	return res.sendFile("index.html", path.join(__dirname, "frontend"));
});

fastify.register(fastifyAutoload, { dir: path.join(__dirname, "plugins") });

// Start Server
fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, async (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
	await FixNegativeGameLength();
	await FixNoPlayer();
});

async function FixNegativeGameLength() {
	const { rows } = await fastify.pg.query("SELECT id, game_time FROM game WHERE game_time < 0;");

	for (const row of rows) {
		const { id, game_time } = row;
		const fixedGameTime = Math.abs(game_time);
		await fastify.pg.query("UPDATE game SET game_time = $1 WHERE id = $2", [fixedGameTime, id]);
	}
}

async function FixNoPlayer() {
	const { rows } = await fastify.pg.query(
		"SELECT id as device_id FROM device WHERE player_id IS NULL;"
	);

	for (const row of rows) {
		const { device_id } = row;
		const player_id = v4();
		await fastify.pg.query("INSERT INTO player (id, name) VALUES ($1, $2);", [
			player_id,
			"Default Player",
		]);
		await fastify.pg.query("UPDATE device SET player_id = $1 WHERE id = $2", [
			player_id,
			device_id,
		]);
	}
}
