import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { v4 } from "uuid";
import { ValidateName } from "./GET_validname";

async function Handler(
	req: FastifyRequest<{ Body: POST_leaderboard_Body }>,
	res: FastifyReply,
	fastify: FastifyInstance
) {
	if (req.body.secret !== process.env.GAME_SECRET) {
		return res.send(403);
	}

	let validName = ValidateName(req.body.name);
	if (!validName.valid) {
		return res.code(400).send(validName);
	}

	try {
		await fastify.pg.query(
			"INSERT INTO leaderboard(id, name, portfolio_value) VALUES ($1, $2, $3);",
			[v4(), req.body.name, req.body.portfolio_value]
		);
	} catch (err) {
		return res.send(500);
	}

	return res.send(200);
}

export default Handler;
