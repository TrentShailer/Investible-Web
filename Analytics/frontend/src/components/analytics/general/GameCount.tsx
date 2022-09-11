import { CircularProgress, Paper, Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export default function GameCount() {
	const [data, setData] = useState<PlayerCount[] | undefined>();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		setData(undefined);
		axios
			.get("/api/v1/analytics/general/game_count")
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

				enqueueSnackbar("Failed to get player analytics. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	return (
		<Paper elevation={2} sx={{ padding: 2, marginTop: 4 }}>
			<Typography variant="h5" mb={2} textAlign={"center"}>
				Game Count
			</Typography>
			{data === undefined ? (
				<Skeleton variant="rounded" width={"100%"} height={300} />
			) : (
				<Grid2 container justifyContent="center">
					<ResponsiveContainer width={"100%"} height={300}>
						<LineChart margin={{ top: 10, right: 30 }} data={data}>
							<XAxis interval={1} dataKey={"Date"} />
							<YAxis />

							<Tooltip
								wrapperStyle={{
									outlineStyle: "none",
								}}
							/>
							<CartesianGrid strokeDasharray="3 3" />
							<Line
								type="monotone"
								dataKey={"Games"}
								stroke="#8884d8"
								fillOpacity={0.5}
								fill="#8884d8"
								dot={true}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Grid2>
			)}
		</Paper>
	);
}
