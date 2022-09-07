import { FastifyInstance } from "fastify";
import { format } from "date-fns";

type Result = {
	start_date: string; // Formatted String
	end_date: string; // Formatted String
	details: string;
};

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/ongoing", async (req, res) => {
		try {
			const result = await fastify.pg.query<{
				start_date: number;
				end_date: number;
				details: string;
			}>(
				"SELECT start_date, end_date, details FROM competition WHERE CURRENT_TIMESTAMP > start_date AND CURRENT_TIMESTAMP < end_date;"
			);
			if (result.rowCount === 0) {
				return res.status(404).send();
			} else {
				let row = result.rows[0];
				let start_date = format(row.start_date, "haaa, do MMM yyyy, O");
				let end_date = format(row.end_date, "haaa, do MMM yyyy, O");

				return res.status(200).send({ start_date, end_date, details: row.details });
			}
		} catch (error) {
			console.log("Error occured at GET /api/v1/compeition/ongoing");
			console.error(error);

			return res.status(500).send();
		}
	});
}

export default plugin;
