/* [
		{ Date: "3 Aug", Players: 50},
		{ Date: "4 Aug", Players: 3000},
		{ Date: "5 Aug", Players: 2000},
		{ Date: "6 Aug", Players: 1732},
		{ Date: "7 Aug", Players: 1892},
		{ Date: "8 Aug", Players: 1474},
		{ Date: "9 Aug", Players: 1720},
		{ Date: "10 Aug", Players: 1413},
		{ Date: "11 Aug", Players: 1561},
		{ Date: "12 Aug", Players: 1915},
		{ Date: "13 Aug", Players: 1943},
		{ Date: "14 Aug", Players: 1933},
		{ Date: "15 Aug", Players: 1470},
		{ Date: "16 Aug", Players: 1612},
		{ Date: "17 Aug", Players: 1900},
		{ Date: "18 Aug", Players: 1379},
		{ Date: "19 Aug", Players: 1264},
		{ Date: "20 Aug", Players: 1158},
		{ Date: "21 Aug", Players: 1615},
		{ Date: "22 Aug", Players: 1851},
		{ Date: "23 Aug", Players: 1488},
	] */
import { FastifyInstance } from "fastify";
import { format } from "date-fns";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/game_count", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			let result = [];

			// Get the number of games played per day
			const { rows: data } = await fastify.pg.query<{ timestamp: string; count: number }>(
				`SELECT
					DATE(timestamp)::DATE as timestamp,
					COUNT(*)::INT
						FROM game WHERE
							timestamp > CURRENT_DATE - interval '21 day' AND
							turns > 10
								GROUP BY DATE(timestamp);`
			);

			// Get the days in the last 21 days
			const { rows: blankData } = await fastify.pg.query<{
				timestamp: string;
				count: number;
			}>(
				`SELECT
					generate_series(CURRENT_DATE - interval '21 day', CURRENT_DATE - interval '1 day', interval '1 day')::DATE as timestamp,
					0 as count;`
			);

			// Merge the two arrays
			for (const row of blankData) {
				const gameRow = data.find(
					(d) => d.timestamp.toString() === row.timestamp.toString()
				);
				let dateString = format(new Date(row.timestamp), "dd MMM");
				result.push({
					Date: dateString,
					Games: gameRow?.count ?? 0,
				});
			}

			return res.status(200).send(result);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
