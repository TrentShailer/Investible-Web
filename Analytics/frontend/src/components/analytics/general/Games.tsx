import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import InfoCard from "../../InfoCard";

export default function Games() {
	const [data, setData] = useState([{ x: "Average Number of Games", games: 17.3 }]);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Games per Device
			</Typography>

			<Grid2 container justifyContent="center">
				<BarChart width={200} height={220} data={data}>
					<XAxis dataKey="x" />
					<Bar
						barSize={75}
						label={{ fill: "#fff", fontSize: 24, fontWeight: 700 }}
						dataKey="games"
						fill="#8884d8"
					/>
				</BarChart>
			</Grid2>
		</InfoCard>
	);
}
