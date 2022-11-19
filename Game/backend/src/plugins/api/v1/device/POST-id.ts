import { FastifyInstance } from "fastify";
import { v4 } from "uuid";

interface Body {
	mobile: boolean;
}
interface Params {
	device_id: string;
}

export default async function (fastify: FastifyInstance) {
	fastify.post<{ Body: Body; Params: Params }>("/:device_id", async (request, reply) => {
		const { device_id } = request.params;
		const { mobile } = request.body;

		// If incorrect parameters, return 400
		if (!device_id || mobile === undefined) {
			return reply.status(400).send();
		}

		try {
			const { rowCount } = await fastify.pg.query("SELECT * FROM device WHERE id = $1", [
				device_id,
			]);
			if (rowCount !== 0) {
				return reply.status(409).send();
			}

			// Create default player
			const player_id = v4();
			await fastify.pg.query("INSERT INTO player (id, name) VALUES ($1, $2);", [
				player_id,
				"Default Player",
			]);

			await fastify.pg.query(
				"INSERT INTO device (id, mobile, player_id) VALUES ($1, $2, $3)",
				[device_id, mobile, player_id]
			);
			return reply.status(201).send();
		} catch (error) {
			console.log("Error occurred at POST /api/v1/device/:device_id");
			console.error(error);
			return reply.status(500).send();
		}
	});
}
