import { FastifyInstance } from "fastify";

interface Params {
	id: string;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.delete<{ Params: Params }>("/:id", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			await fastify.pg.query("DELETE FROM leaderboard WHERE id = $1;", [req.params.id]);
			return res.status(200).send();
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
