import { FastifyInstance } from "fastify";
import { v4 } from "uuid";

interface Body {
	deviceID: string;
	email: string;
}

export default async function (fastify: FastifyInstance) {
	fastify.post<{ Body: Body }>("/is_registered", async (request, reply) => {
		try {
			const { email, deviceID } = request.body;

			if (!email || !deviceID) {
				return reply.status(400).send();
			}

			const { rowCount: playerExists, rows } = await fastify.pg.query<{
				id: string;
				name: string;
				first_name: string;
				last_name: string;
				email: string;
				mobile: string;
			}>(
				`SELECT id, name, first_name, last_name, email, mobile FROM player WHERE LOWER(email) = $1;`,
				[email.toLowerCase()]
			);
			if (playerExists === 0) {
				return reply.status(404).send();
			}

			const { rows: currentPlayer } = await fastify.pg.query<{ player_id: string }>(
				`SELECT player_id FROM device WHERE id = $1;`,
				[deviceID]
			);
			let currentPlayerID = currentPlayer[0]?.player_id;
			if (!currentPlayerID) {
				return reply.status(400).send();
			}

			let player: {
				id: string;
				name: string;
				first_name: string;
				last_name: string;
				email: string;
				mobile: string;
			} = rows[0];

			if (currentPlayerID !== player.id) {
				// update current player
				await fastify.pg.query(`UPDATE device SET player_id = $1 WHERE id = $2;`, [
					player.id,
					deviceID,
				]);

				// delete old player
				await fastify.pg.query(`DELETE FROM player WHERE id = $1;`, [currentPlayerID]);
			}

			return reply.status(200).send({
				playerID: player.id,
				displayName: player.name,
				firstName: player.first_name,
				lastName: player.last_name,
				email: player.email,
				mobile: player.mobile,
				agreeTerms: true,
			});
		} catch (err) {
			console.log(err);
			return reply.status(500).send();
		}
	});
}
