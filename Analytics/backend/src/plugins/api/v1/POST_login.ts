import { verify } from "argon2";
import { FastifyInstance } from "fastify";

interface Body {
	password: string;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.post<{ Body: Body }>("/login", async (req, res) => {
		if (process.env.ANALYTICS_PASSWORD_HASH) {
			const { password } = req.body;
			if (!password) {
				return res.status(400).send();
			}

			if (await verify(process.env.ANALYTICS_PASSWORD_HASH, password)) {
				req.session.authenticated = true;
				return res.status(200).send();
			}
			return res.status(401).send();
		}
		return res.status(500).send();
	});
}

export default plugin;
