import { FastifyInstance } from "fastify";

interface Params {
	player_id: string;
}

type Row = {
	name: string;
	portfolio_value: string;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	mobile: string | null;
};

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Params: Params }>("/:player_id", async (req, res) => {
		try {
			let result = await fastify.pg.query<Row>(
				"SELECT name, portfolio_value, email, first_name, last_name, mobile FROM leaderboard WHERE player_id = $1;",
				[req.params.player_id]
			);
			if (result.rowCount === 0) {
				return res.status(404).send();
			} else {
				return res.status(200).send(result.rows[0]);
			}
		} catch (error) {
			console.log("Error occured at GET /api/v1/leaderboard/:player_id");
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
