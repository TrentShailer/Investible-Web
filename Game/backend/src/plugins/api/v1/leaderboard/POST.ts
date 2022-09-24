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

async function HandleNoDetails(fastify: FastifyInstance, body: Body) {
	// If no details are provided, then we must determine same player
	// only off of the player_id associated with the device_id
	const { device_id, game_id, name } = body;

	// Try find the player_id associated with the device_id
	const { rows } = await fastify.pg.query(
		`
		SELECT player_id
		FROM device
		WHERE id = $1
		`,
		[device_id]
	);

	// If no player_id is found, then we can create a new player
	if (rows.length === 0) {
		const player_id = v4();
		await fastify.pg.query(`INSERT INTO player (id, name) VALUES ($1, $2);`, [player_id, name]);
		// Update device with player_id
		await fastify.pg.query(`UPDATE device SET player_id = $1 WHERE id = $2;`, [
			player_id,
			device_id,
		]);

		// Update game with player_id
		await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [
			player_id,
			game_id,
		]);
		return;
	} else {
		// If a player_id is found, then we can update the player
		const player_id = rows[0].player_id;
		await fastify.pg.query(`UPDATE player SET name = $1 WHERE id = $2;`, [name, player_id]);

		// Update game with player_id
		await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [
			player_id,
			game_id,
		]);
		return;
	}
}

async function HandleDetails(fastify: FastifyInstance, body: Body) {
	const { device_id, game_id, name, first_name, last_name, email, mobile } = body;

	// Try find the player_id associated with the device_id
	const { rows } = await fastify.pg.query<{ player_id: string }>(
		`
		SELECT player_id
		FROM device
		WHERE id = $1
		`,
		[device_id]
	);
	// If there is a player_id associated with the device_id
	if (rows.length !== 0) {
		// then we need to check if there is a different player_id
		// with the same email or mobile number
		const player_id = rows[0].player_id;
		const { rows: player_rows } = await fastify.pg.query<{ id: string }>(
			`
			SELECT id
			FROM player
			WHERE (email = $1 OR mobile = $2)
			AND id != $3
			`,
			[email, mobile, player_id]
		);
		// If there is, then we need to merge all the players
		if (player_rows.length !== 0) {
			const player_ids = player_rows.map((row) => row.id);
			await MergePlayers(fastify, player_id, player_ids);
		}
		// then we can update the player

		await fastify.pg.query(
			`
				UPDATE player
				SET name = $1, first_name = $2, last_name = $3, email = $4, mobile = $5
				WHERE id = $6
				`,
			[name, first_name, last_name, email, mobile, player_id]
		);
		// Update game with player_id
		await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [
			player_id,
			game_id,
		]);
		return;
	} else {
		// If there is no player_id associated with the device_id
		// then we can first check if there is a player with the same
		// email or mobile number, and if there is, then we can update
		// the player_id associated with the device_id
		const { rows } = await fastify.pg.query<{ id: string }>(
			`
			SELECT id
			FROM player
			WHERE email = $1 OR mobile = $2
			`,
			[email, mobile]
		);
		if (rows.length !== 0) {
			const player_id = rows[0].id;
			await fastify.pg.query(`UPDATE device SET player_id = $1 WHERE id = $2;`, [
				player_id,
				device_id,
			]);
			await fastify.pg.query(
				`
				UPDATE player
				SET name = $1, first_name = $2, last_name = $3, email = $4, mobile = $5
				WHERE id = $6
				`,
				[name, first_name, last_name, email, mobile, player_id]
			);
			// Update game with player_id
			await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [
				player_id,
				game_id,
			]);
			return;
		} else {
			// If there is not, then we can create a new player
			const player_id = v4();
			await fastify.pg.query(
				`
				INSERT INTO player (id, name, first_name, last_name, email, mobile)
				VALUES ($1, $2, $3, $4, $5, $6)
				`,
				[player_id, name, first_name, last_name, email, mobile]
			);
			await fastify.pg.query(`UPDATE device SET player_id = $1 WHERE id = $2;`, [
				player_id,
				device_id,
			]);
			// Update game with player_id
			await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [
				player_id,
				game_id,
			]);
			return;
		}
	}
}

async function MergePlayers(fastify: FastifyInstance, player_id: string, player_ids: string[]) {
	// Merge all the player_ids into player_id
	for (let i = 0; i < player_ids.length; i++) {
		const player_id_to_merge = player_ids[i];
		// Merge all the games
		await fastify.pg.query(
			`
					UPDATE game
					SET player_id = $1
					WHERE player_id = $2
					`,
			[player_id, player_id_to_merge]
		);
		// Merge all the devices
		await fastify.pg.query(
			`
					UPDATE device
					SET player_id = $1
					WHERE player_id = $2
					`,
			[player_id, player_id_to_merge]
		);
		// Marge all leaderboard entries
		await fastify.pg.query(
			`
					UPDATE leaderboard
					SET player_id = $1
					WHERE player_id = $2
					`,
			[player_id, player_id_to_merge]
		);
		// Delete the player
		await fastify.pg.query(`DELETE FROM player WHERE id = $1;`, [player_id_to_merge]);
	}
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

		if (!game_secret || !name || !device_id || !game_id) {
			return reply.status(400).send();
		}

		if (game_secret !== process.env.GAME_SECRET) {
			return reply.status(401).send();
		}

		try {
			// Ensure device_id exists
			const { rowCount: deviceExists } = await fastify.pg.query<{ id: string }>(
				`
				SELECT id FROM device WHERE id = $1;
				`,
				[device_id]
			);
			if (deviceExists === 0) {
				return reply.status(404).send();
			}

			// Ensure game_id exists
			const { rowCount: gameExists } = await fastify.pg.query<{ id: string }>(
				`
				SELECT id FROM game WHERE id = $1;
				`,
				[game_id]
			);
			if (gameExists === 0) {
				return reply.status(404).send();
			}

			if (!first_name || !last_name || !email || !mobile || !agree_terms) {
				HandleNoDetails(fastify, request.body);
			} else {
				HandleDetails(fastify, request.body);
			}

			// device now should have a player_id associated with it
			// so we can get the player_id

			const { rows, rowCount } = await fastify.pg.query(
				"SELECT player_id FROM device WHERE id = $1",
				[device_id]
			);
			// couldn't find device
			if (rowCount === 0) {
				return reply.status(404).send();
			}

			let player_id = rows[0].player_id;

			if (player_id === null) {
				// This should never happen
				return reply.status(500).send();
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
