import { FastifyInstance } from "fastify";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

async function plugin(fastify: FastifyInstance, options: any) {
	fastify.get("/", async (req, res) => {
		try {
			const result = await fastify.pg.query<{
				title: string;
				start_date: number;
				end_date: number;
				details: string;
			}>(
				"SELECT title, start_date, end_date, details FROM competition WHERE CURRENT_TIMESTAMP > start_date AND CURRENT_TIMESTAMP < end_date;"
			);
			if (result.rowCount === 0) {
				return res.status(404).send();
			} else {
				let row = result.rows[0];
				let start_date =
					formatInTimeZone(row.start_date, "Asia/Singapore", "haaa, do MMM yyyy") +
					" SGT";
				let end_date =
					formatInTimeZone(row.end_date, "Asia/Singapore", "haaa, do MMM yyyy") + " SGT";

				return res
					.status(200)
					.send({ start_date, end_date, details: row.details, title: row.title });
			}
		} catch (error) {
			console.log("Error occurred at GET /api/v1/competition");
			console.error(error);

			return res.status(500).send();
		}
	});
}

export default plugin;
