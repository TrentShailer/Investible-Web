import { FastifyInstance } from "fastify";

interface Query {
	page: number;
}

export default async function (fastify: FastifyInstance) {
	fastify.get<{ Querystring: Query }>("/", async (request, reply) => {
		try {
			let page = request.query.page ? request.query.page : 1;

			// get if there is a current competition
			const { rows: competitionRows } = await fastify.pg.query<{
				id: string;
				start_date: string;
				end_date: string;
			}>(
				"SELECT id, start_date, end_date FROM competition WHERE end_date > NOW() AND start_date < NOW() ORDER BY start_date ASC LIMIT 1;"
			);
			if (competitionRows.length === 0) {
				// no competition just top 10
				const { rows } = await fastify.pg.query(
					`SELECT * FROM
					(SELECT DISTINCT ON (leaderboard.player_id)
						leaderboard.id,
						game.portfolio_value,
						player.name
					FROM leaderboard
					INNER JOIN game ON leaderboard.game_id = game.id
					INNER JOIN player ON leaderboard.player_id = player.id
					ORDER BY leaderboard.player_id DESC, game.portfolio_value DESC)t
				ORDER BY portfolio_value DESC
				LIMIT 10 OFFSET $1;`,
					[(page - 1) * 10]
				);
				// get the total number of players
				const { rows: totalRows } = await fastify.pg.query(
					"SELECT COUNT(DISTINCT player_id) FROM leaderboard;"
				);
				const count = totalRows[0].count;
				const pageCount = Math.ceil(count / 10);

				return reply.status(200).send({ leaderboard: rows, pageCount });
			} else {
				const competition = competitionRows[0];
				const { rows } = await fastify.pg.query(
					`SELECT * FROM
					(SELECT DISTINCT ON (leaderboard.player_id)
						leaderboard.id,
						game.portfolio_value,
						player.name
					FROM leaderboard
					INNER JOIN game ON leaderboard.game_id = game.id
					INNER JOIN player ON leaderboard.player_id = player.id
					WHERE game.timestamp BETWEEN $1 AND $2
					ORDER BY leaderboard.player_id DESC, game.portfolio_value DESC)t
				ORDER BY portfolio_value DESC
				LIMIT 10 OFFSET $3;`,
					[competition.start_date, competition.end_date, (page - 1) * 10]
				);

				// get the total number of players
				const { rows: totalRows } = await fastify.pg.query(
					`SELECT COUNT(DISTINCT leaderboard.player_id) FROM leaderboard
				INNER JOIN game ON leaderboard.game_id = game.id
				WHERE game.timestamp BETWEEN $1 AND $2;`,
					[competition.start_date, competition.end_date]
				);
				const count = totalRows[0].count;
				const pageCount = Math.ceil(count / 10);

				return reply.status(200).send({ leaderboard: rows, pageCount });
			}
		} catch (error) {
			console.log("Error occurred at GET /api/v1/leaderboard");
			console.error(error);

			return reply.status(500).send();
		}
	});
}
