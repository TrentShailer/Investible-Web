import { FastifyInstance } from "fastify";

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

		// If the device_id is not valid, return an error
		if (!device_id || !mobile) {
			return reply.status(400).send();
		}

		try {
			const { rowCount } = await fastify.pg.query("SELECT * FROM device WHERE id = $1", [
				device_id,
			]);
			if (rowCount !== 0) {
				return reply.status(409).send();
			}
			await fastify.pg.query("INSERT INTO device (id, mobile) VALUES ($1, $2)", [
				device_id,
				mobile,
			]);
			return reply.status(201).send();
		} catch (error) {
			console.log("Error occurred at POST /api/v1/device/:device_id");
			console.error(error);
			return reply.status(500).send();
		}
	});
}
