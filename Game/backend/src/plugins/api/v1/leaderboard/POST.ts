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

type Player = {
	id: string;
	name: string;
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	mobile: string | null;
	clicked_contact: boolean | null;
};

async function CheckMatch(fastify: FastifyInstance, body: Body): Promise<Player[] | null> {
	const { first_name, last_name, email, mobile } = body;

	const { rows } = await fastify.pg.query(
		`
		SELECT
			id,
			name,
			first_name,
			last_name,
			email,
			mobile,
			clicked_contact
		FROM
			player
		WHERE
			(LOWER(first_name) = $1
			AND LOWER(last_name) = $2)
			OR LOWER(email) = $3
			OR mobile = $4
		`,
		[first_name.toLowerCase(), last_name.toLowerCase(), email.toLowerCase(), mobile]
	);

	if (rows.length === 0) {
		return null;
	}

	return rows;
}

// No Details & No Player ID -> Create new player
async function NoDetailsNoPlayerID(fastify: FastifyInstance, body: Body) {
	const { device_id, game_id, name } = body;
	const player_id = v4();
	await fastify.pg.query(`INSERT INTO player (id, name) VALUES ($1, $2);`, [player_id, name]);

	await fastify.pg.query(`UPDATE device SET player_id = $1 WHERE id = $2;`, [
		player_id,
		device_id,
	]);

	await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [player_id, game_id]);
	return;
}

// No Details & Player ID -> Update player
async function NoDetailsPlayerID(fastify: FastifyInstance, body: Body, player_id: string) {
	const { device_id, game_id, name } = body;
	await fastify.pg.query(`UPDATE player SET name = $1 WHERE id = $2;`, [name, player_id]);
	// Update game
	await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [player_id, game_id]);
	return;
}

// Details -> Check for a matching players -> Merge players else Create Player
async function HandleDetails(fastify: FastifyInstance, body: Body) {
	const matches = await CheckMatch(fastify, body);
	if (matches === null) {
		CreatePlayerDetails(fastify, body);
	} else {
		if (matches.length === 1) {
			await UpdatePlayerDetails(fastify, body, matches[0].id);
		} else {
			// Merge players
			await MergePlayers(fastify, matches);
			await UpdatePlayerDetails(fastify, body, matches[0].id);
		}
	}
}

async function UpdatePlayerDetails(fastify: FastifyInstance, body: Body, player_id: string) {
	const { device_id, game_id, name, first_name, last_name, email, mobile } = body;
	await fastify.pg.query(
		`UPDATE player SET name = $1, first_name = $2, last_name = $3, email = $4, mobile = $5 WHERE id = $6;`,
		[name, first_name, last_name, email, mobile, player_id]
	);

	await fastify.pg.query(`UPDATE device SET player_id = $1 WHERE id = $2;`, [
		player_id,
		device_id,
	]);

	await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [player_id, game_id]);
	return;
}

async function CreatePlayerDetails(fastify: FastifyInstance, body: Body) {
	const { device_id, game_id, name, first_name, last_name, email, mobile } = body;
	const player_id = v4();
	await fastify.pg.query(
		`INSERT INTO player (id, name, first_name, last_name, email, mobile) VALUES ($1, $2, $3, $4, $5, $6);`,
		[player_id, name, first_name, last_name, email, mobile]
	);

	await fastify.pg.query(`UPDATE device SET player_id = $1 WHERE id = $2;`, [
		player_id,
		device_id,
	]);

	await fastify.pg.query(`UPDATE game SET player_id = $1 WHERE id = $2;`, [player_id, game_id]);
	return;
}

async function MergePlayers(fastify: FastifyInstance, player_ids: Player[]) {
	const { id: player_id } = player_ids[0];
	// Merge all the player_ids into player_id
	for (let i = 1; i < player_ids.length; i++) {
		const player_id_to_merge = player_ids[i].id;
		const clicked_contact = player_ids[i].clicked_contact;
		// Merge all the games
		await fastify.pg.query(
			`UPDATE game
			SET player_id = $1
			WHERE player_id = $2`,
			[player_id, player_id_to_merge]
		);
		// Merge all the devices
		await fastify.pg.query(
			`UPDATE device
			SET player_id = $1
			WHERE player_id = $2`,
			[player_id, player_id_to_merge]
		);
		// Marge all leaderboard entries
		await fastify.pg.query(
			`UPDATE leaderboard
			SET player_id = $1
			WHERE player_id = $2`,
			[player_id, player_id_to_merge]
		);
		// If the player_id_to_merge has clicked contact, then we need to
		// update the player_id to have clicked contact
		if (clicked_contact) {
			await fastify.pg.query(
				`UPDATE player
				SET clicked_contact = true
				WHERE id = $1`,
				[player_id]
			);
		}

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
			const { rows: device_rows, rowCount: deviceExists } = await fastify.pg.query<{
				id: string;
				player_id: string;
			}>(
				`
				SELECT id, player_id FROM device WHERE id = $1;
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

			const { player_id: existing_player_id } = device_rows[0];

			if (!first_name || !last_name || !email || !mobile || agree_terms === undefined) {
				if (existing_player_id !== null) {
					await NoDetailsPlayerID(fastify, request.body, existing_player_id);
				} else {
					await NoDetailsNoPlayerID(fastify, request.body);
				}
			} else {
				await HandleDetails(fastify, request.body);
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
