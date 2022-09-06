import { FastifyInstance } from "fastify";

interface Params {
	id: string;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.put<{ Params: Params }>("/:id/clicked_contact", async (req, res) => {
		try {
			let result = await fastify.pg.query(
				"UPDATE player SET clicked_contact = TRUE WHERE id = $1;",
				[req.params.id]
			);

			if (result.rowCount === 0) {
				return res.send(404);
			} else {
				return res.send(200);
			}
		} catch (error) {
			console.log("Error occured in PUT /api/v1/player/:id/clicked_contact");
			console.error(error);
			console.log("Params: " + req.params);

			return res.send(500);
		}
	});
}

export default plugin;
