import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Label, LabelList, Legend } from "recharts";
import InfoCard from "../../InfoCard";

/* [{ label: "Average Game Length", allPlayers: 512.4, topPlayers: 2059.9 }] */
export default function GameTime() {
	const [data, setData] = useState<GameAnalytics[] | undefined>();

	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		axios
			.get("/api/v1/gametime")
			.then((response) => {
				if (response.status === 200) {
					setData(response.data);
				} else {
					throw new Error("Unexpected Response: " + response.status);
				}
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					enqueueSnackbar("Failed to get game length data: " + error.message, {
						variant: "error",
					});
				} else {
					enqueueSnackbar("Failed to get game length data: " + error, {
						variant: "error",
					});
				}
			});
	}, []);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Game Length
			</Typography>
			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton variant="rectangular" width={200} height={220} />
				) : (
					<BarChart width={200} height={220} data={data}>
						<XAxis dataKey="group" />
						<Legend />
						<Bar name="All Players" dataKey="allPlayers" fill="#8884d8">
							<LabelList
								style={{
									fill: "#000",
									stroke: "none",
									fontSize: 18,
									fontWeight: 700,
								}}
								dataKey="allPlayers"
								position="center"
								formatter={(v: any) => {
									return `${v} sec`;
								}}
							/>
						</Bar>
						<Bar name="Top 5%" dataKey="topPlayers" fill="#82ca9d">
							<LabelList
								style={{
									fill: "#000",
									stroke: "none",
									fontSize: 18,
									fontWeight: 700,
								}}
								dataKey="topPlayers"
								position="center"
								formatter={(v: any) => {
									return `${v} sec`;
								}}
							/>
						</Bar>
					</BarChart>
				)}
			</Grid2>
		</InfoCard>
	);
}
