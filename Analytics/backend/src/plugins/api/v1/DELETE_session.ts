import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.delete("/session", async (req, res) => {
		req.session.authenticated = false;

		return res.status(200).send();
	});
}

export default plugin;
