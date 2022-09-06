import { FastifyInstance } from "fastify";

interface Params {
	id: string;
}

interface Body {
	game_secret: string;
	player_id: string;
	game_version: string;
	game_end_reason: number;
	game_time: string;
	postive_event_count: number;
	negative_event_count: number;
	portfolio_value: number;
	insurance_count: number;
	low_risk_count: number;
	high_risk_count: number;
	turns: number;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.post<{ Params: Params; Body: Body }>("/:id", async (req, res) => {
		if (req.body.game_secret !== process.env.GAME_SECRET) {
			return res.send(401);
		}

		try {
			await fastify.pg.query(
				`INSERT INTO game
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
				ON CONFLICT (id)
				DO UPDATE SET
					game_end_reason = $4,
					game_time = $5,
					positive_event_count = $6,
					negative_event_count = $7,
					portfolio_value = $8,
					insurance_count = $9,
					low_risk_count = $10,
					high_risk_count = $11,
					turns = $12;
			`,
				[
					req.params.id,
					req.body.player_id,
					req.body.game_version,
					req.body.game_end_reason,
					req.body.game_time,
					req.body.postive_event_count,
					req.body.negative_event_count,
					req.body.portfolio_value,
					req.body.insurance_count,
					req.body.low_risk_count,
					req.body.high_risk_count,
					req.body.turns,
				]
			);

			return res.send(200);
		} catch (error) {
			console.log("Error occured at POST /api/v1/game/:id");
			console.error(error);
			const { game_secret, ...body } = req.body;
			console.log("Body: " + body);
			console.log("Params: " + req.params);

			return res.send(500);
		}
	});
}

export default plugin;
