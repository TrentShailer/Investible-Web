import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.delete("/session", async (req, res) => {
		req.session.destroy((error) => {
			if (error) {
				console.error(error);
				return res.status(500).send();
			} else {
				return res.status(200).send();
			}
		});
	});
}

export default plugin;
