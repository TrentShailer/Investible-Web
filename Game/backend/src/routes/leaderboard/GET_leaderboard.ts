import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function Handler(req: FastifyRequest, res: FastifyReply, fastify: FastifyInstance) {
	try {
		const top5Query = await fastify.pg.query<{ name: string; portfolio_value: number }>(
			"SELECT name, portfolio_value FROM leaderboard ORDER BY portfolio_value DESC LIMIT 5;"
		);

		return res.send(top5Query.rows);
	} catch (error) {
		return res.code(500).send([]);
	}
}

export default Handler;
