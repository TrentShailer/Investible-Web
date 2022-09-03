import { FastifyInstance } from "fastify";
import GET_validname from "./GET_validname";
import GET_leaderboard from "./GET_leaderboard";
import POST_leaderboard from "./POST_leaderboard";

async function route(fastify: FastifyInstance, options: any) {
	fastify.get<{ Params: GET_validname_Params }>("/api/v1/validname/:name", async (req, res) => {
		GET_validname(req, res, fastify);
	});

	fastify.get("/api/v1/leaderboard", async (req, res) => {
		GET_leaderboard(req, res, fastify);
	});

	fastify.post<{ Body: POST_leaderboard_Body }>("/api/v1/leaderboard", async (req, res) => {
		POST_leaderboard(req, res, fastify);
	});
}

export default route;
