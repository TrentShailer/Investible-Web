import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Label, LabelList, Legend } from "recharts";
import InfoCard from "../../InfoCard";

export default function GameTime() {
	const [data, setData] = useState([
		{ group: "Average Game Length", allPlayers: 512.4, topPlayers: 2059.9 },
	]);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Game Length
			</Typography>
			<Grid2 container justifyContent="center">
				<BarChart width={200} height={220} data={data}>
					<XAxis dataKey="group" />
					<Legend />
					<Bar name="All Players" dataKey="allPlayers" fill="#8884d8">
						<LabelList
							style={{ fill: "#000", stroke: "none", fontSize: 18, fontWeight: 700 }}
							dataKey="allPlayers"
							position="center"
							formatter={(v: any) => {
								return `${v} sec`;
							}}
						/>
					</Bar>
					<Bar name="Top 5%" dataKey="topPlayers" fill="#82ca9d">
						<LabelList
							style={{ fill: "#000", stroke: "none", fontSize: 18, fontWeight: 700 }}
							dataKey="topPlayers"
							position="center"
							formatter={(v: any) => {
								return `${v} sec`;
							}}
						/>
					</Bar>
				</BarChart>
			</Grid2>
		</InfoCard>
	);
}
