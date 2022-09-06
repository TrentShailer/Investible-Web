import { FastifyInstance } from "fastify";
import { v4 } from "uuid";

interface Params {
	player_id: string;
}

interface Body {
	game_secret: string;
	name: string;
	game_id: string;
	portfolio_value: number;
	email?: string;
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
				(id, name, portfolio_value, email, game_id, player_id) VALUES($1, $2, $3, $4, $5, $6)
			ON CONFLICT (player_id)
			DO UPDATE SET
				name = $2, portfolio_value = $3, email = $4, game_id = $5;`,
				[
					v4(),
					req.body.name,
					req.body.portfolio_value,
					req.body.email,
					req.body.game_id,
					req.params.player_id,
				]
			);
			return res.send(200);
		} catch (error) {
			console.log("Error occured at POST /api/v1/leaderboard/:player_id");
			console.error(error);
			console.log("Params: " + req.params);
			const { game_secret, email, ...body } = req.body;
			console.log("Body: " + body);

			return res.send(500);
		}
	});
}

export default plugin;
