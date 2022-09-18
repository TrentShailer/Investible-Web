import { FastifyInstance } from "fastify";
import { v4 } from "uuid";

interface Params {
	player_id: string;
}

interface Body {
	game_secret: string;
	name: string;
	game_id: string;
	player_id: string;
	portfolio_value: number;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	mobile: string | null;
	agree: boolean | null;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.post<{ Params: Params; Body: Body }>("/:player_id", async (req, res) => {
		if (req.body.game_secret !== process.env.GAME_SECRET) {
			return res.send(401);
		}

		try {
			// if player_id or email or mobile exists in leaderboard
			// then update the leaderboard with the new game data
			// else insert a new row in leaderboard
			const { rows: ids, rowCount: count } = await fastify.pg.query<{
				id: string;
				portfolio_value: number;
			}>(
				`SELECT id, portfolio_value::INT FROM leaderboard WHERE player_id = $1 OR email = $2 OR mobile = $3 ORDER BY portfolio_value DESC;`,
				[req.params.player_id, req.body.email, req.body.mobile]
			);
			if (count === 0) {
				await fastify.pg.query(
					`INSERT INTO leaderboard (id, name, game_id, player_id, portfolio_value, email, first_name, last_name, mobile, agree) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
					[
						v4(),
						req.body.name,
						req.body.game_id,
						req.params.player_id,
						req.body.portfolio_value,
						req.body.email?.toLowerCase() ?? null,
						req.body.first_name,
						req.body.last_name,
						req.body.mobile,
						req.body.agree,
					]
				);
				return res.status(200).send();
			} else {
				if (req.body.portfolio_value > ids[0].portfolio_value) {
					await fastify.pg.query(
						`UPDATE leaderboard SET name = $1, game_id = $2, portfolio_value = $3, email = $4, first_name = $5, last_name = $6, mobile = $7, agree = $8, timestamp = CURRENT_TIMESTAMP WHERE id = $9;`,
						[
							req.body.name,
							req.body.game_id,
							req.body.portfolio_value,
							req.body.email,
							req.body.first_name,
							req.body.last_name,
							req.body.mobile,
							req.body.agree,
							ids[0].id,
						]
					);
				}
				return res.status(200).send();
			}
		} catch (error) {
			console.log("Error occurred at POST /api/v1/leaderboard/:player_id");
			console.error(error);

			return res.status(500).send();
		}
	});
}

export default plugin;
