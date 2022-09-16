import { FastifyInstance } from "fastify";

interface Query {
	competition?: boolean;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Querystring: Query }>("/", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			if (req.query.competition) {
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

				const { rows } = await fastify.pg.query<{
					id: string;
					name: string;
					portfolio_value: number;
				}>(
					"SELECT id, name, portfolio_value FROM leaderboard WHERE timestamp > $1 AND timestamp < $2 ORDER BY portfolio_value DESC;",
					[competition.start_date, competition.end_date]
				);

				return res.status(200).send(rows);
			} else {
				const { rows } = await fastify.pg.query<{
					id: string;
					name: string;
					portfolio_value: number;
				}>(
					"SELECT id, name, portfolio_value FROM leaderboard ORDER BY portfolio_value DESC;"
				);
				return res.status(200).send(rows);
			}
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
