import { Paper, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export default function Players() {
	const [data, setData] = useState<PlayerCount[]>([
		{ Date: "3 Aug", Players: 50, Contacted: 50 / 10 },
		{ Date: "4 Aug", Players: 3000, Contacted: 3000 / 10 },
		{ Date: "5 Aug", Players: 2000, Contacted: 2000 / 10 },
		{ Date: "6 Aug", Players: 1732, Contacted: 1732 / 10 },
		{ Date: "7 Aug", Players: 1892, Contacted: 1892 / 10 },
		{ Date: "8 Aug", Players: 1474, Contacted: 1474 / 10 },
		{ Date: "9 Aug", Players: 1720, Contacted: 1720 / 10 },
		{ Date: "10 Aug", Players: 1413, Contacted: 1413 / 10 },
		{ Date: "11 Aug", Players: 1561, Contacted: 1561 / 10 },
		{ Date: "12 Aug", Players: 1915, Contacted: 1915 / 10 },
		{ Date: "13 Aug", Players: 1943, Contacted: 1943 / 10 },
		{ Date: "14 Aug", Players: 1933, Contacted: 1933 / 10 },
		{ Date: "15 Aug", Players: 1470, Contacted: 1470 / 10 },
		{ Date: "16 Aug", Players: 1612, Contacted: 1612 / 10 },
		{ Date: "17 Aug", Players: 1900, Contacted: 1900 / 10 },
		{ Date: "18 Aug", Players: 1379, Contacted: 1379 / 10 },
		{ Date: "19 Aug", Players: 1264, Contacted: 1264 / 10 },
		{ Date: "20 Aug", Players: 1158, Contacted: 1158 / 10 },
		{ Date: "21 Aug", Players: 1615, Contacted: 1615 / 10 },
		{ Date: "22 Aug", Players: 1851, Contacted: 1851 / 10 },
		{ Date: "23 Aug", Players: 1488, Contacted: 1488 / 10 },
	]);

	return (
		<Paper elevation={2} sx={{ padding: 2, marginTop: 4 }}>
			<Typography variant="h5" mb={2} textAlign={"center"}>
				Player Count
			</Typography>

			<Grid2 container justifyContent="center">
				<ResponsiveContainer width={"100%"} height={300}>
					<LineChart margin={{ top: 10, right: 30 }} data={data}>
						<XAxis interval={1} dataKey={"Date"} />
						<YAxis />
						<ReferenceLine x={"17 Aug"} />
						<ReferenceLine x={"10 Aug"} />
						<Tooltip
							wrapperStyle={{
								outlineStyle: "none",
							}}
						/>

						<CartesianGrid strokeDasharray="3 3" />
						<Line
							type="monotone"
							dataKey={"Players"}
							stroke="#8884d8"
							fillOpacity={0.5}
							fill="#8884d8"
							dot={true}
						/>
						<Line
							type="monotone"
							dataKey={"Contacted"}
							stroke="#82ca9d"
							fillOpacity={0.5}
							fill="#82ca9d"
							dot={true}
						/>
						<Legend verticalAlign="bottom" height={36} />
					</LineChart>
				</ResponsiveContainer>
			</Grid2>
		</Paper>
	);
}
