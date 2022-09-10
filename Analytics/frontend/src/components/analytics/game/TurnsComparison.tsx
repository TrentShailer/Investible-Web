import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, Legend } from "recharts";
import InfoCard from "../../InfoCard";
/* [{ label: "Average Number of Turns", allPlayers: 52, topPlayers: 162 }] */

export default function TurnsComparison() {
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState<GameAnalytics[] | undefined>();

	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/comparison/Turns")
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

				enqueueSnackbar("Failed to get turn analytics. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Number of Turns
			</Typography>

			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton variant="rectangular" width={200} height={220} />
				) : (
					<BarChart width={200} height={220} data={data}>
						<XAxis dataKey="group" />
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
									return `${v}`;
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
									return `${v}`;
								}}
							/>
						</Bar>
						<Legend />
					</BarChart>
				)}
			</Grid2>
		</InfoCard>
	);
}
