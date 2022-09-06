import { FastifyInstance } from "fastify";
import ValidateName from "../../../../utils/ValidateName";

interface Params {
	name: string;
}

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get<{ Params: Params }>("/valid_name", async (req, res) => {
		let name = req.params.name;

		try {
			return res.send(ValidateName(name));
		} catch (error) {
			console.log("Error occured at GET /api/v1/leaderboard/valid_name");
			console.error(error);
			console.log("Params: " + req.params);

			return res.send(500);
		}
	});
}

export default plugin;
