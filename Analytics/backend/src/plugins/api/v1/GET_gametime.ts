import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/gametime", async (req, res) => {
		if (!req.session.authenticated) {
			return res.send(401);
		}
	});
}

export default plugin;
