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
			await fastify.pg.query(
				`
			INSERT INTO leaderboard
				(id, name, portfolio_value, email, first_name, last_name, mobile, agree, game_id, player_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			ON CONFLICT (player_id)
			DO UPDATE SET
				name = $2, portfolio_value = $3, email = $4, first_name = $5, last_name = $6, mobile = $7, agree = $8, game_id = $9;`,
				[
					v4(),
					req.body.name,
					req.body.portfolio_value,
					req.body.email,
					req.body.first_name,
					req.body.last_name,
					req.body.mobile,
					req.body.agree,
					req.body.game_id,
					req.params.player_id,
				]
			);
			return res.status(200).send();
		} catch (error) {
			console.log("Error occured at POST /api/v1/leaderboard/:player_id");
			console.error(error);

			return res.status(505000).send();
		}
	});
}

export default plugin;
