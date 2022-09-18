import { FastifyInstance } from "fastify";
import ValidateName from "../../../../utils/ValidateName";

interface Query {
	name: string;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Querystring: Query }>("/valid_name", async (req, res) => {
		let name = req.query.name;

		try {
			return res.status(200).send(ValidateName(name));
		} catch (error) {
			console.log("Error occurred at GET /api/v1/leaderboard/valid_name");
			console.error(error);

			return res.status(500).send();
		}
	});
}

export default plugin;
