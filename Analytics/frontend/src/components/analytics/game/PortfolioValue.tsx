import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, Legend } from "recharts";
import InfoCard from "../../InfoCard";

export default function PortfolioValue() {
	const [data, setData] = useState([
		{ group: "Average Portfolio Value", allPlayers: 512462, topPlayers: 1240570 },
	]);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Portfolio Value
			</Typography>

			<Grid2 container justifyContent="center">
				<BarChart width={200} height={220} data={data}>
					<XAxis dataKey="group" />
					<Bar name="All Players" dataKey="allPlayers" fill="#8884d8">
						<LabelList
							style={{ fill: "#000", stroke: "none", fontSize: 18, fontWeight: 700 }}
							dataKey="allPlayers"
							position="center"
							formatter={(v: number) => {
								return `$${v.toLocaleString("en-US")}`;
							}}
						/>
					</Bar>
					<Bar name="Top 5%" dataKey="topPlayers" fill="#82ca9d">
						<LabelList
							style={{ fill: "#000", stroke: "none", fontSize: 18, fontWeight: 700 }}
							dataKey="topPlayers"
							position="center"
							formatter={(v: number) => {
								return `$${v.toLocaleString("en-US")}`;
							}}
						/>
					</Bar>
					<Legend />
				</BarChart>
			</Grid2>
		</InfoCard>
	);
}
