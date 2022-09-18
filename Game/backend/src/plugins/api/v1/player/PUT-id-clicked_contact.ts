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
				return res.status(404).send();
			} else {
				return res.status(200).send();
			}
		} catch (error) {
			console.log("Error occurred in PUT /api/v1/player/:id/clicked_contact");
			console.error(error);

			return res.status(500).send();
		}
	});
}

export default plugin;
