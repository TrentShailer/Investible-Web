/* [{ label: "Average Number of Turns", allPlayers: 52, topPlayers: 162 }] */
import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/turns", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows: allPlayersRows } = await fastify.pg.query<{ turns: number }>(
				"SELECT ROUND(AVG(turns))::INT AS turns FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10;"
			);

			const { rows: topPlayersRows } = await fastify.pg.query<{ turns: number }>(
				`SELECT ROUND(AVG(turns))::INT AS turns
					FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10
					ORDER BY turns DESC
					LIMIT (SELECT COUNT(*) FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10) / 10;`
			);

			if (allPlayersRows.length === 0 || topPlayersRows.length === 0) {
				return res.status(200).send([
					{
						label: "Average Number of Turns",
						allPlayers: 0,
						topPlayers: 0,
					},
				]);
			}

			return res.status(200).send([
				{
					label: "Average Number of Turns",
					allPlayers: allPlayersRows[0].turns,
					topPlayers: topPlayersRows[0].turns,
				},
			]);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}
export default plugin;
