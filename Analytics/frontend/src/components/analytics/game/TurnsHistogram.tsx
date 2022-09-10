import { Paper, Typography, Skeleton } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, BarChart, Bar, Label } from "recharts";

/* [
		{ range: "0-10", count: 10 },
		{ range: "10-20", count: 20 },
		{ range: "20-30", count: 30 },
		{ range: "30-40", count: 40 },
		{ range: "40-50", count: 50 },
		{ range: "50-60", count: 40 },
		{ range: "60-70", count: 30 },
		{ range: "70-80", count: 20 },
		{ range: "80-90", count: 10 },
		{ range: "90-100", count: 5 },
		{ range: "100-110", count: 2 },
		{ range: "110-120", count: 1 },
		{ range: "120-130", count: 1 },
		{ range: "130-140", count: 1 },
		{ range: "140-150", count: 1 },
		{ range: "150+", count: 1 },
	] */

export default function TurnsHistogram() {
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState<HistogramData[] | undefined>();

	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/histogram/turns")
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
		<Grid2 xs={5.9}>
			<Paper elevation={2} sx={{ padding: 2 }}>
				<Typography variant="h5" mb={2} textAlign={"center"}>
					Number of Turns
				</Typography>
				{data === undefined ? (
					<Skeleton variant="rounded" width={"100%"} height={200} />
				) : (
					<Grid2 container justifyContent="center">
						<ResponsiveContainer width={"100%"} height={200}>
							<BarChart barCategoryGap={0} margin={{ bottom: 25 }} data={data}>
								<XAxis angle={-15} interval={0} fontSize={12} dataKey="range">
									<Label value="Number of Turns" offset={10} position="bottom" />
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
