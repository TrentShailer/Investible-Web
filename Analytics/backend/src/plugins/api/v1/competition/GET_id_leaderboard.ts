import { FastifyInstance } from "fastify";

interface Params {
	id: string;
}

interface Query {
	page?: number;
}

export default async function (fastify: FastifyInstance) {
	fastify.get<{ Params: Params; Querystring: Query }>(
		"/:id/leaderboard",
		async (request, reply) => {
			if (!request.session.authenticated) {
				reply.status(401).send();
				return;
			}

			try {
				let page = request.query.page;
				if (page === undefined) {
					page = 1;
				}

				// Get the competition start and end date with id from the request
				const { rows: competition } = await fastify.pg.query<{
					start_date: string;
					end_date: string;
				}>("SELECT start_date, end_date FROM competition WHERE id = $1;", [
					request.params.id,
				]);

				if (competition.length === 0) {
					return reply.status(404).send();
				}

				// Get the leaderboard for the competition with the page
				const { rows } = await fastify.pg.query<{
					id: string;
					name: string;
					portfolio_value: number;
				}>(
					"SELECT id, name, portfolio_value FROM leaderboard WHERE timestamp >= $1 AND timestamp <= $2 ORDER BY portfolio_value DESC LIMIT 10 OFFSET $3;",
					[competition[0].start_date, competition[0].end_date, (page - 1) * 10]
				);

				// get the total number of leaderboard entries in the competition
				const { rows: countRows } = await fastify.pg.query<{
					count: number;
				}>("SELECT COUNT(*) FROM leaderboard WHERE timestamp >= $1 AND timestamp <= $2;", [
					competition[0].start_date,
					competition[0].end_date,
				]);
				const count = countRows[0].count;
				const pages = Math.ceil(count / 10);

				return reply.status(200).send({ leaderboard: rows, pageCount: pages });
			} catch (err) {
				console.error(err);
				return reply.status(500).send();
			}
		}
	);
}
