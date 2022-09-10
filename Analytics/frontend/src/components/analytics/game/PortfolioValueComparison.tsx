import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, Legend } from "recharts";
import InfoCard from "../../InfoCard";
/* [
		{ label: "Average Portfolio Value", allPlayers: 512462, topPlayers: 1240570 },
	] */

export default function PortfolioValue() {
	const [data, setData] = useState<GameAnalytics[] | undefined>();

	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/comparison/portfolio_value")
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

				enqueueSnackbar("Failed to get portfolio value analytics. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Portfolio Value
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
									fontSize: 16,
									fontWeight: 700,
								}}
								dataKey="allPlayers"
								position="center"
								formatter={(v: number) => {
									return `$${v.toLocaleString("en-US")}`;
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
								formatter={(v: number) => {
									return `$${v.toLocaleString("en-US")}`;
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
