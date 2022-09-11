import { FastifyInstance } from "fastify";
import { format } from "date-fns";

interface Params {
	id: string;
}

type Row = {
	leaderboard_id: string;
	name: string;
	portfolio_value: number;
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	mobile: string | null;
	agree: boolean | null;
	player_id: string;
	mobile_device: boolean;
	clicked_contact: string;
	game_id: string;
	game_version: string | null;
	game_end_reason: string | null;
	game_time: number | null;
	positive_event_count: number | null;
	negative_event_count: number | null;
	game_portfolio_value: number | null;
	insurance_count: number | null;
	low_risk_count: number | null;
	high_risk_count: number | null;
	turns: number | null;
	timestamp: string;
};

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Params: Params }>("/:id", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows, rowCount } = await fastify.pg.query<Row>(
				`
					SELECT
						leaderboard.id as leaderboard_id,
						leaderboard.name,
						leaderboard.portfolio_value,
						leaderboard.first_name,
						leaderboard.last_name,
						leaderboard.email,
						leaderboard.mobile,
						leaderboard.agree,
						player.id as player_id,
						player.mobile as mobile_device,
						player.clicked_contact,
						game.id as game_id,
						game.game_version,
						game.game_end_reason,
						game.game_time,
						game.positive_event_count,
						game.negative_event_count,
						game.portfolio_value as game_portfolio_value,
						game.insurance_count,
						game.low_risk_count,
						game.high_risk_count,
						game.turns,
						game.timestamp
					FROM leaderboard
					INNER JOIN player ON player.id = leaderboard.player_id
					INNER JOIN game ON game.id = leaderboard.game_id
					WHERE leaderboard.id = $1;`,
				[req.params.id]
			);

			if (rowCount === 0) {
				return res.status(404).send();
			}

			let result = rows[0];
			result.timestamp = format(new Date(result.timestamp), "yyyy-MM-dd hh:mmaa");

			return res.status(200).send(result);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
