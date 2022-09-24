import { FastifyInstance } from "fastify";

interface Params {
	id: string;
}

export default async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Params: Params }>("/:id/export", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		const { id } = req.params;

		if (!id) {
			return res.status(400).send();
		}

		try {
			// Find the start and end dates for the competition
			const { rows: competitionRows } = await fastify.pg.query<{
				start_date: string;
				end_date: string;
			}>(`SELECT start_date, end_date FROM competition WHERE id = $1;`, [id]);

			if (competitionRows.length === 0) {
				return res.status(404).send();
			}

			const { start_date, end_date } = competitionRows[0];

			// Select all data from the leaderboard
			const { rows: leaderboardRows } = await fastify.pg.query<{
				leaderboard_id: string;
				timestamp: string;
				agree_terms: boolean;
				leaderboard_player_id: string;
				name: string;
				first_name: string;
				last_name: string;
				email: string;
				mobile: string;
				game_player_id: string;
				game_version: string;
				game_end_reason: string;
				game_time: number;
				positive_event_count: number;
				negative_event_count: number;
				portfolio_value: number;
				insurance_count: number;
				low_risk_count: number;
				high_risk_count: number;
				turns: number;
			}>(
				`
				SELECT
					leaderboard.id AS leaderboard_id,
					leaderboard.timestamp,
					leaderboard.agree_terms,
					leaderboard.player_id as leaderboard_player_id,
					player.name,
					player.first_name,
					player.last_name,
					player.email,
					player.mobile,
					game.player_id as game_player_id,
					game.game_version,
					game.game_end_reason,
					game.game_time,
					game.positive_event_count,
					game.negative_event_count,
					game.portfolio_value,
					game.insurance_count,
					game.low_risk_count,
					game.high_risk_count,
					game.turns
				FROM leaderboard
				JOIN player ON leaderboard.player_id = player.id
				JOIN game ON leaderboard.game_id = game.id
				WHERE leaderboard.timestamp >= $1 AND leaderboard.timestamp <= $2
				ORDER BY game.portfolio_value DESC;
			`,
				[start_date, end_date]
			);
			let csv =
				"leaderboard_id,timestamp,agree_terms,leaderboard_player_id,name,first_name,last_name,email,mobile,game_player_id,game_version,game_end_reason,game_time,positive_event_count,negative_event_count,portfolio_value,insurance_count,low_risk_count,high_risk_count,turns\r";

			// Convert the data to CSV
			for (const row of leaderboardRows) {
				csv += `${row.leaderboard_id},${row.timestamp},${row.agree_terms},${row.leaderboard_player_id},${row.name},${row.first_name},${row.last_name},${row.email},${row.mobile},${row.game_player_id},${row.game_version},${row.game_end_reason},${row.game_time},${row.positive_event_count},${row.negative_event_count},${row.portfolio_value},${row.insurance_count},${row.low_risk_count},${row.high_risk_count},${row.turns}\r`;
			}

			// Send the CSV file
			res.header("Content-Type", "text/csv");
			res.header("Content-Disposition", `attachment; filename="competition-${id}.csv"`);
			return res.send(csv);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}
