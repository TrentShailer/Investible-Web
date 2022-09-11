import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, Legend, Tooltip } from "recharts";
import InfoCard from "../../InfoCard";

/* [
	{ label: "Low Risk", allPlayers: 20, topPlayers: 12 },
	{ label: "High Risk", allPlayers: 35, topPlayers: 48 },
	{ label: "Insurance", allPlayers: 45, topPlayers: 40 },
] */
export default function BlockDistributionComparison() {
	const [data, setData] = useState<GameAnalytics[] | undefined>();
	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/comparison/block_distribution")
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					if (error.status === "401") {
						enqueueSnackbar("You are not logged in", {
							variant: "error",
						});
						return;
					}
				}

				enqueueSnackbar("Failed to get block distribution analytics. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	useEffect(() => {
		setTimeout(() => {}, 570);
	}, []);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Block Type
			</Typography>
			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton variant="rectangular" width={300} height={220} />
				) : (
					<BarChart width={300} height={220} data={data}>
						<XAxis dataKey="label" />
						<Legend />
						<Bar name="All Players" dataKey="allPlayers" fill="#8884d8">
							<LabelList
								style={{
									fill: "#000",
									stroke: "none",
									fontSize: 16,
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
									fontSize: 16,
									fontWeight: 700,
								}}
								dataKey="topPlayers"
								position="center"
								formatter={(v: any) => {
									return `${v}%`;
								}}
							/>
						</Bar>
						<Tooltip />
					</BarChart>
				)}
			</Grid2>
		</InfoCard>
	);
}
