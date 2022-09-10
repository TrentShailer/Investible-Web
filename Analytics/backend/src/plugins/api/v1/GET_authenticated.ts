import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/authenticated", async (req, res) => {
		if (req.session.authenticated) {
			return res.status(200).send();
		}

		return res.status(401).send();
	});
}

export default plugin;
