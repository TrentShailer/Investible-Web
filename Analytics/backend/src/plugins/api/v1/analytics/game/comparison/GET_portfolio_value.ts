/* [
		{ label: "Average Portfolio Value", allPlayers: 512462, topPlayers: 1240570 },
	] */
import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/portfolio_value", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows: allPlayersRows } = await fastify.pg.query<{ portfolio_value: number }>(
				`SELECT
					ROUND(AVG(portfolio_value))::INT AS portfolio_value
					FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10;`
			);

			const { rows: topPlayersRows } = await fastify.pg.query<{ portfolio_value: number }>(
				`SELECT ROUND(AVG(portfolio_value))::INT AS portfolio_value
					FROM
						(SELECT
							portfolio_value
							FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10
							ORDER BY portfolio_value DESC
							LIMIT (SELECT COUNT(*) FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10) / 10
							) AS top_players;`
			);

			if (allPlayersRows.length === 0 || topPlayersRows.length === 0) {
				return res.status(200).send([
					{
						label: "Average Portfolio Value",
						allPlayers: 0,
						topPlayers: 0,
					},
				]);
			}

			return res.status(200).send([
				{
					label: "Average Portfolio Value",
					allPlayers: allPlayersRows[0].portfolio_value,
					topPlayers: topPlayersRows[0].portfolio_value,
				},
			]);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}
export default plugin;
