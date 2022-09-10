import { Paper, Typography, Skeleton } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, BarChart, Bar, Label } from "recharts";

/* [
		{ range: "0-2", count: 10 },
		{ range: "2-4", count: 20 },
		{ range: "4-6", count: 30 },
		{ range: "6-8", count: 40 },
		{ range: "8-10", count: 50 },
		{ range: "10-12", count: 40 },
		{ range: "12-14", count: 30 },
		{ range: "14-16", count: 20 },
		{ range: "16-18", count: 10 },
		{ range: "18-20", count: 5 },
		{ range: "20-22", count: 2 },
		{ range: "22-24", count: 1 },
		{ range: "24-26", count: 1 },
		{ range: "26-28", count: 1 },
		{ range: "20-30", count: 1 },
		{ range: "30+", count: 1 },
	] */

export default function GameLengthHistogram() {
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState<HistogramData[] | undefined>();

	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/histogram/GameLength")
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

				enqueueSnackbar("Failed to get game length analytics. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	return (
		<Grid2 xs={5.9}>
			<Paper elevation={2} sx={{ padding: 2 }}>
				<Typography variant="h5" mb={2} textAlign={"center"}>
					Game Length
				</Typography>
				{data === undefined ? (
					<Skeleton variant="rounded" width={"100%"} height={200} />
				) : (
					<Grid2 container justifyContent="center">
						<ResponsiveContainer width={"100%"} height={200}>
							<BarChart barCategoryGap={0} margin={{ bottom: 25 }} data={data}>
								<XAxis angle={-15} interval={0} fontSize={12} dataKey="range">
									<Label
										value="Game Length (minutes)"
										offset={10}
										position="bottom"
									/>
								</XAxis>
								<Bar dataKey="count" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</Grid2>
				)}
			</Paper>
		</Grid2>
	);
}
