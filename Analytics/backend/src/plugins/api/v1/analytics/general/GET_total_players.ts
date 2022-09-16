import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/total_players", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows } = await fastify.pg.query<{ count: number | null }>(
				`SELECT COUNT(*) as count FROM player;`
			);
			const count = rows[0].count ?? 0;

			return res.status(200).send(count);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}
export default plugin;
