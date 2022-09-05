import { verify } from "argon2";
import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.post<{ Body: POST_login_Body }>("/login", async (req, res) => {
		if (process.env.ANALYTICS_PASSWORD_HASH) {
			if (await verify(process.env.ANALYTICS_PASSWORD_HASH, req.body.password)) {
				req.session.authenticated = true;
				return res.send(200);
			}
			return res.send(401);
		}
		return res.send(500);
	});
}

export default plugin;
