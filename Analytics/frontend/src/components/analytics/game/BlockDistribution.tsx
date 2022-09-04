import { Typography } from "@mui/material";
import React, { useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, Legend } from "recharts";
import InfoCard from "../../InfoCard";

export default function BlockDistribution() {
	const [data, setData] = useState([
		{ group: "Low Risk", allPlayers: 20, topPlayers: 12 },
		{ group: "High Risk", allPlayers: 35, topPlayers: 48 },
		{ group: "Insurance", allPlayers: 45, topPlayers: 40 },
	]);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				% Block Distributions
			</Typography>
			<BarChart width={300} height={220} data={data}>
				<XAxis dataKey="group" />
				<Legend />
				<Bar name="All Players" dataKey="allPlayers" fill="#8884d8">
					<LabelList
						style={{ fill: "#000", stroke: "none", fontSize: 18, fontWeight: 700 }}
						dataKey="allPlayers"
						position="center"
						formatter={(v: any) => {
							return `${v}%`;
						}}
					/>
				</Bar>
				<Bar name="Top 5%" dataKey="topPlayers" fill="#82ca9d">
					<LabelList
						style={{ fill: "#000", stroke: "none", fontSize: 18, fontWeight: 700 }}
						dataKey="topPlayers"
						position="center"
						formatter={(v: any) => {
							return `${v}%`;
						}}
					/>
				</Bar>
			</BarChart>
		</InfoCard>
	);
}
