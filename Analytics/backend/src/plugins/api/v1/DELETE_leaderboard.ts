import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.delete<{ Params: DELETE_leaderboard_Params }>("/leaderboard/:id", async (req, res) => {
		if (!req.session.authenticated) {
			return res.send(401);
		}

		try {
			await fastify.pg.query("DELETE FROM leaderboard WHERE id = $1;", [req.params.id]);
			return res.send(200);
		} catch (error) {
			return res.send(500);
		}
	});
}

export default plugin;
