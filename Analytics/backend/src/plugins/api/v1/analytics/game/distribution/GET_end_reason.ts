import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/end_reason", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows } = await fastify.pg.query<{ game_end_reason: number; count: number }>(
				"SELECT game_end_reason::INT, COUNT(*)::INT FROM game WHERE turns > 10 AND DATE(timestamp) != CURRENT_DATE GROUP BY game_end_reason ORDER BY game_end_reason ASC;"
			);

			const unstableCount = rows.find((r) => r.game_end_reason === 0)?.count ?? 0;
			const poorCount = rows.find((r) => r.game_end_reason === 1)?.count ?? 0;
			const quitCount = rows.find((r) => r.game_end_reason === 2)?.count ?? 0;
			const gaveUpCount = rows.find((r) => r.game_end_reason === 3)?.count ?? 0;

			const total = unstableCount + poorCount + quitCount + gaveUpCount;

			const unstablePercent = (unstableCount / total) * 100;
			const poorPercent = (poorCount / total) * 100;
			const quitPercent = (quitCount / total) * 100;
			const gaveUpPercent = (gaveUpCount / total) * 100;

			const result = [
				{ name: "Unstable", value: Number(unstablePercent.toFixed(1)) },
				{ name: "Poor", value: Number(poorPercent.toFixed(1)) },
				{
					name: "Quit to Main Menu",
					value: Number(quitPercent.toFixed(1)),
				},
				{ name: "Gave Up", value: Number(gaveUpPercent.toFixed(1)) },
			];

			return res.status(200).send(result);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}
export default plugin;
