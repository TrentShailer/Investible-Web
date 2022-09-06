import { FastifyInstance } from "fastify";

interface Params {
	player_id: string;
}

type Row = {
	name: string;
	portfolio_value: string;
	email: string | null;
};

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Params: Params }>("/:player_id", async (req, res) => {
		try {
			let result = await fastify.pg.query<Row>(
				"SELECT name, portfolio_value, email FROM leaderboard WHERE player_id = $1;",
				[req.params.player_id]
			);
			if (result.rowCount === 0) {
				return res.send(404);
			} else {
				return res.send(result.rows[0]);
			}
		} catch (error) {
			console.log("Error occured at GET /api/v1/leaderboard/:player_id");
			console.error(error);
			console.log("Params: " + req.params);
			return res.send(500);
		}
	});
}

export default plugin;
