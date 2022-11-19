import { FastifyInstance } from "fastify";

const game_end_reason_map = [
	"Game Over - Stability",
	"Game Over - Bankruptcy",
	"Quit Before End - Main Menu",
	"In Progress/Quit Before End - Closed Tab",
];

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/games", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}
		try {
			// Fetch all raw game data from the database
			// format into CSV
			// return CSV

			const { rows } = await fastify.pg.query<{
				id: string;
				player_id: string;
				game_version: string;
				game_end_reason: number;
				game_time: number;
				positive_event_count: number;
				negative_event_count: number;
				portfolio_value: number;
				insurance_count: number;
				low_risk_count: number;
				high_risk_count: number;
				turns: number;
				timestamp: string;
			}>(
				`SELECT
					id,
					player_id,
					game_version,
					game_end_reason,
					game_time,
					positive_event_count,
					negative_event_count,
					portfolio_value,
					insurance_count,
					low_risk_count,
					high_risk_count,
					turns,
					timestamp
				FROM game;`
			);

			let csv =
				"game_id,player_id,game_version,game_end_reason,game_time,positive_event_count,negative_event_count,portfolio_value,insurance_count,low_risk_count,high_risk_count,turns,timestamp\r";

			// Convert the data to CSV
			for (const row of rows) {
				csv += `${row.id},${row.player_id},${row.game_version},${game_end_reason_map[row.game_end_reason]},${row.game_time},${row.positive_event_count},${row.negative_event_count},${row.portfolio_value},${row.insurance_count},${row.low_risk_count},${row.high_risk_count},${row.turns},${row.timestamp}\r`;
			}

			// Send the CSV file
			res.header("Content-Type", "text/csv");
			res.header(
				"Content-Disposition",
				`attachment; filename="Investible Raw Game Data.csv"`
			);
			return res.send(csv);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
