import { FastifyInstance } from "fastify";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface Params {
	id: string;
}

type Row = {
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
};

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Params: Params }>("/:id", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		const { id } = req.params;

		if (!id) {
			return res.status(400).send();
		}

		try {
			// Select all data from the leaderboard
			const { rows } = await fastify.pg.query<Row>(
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
				INNER JOIN player ON leaderboard.player_id = player.id
				INNER JOIN game ON leaderboard.game_id = game.id
				WHERE leaderboard.id = $1;
				`,
				[id]
			);

			// If no rows are returned, return an error
			if (rows.length === 0) {
				return res.status(404).send();
			}

			// return the leaderboard data
			return res.status(200).send(rows[0]);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
