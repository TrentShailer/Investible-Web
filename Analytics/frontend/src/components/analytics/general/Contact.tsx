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

const colours = ["#82ca9d", "#8884d8"];

export default function Contact() {
	const [data, setData] = useState([
		{ name: "Clicked Contact", value: 10 },
		{ name: "Didn't Click Contact", value: 90 },
	]);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				% Clicked Contact
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
