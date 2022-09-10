import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			// TODO Pagination?
			const { rows } = await fastify.pg.query<{
				id: string;
				name: string;
				portfolio_value: number;
			}>("SELECT id, name, portfolio_value FROM leaderboard ORDER BY portfolio_value DESC;");
			return res.status(200).send(rows);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
