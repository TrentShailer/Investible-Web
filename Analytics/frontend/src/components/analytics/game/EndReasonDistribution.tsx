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
		{ name: "Unstable", value: 9.6 },
		{ name: "Poor", value: 52.9 },
		{ name: "Quit to Main Menu", value: 0.7 },
		{ name: "Gave Up", value: 36.8 },
	]
 */

export default function EndReasonDistribution() {
	const [data, setData] = useState<CategoryValue[] | undefined>();

	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/distribution/EndReason")
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

				enqueueSnackbar("Failed to get end reason analytics. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Game End Reason
			</Typography>

			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton sx={{ marginTop: 2 }} variant="circular" width={180} height={180} />
				) : (
					<PieChart width={300} height={220}>
						<Pie
							data={data}
							nameKey="name"
							dataKey="value"
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={80}>
							<LabelList
								style={{ stroke: "none", fontSize: 18, fontWeight: 700 }}
								dataKey="value"
								position="outside"
								formatter={(v: any) => {
									return `${v}%`;
								}}
							/>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={colours[index]} />
							))}
						</Pie>
						<Legend />
					</PieChart>
				)}
			</Grid2>
		</InfoCard>
	);
}
