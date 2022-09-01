import { FastifyInstance } from "fastify";
import PUT_analytics from "./PUT_analytics";

async function route(fastify: FastifyInstance, options: any) {
	fastify.put<{ Params: PUT_analytics_Params; Body: PUT_analytics_Body }>(
		"/api/v1/analytics/:id",
		async (req, res) => {
			PUT_analytics(req, res, fastify);
		}
	);
}

export default route;
