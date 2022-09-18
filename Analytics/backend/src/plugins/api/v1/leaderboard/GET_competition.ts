import { FastifyInstance } from "fastify";

interface Query {
	page?: number;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Querystring: Query }>("/competition", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows: competitionRows } = await fastify.pg.query<{
				id: string;
				start_date: string;
				end_date: string;
			}>(
				"SELECT id, start_date, end_date FROM competition WHERE end_date > NOW() AND start_date < NOW() ORDER BY start_date ASC LIMIT 1;"
			);
			const competition = competitionRows[0] ?? null;
			if (competition === null) {
				return res.status(200).send([]);
			}

			let page = req.query.page;
			if (page === undefined) {
				page = 1;
			}

			// Get the current page of the leaderboard where the timestamp is between the start and end date of the competition
			const { rows } = await fastify.pg.query<{
				id: string;
				name: string;
				portfolio_value: number;
			}>(
				"SELECT id, name, portfolio_value FROM leaderboard WHERE timestamp >= $1 AND timestamp <= $2 ORDER BY portfolio_value DESC LIMIT 10 OFFSET $3;",
				[competition.start_date, competition.end_date, (page - 1) * 10]
			);

			// Get the total number of leaderboard entries in the competition
			const { rows: countRows } = await fastify.pg.query<{
				count: number;
			}>("SELECT COUNT(*) FROM leaderboard WHERE timestamp >= $1 AND timestamp <= $2;", [
				competition.start_date,
				competition.end_date,
			]);
			const count = countRows[0].count;
			const pages = Math.ceil(count / 10);

			return res.status(200).send({ leaderboard: rows, pageCount: pages });
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
