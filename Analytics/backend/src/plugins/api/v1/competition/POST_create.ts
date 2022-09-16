import { FastifyInstance } from "fastify";
import { zonedTimeToUtc } from "date-fns-tz";
import { v4 } from "uuid";

interface Body {
	title: string;
	details: string;
	start_date: string;
	end_date: string;
}

export default async function (fastify: FastifyInstance) {
	fastify.post<{ Body: Body }>("/create", async (request, reply) => {
		if (!request.session.authenticated) {
			reply.status(401).send();
			return;
		}
		try {
			if (
				!request.body.title ||
				!request.body.details ||
				!request.body.start_date ||
				!request.body.end_date
			) {
				return reply.status(400).send();
			}
			await fastify.pg.query(
				"INSERT INTO competition (id, title, details, start_date, end_date) VALUES ($1, $2, $3, $4, $5);",
				[
					v4(),
					request.body.title,
					request.body.details,
					request.body.start_date,
					request.body.end_date,
				]
			);

			return reply.status(200).send();
		} catch (err) {
			console.error(err);
			return reply.status(500).send();
		}
	});
}
