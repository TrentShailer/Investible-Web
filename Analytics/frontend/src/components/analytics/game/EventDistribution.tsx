import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
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

const colours = ["#82ca9d", "#8884d8", "#81D4FA", "#EF9A9A"];

/*
[
		{ name: "Positive", value: 49.7 },
		{ name: "Negative", value: 50.3 },
]
 */

export default function EventDistribution() {
	const [data, setData] = useState<CategoryValue[] | undefined>();

	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/distribution/event")
			.then((response) => {
				if (response.status === 200) {
					setData(response.data);
				} else {
					throw new Error("Unexpected Response: " + response.status);
				}
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

				enqueueSnackbar("Failed to get event analytics. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Events per Game
			</Typography>

			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton variant="rectangular" width={200} height={220} />
				) : (
					<BarChart width={200} height={220} data={data}>
						<XAxis dataKey="name" />
						<Bar dataKey="value" fill="#8884d8">
							<LabelList
								style={{
									fill: "#000",
									stroke: "none",
									fontSize: 16,
									fontWeight: 700,
								}}
								dataKey="value"
								position="center"
								formatter={(v: number) => {
									return `${v}`;
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
