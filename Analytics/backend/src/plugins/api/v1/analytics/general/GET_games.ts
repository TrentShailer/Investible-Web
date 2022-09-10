/* [{ name: "Average Number of Games", value: 12.5 }] */
import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/games", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows } = await fastify.pg.query<{ avg: number }>(
				"SELECT ROUND(AVG(game_count)) FROM (SELECT COUNT(*) as game_count FROM game GROUP BY player_id) t;"
			);
			const avg = rows[0].avg;

			return res.status(200).send([{ name: "Average Number of Games", value: avg }]);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
