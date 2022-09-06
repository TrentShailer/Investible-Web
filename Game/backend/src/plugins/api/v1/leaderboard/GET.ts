import { FastifyInstance } from "fastify";

type Row = { name: string; portfolio_value: number };

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/", async (req, res) => {
		try {
			let result = await fastify.pg.query<Row>(
				"SELECT name, portfolio_value FROM leaderboard ORDER BY portfolio_value DESC LIMIT 10;"
			);

			return res.send(result.rows);
		} catch (error) {
			console.log("Error occured at GET /api/v1/leaderboard/");
			console.error(error);
			return res.send(500);
		}
	});
}

export default plugin;
