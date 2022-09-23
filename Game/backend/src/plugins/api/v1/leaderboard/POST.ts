import { FastifyInstance } from "fastify";
import { v4 } from "uuid";

interface Body {
	game_secret: string;
	name: string;
	first_name: string;
	last_name: string;
	email: string;
	mobile: string;
	agree_terms: boolean;
	device_id: string;
	game_id: string;
}

export default async function (fastify: FastifyInstance) {
	fastify.post<{ Body: Body }>("/", async (request, reply) => {
		const {
			game_secret,
			name,
			first_name,
			last_name,
			email,
			mobile,
			agree_terms,
			device_id,
			game_id,
		} = request.body;

		// If the device_id is not valid, return an error
		if (!game_secret || !name || !device_id || !game_id) {
			return reply.status(400).send();
		}

		// validate game secret
		if (game_secret !== process.env.GAME_SECRET) {
			return reply.status(401).send();
		}

		try {
			const { rows, rowCount } = await fastify.pg.query(
				"SELECT player_id FROM device WHERE id = $1",
				[device_id]
			);
			// couldn't find device
			if (rowCount === 0) {
				return reply.status(404).send();
			}

			let player_id = rows[0]?.player_id ?? null;

			// if player_id is null, create a new player
			if (player_id === null) {
				player_id = v4();
				// Create new player
				await fastify.pg.query(
					"INSERT INTO player (id, name, first_name, last_name, email, mobile) VALUES ($1, $2, $3, $4, $5, $6);",
					[player_id, name, first_name, last_name, email, mobile]
				);

				// Update device with player_id
				await fastify.pg.query("UPDATE device SET player_id = $1 WHERE id = $2", [
					player_id,
					device_id,
				]);

				// Update game with player_id
				await fastify.pg.query("UPDATE game SET player_id = $1 WHERE id = $2", [
					player_id,
					game_id,
				]);
			}
			// if player_id is not null, update player
			else {
				// Update player
				await fastify.pg.query(
					"UPDATE player SET name = $1, first_name = $2, last_name = $3, email = $4, mobile = $5 WHERE id = $6;",
					[name, first_name, last_name, email, mobile, player_id]
				);

				// Update game with player_id
				await fastify.pg.query("UPDATE game SET player_id = $1 WHERE id = $2", [
					player_id,
					game_id,
				]);
			}

			// Create a new leaderboard entry for the player
			await fastify.pg.query(
				"INSERT INTO leaderboard (id, player_id, game_id, agree_terms) VALUES ($1, $2, $3, $4);",
				[v4(), player_id, game_id, agree_terms]
			);

			return reply.status(201).send();
		} catch (error) {
			console.log("Error occurred at POST /api/v1/leaderboard");
			console.error(error);
			return reply.status(500).send();
		}
	});
}
