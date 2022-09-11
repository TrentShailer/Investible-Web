/* [
	{ label: "Low Risk", allPlayers: 20, topPlayers: 12 },
	{ label: "High Risk", allPlayers: 35, topPlayers: 48 },
	{ label: "Insurance", allPlayers: 45, topPlayers: 40 },
] */
import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/block_distribution", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows: allPlayersRows } = await fastify.pg.query<{
				low_risk: number;
				high_risk: number;
				insurance: number;
			}>(
				`SELECT
					ROUND(AVG(low_risk_count))::INT AS low_risk,
					ROUND(AVG(high_risk_count))::INT AS high_risk,
					ROUND(AVG(insurance_count))::INT AS insurance
					FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10;`
			);

			const { rows: topPlayersRows } = await fastify.pg.query<{
				low_risk: number;
				high_risk: number;
				insurance: number;
			}>(
				`
				SELECT
					ROUND(AVG(low_risk_count))::INT AS low_risk,
					ROUND(AVG(high_risk_count))::INT AS high_risk,
					ROUND(AVG(insurance_count))::INT AS insurance
					FROM
						(SELECT low_risk_count, high_risk_count, insurance_count FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10
							ORDER BY portfolio_value DESC
							LIMIT ((
								SELECT count(*) FROM game WHERE DATE(timestamp) != CURRENT_DATE AND turns > 10
								) / 10))t;
								`
			);

			const allPlayersTotal =
				allPlayersRows[0].low_risk +
				allPlayersRows[0].high_risk +
				allPlayersRows[0].insurance;
			const topPlayersTotal =
				topPlayersRows[0].low_risk +
				topPlayersRows[0].high_risk +
				topPlayersRows[0].insurance;

			const allPlayersLowRisk = Math.round(
				(allPlayersRows[0].low_risk / allPlayersTotal) * 100
			);
			const allPlayersHighRisk = Math.round(
				(allPlayersRows[0].high_risk / allPlayersTotal) * 100
			);
			const allPlayersInsurance = Math.round(
				(allPlayersRows[0].insurance / allPlayersTotal) * 100
			);

			const topPlayersLowRisk = Math.round(
				(topPlayersRows[0].low_risk / topPlayersTotal) * 100
			);
			const topPlayersHighRisk = Math.round(
				(topPlayersRows[0].high_risk / topPlayersTotal) * 100
			);
			const topPlayersInsurance = Math.round(
				(topPlayersRows[0].insurance / topPlayersTotal) * 100
			);

			return res.status(200).send([
				{ label: "Low Risk", allPlayers: allPlayersLowRisk, topPlayers: topPlayersLowRisk },
				{
					label: "High Risk",
					allPlayers: allPlayersHighRisk,
					topPlayers: topPlayersHighRisk,
				},
				{
					label: "Insurance",
					allPlayers: allPlayersInsurance,
					topPlayers: topPlayersInsurance,
				},
			]);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}
export default plugin;
