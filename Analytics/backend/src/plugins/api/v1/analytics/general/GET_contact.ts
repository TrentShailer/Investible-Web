/* [
	{ name: "Clicked Contact", value: 10 },
	{ name: "Didn't Click Contact", value: 90 },
] */
import { FastifyInstance } from "fastify";

type Row = {
	clicked_contact: boolean;
	count: number;
};

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/contact", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows } = await fastify.pg.query<Row>(
				"SELECT clicked_contact::BOOL, COUNT(*)::INT FROM player GROUP BY clicked_contact;"
			);

			const clickedContactCount = rows.find((row) => row.clicked_contact)?.count ?? 0;
			const didntClickContactCount = rows.find((row) => !row.clicked_contact)?.count ?? 0;

			const total = clickedContactCount + didntClickContactCount;

			const clickedContactPercentage = Number(
				((clickedContactCount / total) * 100).toFixed(1)
			);
			const didntClickContactPercentage = Number(
				((didntClickContactCount / total) * 100).toFixed(1)
			);

			return res.status(200).send([
				{ name: "Clicked Contact", value: clickedContactPercentage },
				{ name: "Didn't Click Contact", value: didntClickContactPercentage },
			]);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
