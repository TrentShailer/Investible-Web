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

const GetMarkers = () => {
	let markers = [];
	let yesterday = new Date().getTime() - 1000 * 60 * 60 * 24;
	let day = new Date(yesterday).getDay();

	let distToLastSunday = day === 0 ? 7 : day;
	let lastSundayIndex = 20 - distToLastSunday;

	if (day === 0) markers.push(20);
	markers.push(lastSundayIndex);
	if (lastSundayIndex - 7 >= 0) markers.push(lastSundayIndex - 7);
	if (lastSundayIndex - 14 >= 0) markers.push(lastSundayIndex - 14);

	return markers;
};

export default function Players() {
	const [data, setData] = useState<PlayerCount[] | undefined>();
	const [marker, setMarker] = useState<number[]>(GetMarkers());
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		axios
			.get("/api/v1/analytics/general/players")
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
				Player Count
			</Typography>
			{data === undefined ? (
				<Skeleton variant="rounded" width={"100%"} height={300} />
			) : (
				<Grid2 container justifyContent="center">
					<ResponsiveContainer width={"100%"} height={300}>
						<LineChart margin={{ top: 10, right: 30 }} data={data}>
							<XAxis interval={1} dataKey={"Date"} />
							<YAxis />
							{marker.map((markerIndex) => {
								if (data[markerIndex] !== undefined) {
									return (
										<ReferenceLine
											key={data[markerIndex].Date}
											x={data[markerIndex].Date}
										/>
									);
								} else return null;
							})}

							<Tooltip
								wrapperStyle={{
									outlineStyle: "none",
								}}
							/>
							<CartesianGrid strokeDasharray="3 3" />
							<Line
								type="monotone"
								dataKey={"Players"}
								stroke="#8884d8"
								fillOpacity={0.5}
								fill="#8884d8"
								dot={true}
							/>
							<Legend verticalAlign="bottom" height={36} />
						</LineChart>
					</ResponsiveContainer>
				</Grid2>
			)}
		</Paper>
	);
}
