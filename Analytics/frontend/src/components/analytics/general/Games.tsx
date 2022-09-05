import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import InfoCard from "../../InfoCard";

/* [{ name: "Average Number of Games", value: 12.5 }] */

export default function Games() {
	const [data, setData] = useState<CategoryValue[] | undefined>();
	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		axios
			.get("/api/v1/analytics/general/games")
			.then((response) => {
				if (response.status === 200) {
					setData(response.data);
				} else {
					throw new Error("Unexpected Response: " + response.status);
				}
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					enqueueSnackbar("Failed to get game data: " + error.message, {
						variant: "error",
					});
				} else {
					enqueueSnackbar("Failed to get game data: " + error, { variant: "error" });
				}
			});
	}, []);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Games per Device
			</Typography>

			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton variant="rectangular" width={200} height={220} />
				) : (
					<BarChart width={200} height={220} data={data}>
						<XAxis label="Average Number of Games" dataKey="name" />
						<Bar
							barSize={75}
							label={{ fill: "#fff", fontSize: 24, fontWeight: 700 }}
							dataKey="value"
							fill="#8884d8"
						/>
					</BarChart>
				)}
			</Grid2>
		</InfoCard>
	);
}
