/* [
		{ Date: "3 Aug", Players: 50, Contacted: 50 },
		{ Date: "4 Aug", Players: 3000, Contacted: 3000 },
		{ Date: "5 Aug", Players: 2000, Contacted: 2000 },
		{ Date: "6 Aug", Players: 1732, Contacted: 1732 },
		{ Date: "7 Aug", Players: 1892, Contacted: 1892 },
		{ Date: "8 Aug", Players: 1474, Contacted: 1474 },
		{ Date: "9 Aug", Players: 1720, Contacted: 1720 },
		{ Date: "10 Aug", Players: 1413, Contacted: 1413 },
		{ Date: "11 Aug", Players: 1561, Contacted: 1561 },
		{ Date: "12 Aug", Players: 1915, Contacted: 1915 },
		{ Date: "13 Aug", Players: 1943, Contacted: 1943 },
		{ Date: "14 Aug", Players: 1933, Contacted: 1933 },
		{ Date: "15 Aug", Players: 1470, Contacted: 1470 },
		{ Date: "16 Aug", Players: 1612, Contacted: 1612 },
		{ Date: "17 Aug", Players: 1900, Contacted: 1900 },
		{ Date: "18 Aug", Players: 1379, Contacted: 1379 },
		{ Date: "19 Aug", Players: 1264, Contacted: 1264 },
		{ Date: "20 Aug", Players: 1158, Contacted: 1158 },
		{ Date: "21 Aug", Players: 1615, Contacted: 1615 },
		{ Date: "22 Aug", Players: 1851, Contacted: 1851 },
		{ Date: "23 Aug", Players: 1488, Contacted: 1488 },
	] */
import { FastifyInstance } from "fastify";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/players", async (req, res) => {
		if (!req.session.authenticated) {
			return res.status(401).send();
		}

		try {
			// TODO Need to get data
			return res.status(200).send();
		} catch (error) {
			return res.status(500).send();
		}
	});
}

export default plugin;
