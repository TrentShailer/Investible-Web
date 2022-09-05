import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, Legend } from "recharts";
import InfoCard from "../../InfoCard";

/* [
	{ group: "Low Risk", allPlayers: 20, topPlayers: 12 },
	{ group: "High Risk", allPlayers: 35, topPlayers: 48 },
	{ group: "Insurance", allPlayers: 45, topPlayers: 40 },
] */
export default function BlockDistribution() {
	const [data, setData] = useState<GameAnalytics[] | undefined>();
	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/blockdistribution")
			.then((response) => {
				if (response.status === 200) {
					setData(response.data);
				} else {
					throw new Error("Unexpected Response: " + response.status);
				}
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					enqueueSnackbar("Failed to get block distribution data: " + error.message, {
						variant: "error",
					});
				} else {
					enqueueSnackbar("Failed to get block distribution data: " + error, {
						variant: "error",
					});
				}
			});
	}, []);

	useEffect(() => {
		setTimeout(() => {}, 570);
	}, []);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				% Block Distributions
			</Typography>
			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton variant="rectangular" width={300} height={220} />
				) : (
					<BarChart width={300} height={220} data={data}>
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
									return `${v}%`;
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
									return `${v}%`;
								}}
							/>
						</Bar>
					</BarChart>
				)}
			</Grid2>
		</InfoCard>
	);
}
