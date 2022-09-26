/*
[
	{ name: "Mobile", value: 72.6 },
	{ name: "Desktop", value: 27.4 },
]
 */
import { FastifyInstance } from "fastify";

type Row = {
	mobile: boolean;
	count: number;
};

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/device_breakdown", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			const { rows } = await fastify.pg.query<Row>(
				"SELECT mobile, COUNT(*)::INT FROM device GROUP BY mobile;"
			);

			if (rows.length === 0) {
				return res.status(200).send([
					{ name: "Mobile", value: 50 },
					{ name: "Desktop", value: 50 },
				]);
			}

			const total = rows.reduce((acc, row) => acc + row.count, 0);

			const data = rows.map((row) => ({
				name: row.mobile ? "Mobile" : "Desktop",
				value: Number(((row.count / total) * 100).toFixed(1)),
			}));

			return res.status(200).send(data);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
