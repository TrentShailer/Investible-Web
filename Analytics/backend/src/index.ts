require("dotenv").config();
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyPostgres from "@fastify/postgres";
import fastifySession from "@fastify/session";
import connectPgSimple from "connect-pg-simple";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import path from "path";
import fastifyAutoload from "@fastify/autoload";

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
fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
