import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
	fastify.get("/", async (request, reply) => {
		if (!request.session.authenticated) {
			reply.status(401).send();
			return;
		}

		try {
			const { rows } = await fastify.pg.query<{
				id: string;
				title: string;
				details: string;
				start_date: string;
				end_date: string;
			}>(
				"SELECT id, title, details, start_date, end_date FROM competition ORDER BY end_date DESC;"
			);

			let competitions = rows.map((row) => {
				return {
					id: row.id,
					title: row.title,
					details: row.details,
					start_date: row.start_date,
					end_date: row.end_date,
				};
			});

			return reply.status(200).send(competitions);
		} catch (err) {
			console.error(err);
			return reply.status(500).send();
		}
	});
}
