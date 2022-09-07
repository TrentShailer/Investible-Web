import { FastifyInstance } from "fastify";

interface Params {
	id: string;
}

interface Body {
	mobile: boolean;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.post<{ Params: Params; Body: Body }>("/:id", async (req, res) => {
		try {
			await fastify.pg.query(
				"INSERT INTO player(id, mobile) VALUES($1, $2) ON CONFLICT DO NOTHING;",
				[req.params.id, req.body.mobile]
			);
			return res.status(200).send();
		} catch (error) {
			console.log("Error occured in POST /api/v1/player/:id");
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
