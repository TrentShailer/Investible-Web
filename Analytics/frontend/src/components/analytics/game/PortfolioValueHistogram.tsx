import { Paper, Typography, Skeleton } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, XAxis, BarChart, Bar, Label } from "recharts";

/* [
		{ range: "0-1", count: 10 },
		{ range: "1-2", count: 3 },
		{ range: "2-3", count: 0 },
		{ range: "3-4", count: 2 },
		{ range: "4-5", count: 2 },
		{ range: "5-6", count: 3 },
		{ range: "6-7", count: 1 },
		{ range: "7-8", count: 0 },
		{ range: "8-9", count: 0 },
		{ range: "9-10", count: 1 },
		{ range: "10-11", count: 2 },
		{ range: "11-12", count: 1 },
		{ range: "12-13", count: 0 },
		{ range: "13-14", count: 3 },
		{ range: "14-15", count: 0 },
		{ range: "15+", count: 7 },
	] */

export default function PortfolioValueHistogram() {
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState<HistogramData[] | undefined>();

	useEffect(() => {
		axios
			.get("/api/v1/analytics/game/histogram/PortfolioValue")
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
		<Grid2 xs={5.9}>
			<Paper elevation={2} sx={{ padding: 2 }}>
				<Typography variant="h5" mb={2} textAlign={"center"}>
					Portfolio Value
				</Typography>
				{data === undefined ? (
					<Skeleton variant="rounded" width={"100%"} height={200} />
				) : (
					<Grid2 container justifyContent="center">
						<ResponsiveContainer width={"100%"} height={200}>
							<BarChart barCategoryGap={0} margin={{ bottom: 25 }} data={data}>
								<XAxis angle={-15} interval={0} fontSize={12} dataKey="range">
									<Label
										value="Portfolio Value (Hundred Thousands)"
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
