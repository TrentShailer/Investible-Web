import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Label,
	LabelList,
	Legend,
	Pie,
	PieChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import InfoCard from "../../InfoCard";

const colours = ["#82ca9d", "#8884d8", "#81D4FA", "#EF9A9A"];

export default function EndReason() {
	const [data, setData] = useState([
		{ name: "Unstable", value: 9.6 },
		{ name: "Poor", value: 52.9 },
		{ name: "Quit to Main Menu", value: 0.7 },
		{ name: "Gave Up", value: 36.8 },
	]);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Game End Reason
			</Typography>

			<Grid2 container justifyContent="center">
				<PieChart width={300} height={220}>
					<Pie
						data={data}
						nameKey="name"
						dataKey="value"
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={80}>
						<LabelList
							style={{ stroke: "none", fontSize: 18, fontWeight: 700 }}
							dataKey="value"
							position="outside"
							formatter={(v: any) => {
								return `${v}%`;
							}}
						/>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colours[index]} />
						))}
					</Pie>
					<Legend />
				</PieChart>
			</Grid2>
		</InfoCard>
	);
}
