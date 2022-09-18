import { FastifyInstance } from "fastify";

interface Query {
	page?: number;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Querystring: Query }>("/", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			let page = req.query.page;
			if (page === undefined) {
				page = 1;
			}

			const { rows } = await fastify.pg.query<{
				id: string;
				name: string;
				portfolio_value: number;
			}>(
				"SELECT id, name, portfolio_value FROM leaderboard ORDER BY portfolio_value DESC LIMIT 10 OFFSET $1;",
				[(page - 1) * 10]
			);

			const { rows: countRows } = await fastify.pg.query<{
				count: number;
			}>("SELECT COUNT(*) FROM leaderboard;");
			const count = countRows[0].count;
			const pages = Math.ceil(count / 10);

			return res.status(200).send({ leaderboard: rows, pageCount: pages });
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
