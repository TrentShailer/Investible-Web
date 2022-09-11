import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis } from "recharts";
import InfoCard from "../../InfoCard";

export default function Games() {
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState<CategoryValue[] | undefined>();

	useEffect(() => {
		axios
			.get("/api/v1/analytics/general/games")
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

				enqueueSnackbar("Failed to get games analytics. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Average Games per Device
			</Typography>

			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton
						sx={{ marginTop: 3 }}
						variant="rectangular"
						width={150}
						height={175}
					/>
				) : (
					<BarChart width={200} height={220} data={data}>
						<XAxis dataKey="name" />
						<Bar
							barSize={75}
							label={{ fill: "#fff", fontSize: 24, fontWeight: 700 }}
							dataKey="value"
							fill="#8884d8"
						/>
						<Tooltip />
					</BarChart>
				)}
			</Grid2>
		</InfoCard>
	);
}
