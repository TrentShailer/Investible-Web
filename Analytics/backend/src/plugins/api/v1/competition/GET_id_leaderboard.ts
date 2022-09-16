import { FastifyInstance } from "fastify";

interface Params {
	id: string;
}

export default async function (fastify: FastifyInstance) {
	fastify.get<{ Params: Params }>("/:id/leaderboard", async (request, reply) => {
		if (!request.session.authenticated) {
			reply.status(401).send();
			return;
		}

		try {
			// Get the competition start and end date with id from the request
			const { rows: competition } = await fastify.pg.query<{
				start_date: string;
				end_date: string;
			}>("SELECT start_date, end_date FROM competition WHERE id = $1;", [request.params.id]);

			if (competition.length === 0) {
				return reply.status(404).send();
			}

			// Get the leaderboard for the competition
			const { rows: leaderboard } = await fastify.pg.query<{
				id: string;
				name: string;
				portfolio_value: number;
			}>(
				"SELECT id, name, portfolio_value::INT FROM leaderboard WHERE timestamp >= $1 AND timestamp <= $2 ORDER BY portfolio_value DESC;",
				[competition[0].start_date, competition[0].end_date]
			);

			return reply.status(200).send(leaderboard);
		} catch (err) {
			console.error(err);
			return reply.status(500).send();
		}
	});
}
