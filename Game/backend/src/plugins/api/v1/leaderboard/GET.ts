import { FastifyInstance } from "fastify";

type Row = { name: string; portfolio_value: number };

// Get /
// If there is a competition exists where the current time is between the start and end date, return the leaderboard for that competition
// return the leaderboard entries that occurred during the competition
async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/", async (req, res) => {
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
				// return the top 10 leaderboard entries
				const { rows } = await fastify.pg.query<Row>(
					"SELECT name, portfolio_value FROM leaderboard ORDER BY portfolio_value DESC LIMIT 10;"
				);
				return res.status(200).send(rows);
			}

			const { rows } = await fastify.pg.query<Row>(
				"SELECT name, portfolio_value FROM leaderboard WHERE timestamp > $1 AND timestamp < $2 ORDER BY portfolio_value DESC LIMIT 10;",
				[competition.start_date, competition.end_date]
			);

			return res.status(200).send(rows);
		} catch (error) {
			console.log("Error occurred at GET /api/v1/leaderboard/");
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
