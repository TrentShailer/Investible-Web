import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/authenticated", async (req, res) => {
		if (req.session.authenticated) {
			return res.send(200);
		}

		return res.send(401);
	});
}

export default plugin;
