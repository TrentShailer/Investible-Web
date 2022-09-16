import { FastifyInstance } from "fastify";

interface Params {
	id: string;
}

export default async function (fastify: FastifyInstance) {
	fastify.delete<{ Params: Params }>("/:id", async (request, reply) => {
		if (!request.session.authenticated) {
			reply.status(401).send();
			return;
		}

		try {
			await fastify.pg.query("DELETE FROM competition WHERE id = $1;", [request.params.id]);
			return reply.status(200).send();
		} catch (err) {
			console.error(err);
			return reply.status(500).send();
		}
	});
}
