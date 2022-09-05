import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.delete("/session", async (req, res) => {
		req.session.destroy((error) => {
			if (error) {
				return res.send(500);
			} else {
				return res.send(200);
			}
		});
	});
}

export default plugin;
