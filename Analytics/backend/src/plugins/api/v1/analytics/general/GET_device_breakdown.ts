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
				"SELECT mobile::BOOL, COUNT(*)::INT FROM player GROUP BY mobile;"
			);

			const mobileCount = rows.find((row) => row.mobile)?.count ?? 0;
			const desktopCount = rows.find((row) => !row.mobile)?.count ?? 0;

			const total = mobileCount + desktopCount;

			const mobilePercentage = Number(((mobileCount / total) * 100).toFixed(1));
			const desktopPercentage = Number(((desktopCount / total) * 100).toFixed(1));

			return res.status(200).send([
				{ name: "Mobile", value: mobilePercentage },
				{ name: "Desktop", value: desktopPercentage },
			]);
		} catch (error) {
			console.error(error);
			return res.status(500).send();
		}
	});
}

export default plugin;
