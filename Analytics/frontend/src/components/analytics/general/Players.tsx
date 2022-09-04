import { Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
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
		{ date: "3 Aug", players: 50 },
		{ date: "4 Aug", players: 3000 },
		{ date: "5 Aug", players: 2000 },
		{ date: "6 Aug", players: 1732 },
		{ date: "7 Aug", players: 1892 },
		{ date: "8 Aug", players: 1474 },
		{ date: "9 Aug", players: 1720 },
		{ date: "10 Aug", players: 1413 },
		{ date: "11 Aug", players: 1561 },
		{ date: "12 Aug", players: 1915 },
		{ date: "13 Aug", players: 1943 },
		{ date: "14 Aug", players: 1933 },
		{ date: "15 Aug", players: 1470 },
		{ date: "16 Aug", players: 1612 },
		{ date: "17 Aug", players: 1900 },
		{ date: "18 Aug", players: 1379 },
		{ date: "19 Aug", players: 1264 },
		{ date: "20 Aug", players: 1158 },
		{ date: "21 Aug", players: 1615 },
		{ date: "22 Aug", players: 1851 },
		{ date: "23 Aug", players: 1488 },
	]);

	return (
		<Paper sx={{ padding: 2 }}>
			<Typography variant="h5" mb={2} textAlign={"center"}>
				Player Count
			</Typography>
			<AreaChart width={1000} height={300} data={data}>
				<XAxis dataKey={"date"} />
				<YAxis />
				<ReferenceLine x={"17 Aug"} />
				<ReferenceLine x={"10 Aug"} />
				<Tooltip
					wrapperStyle={{
						outlineStyle: "none",
					}}
				/>

				<CartesianGrid strokeDasharray="3 3" />
				<Area
					type="monotone"
					dataKey={"players"}
					stroke="#8884d8"
					fillOpacity={0.5}
					fill="#8884d8"
					dot={true}
				/>
			</AreaChart>
		</Paper>
	);
}
