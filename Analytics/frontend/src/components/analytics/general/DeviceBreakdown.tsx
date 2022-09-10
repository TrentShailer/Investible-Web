import { Skeleton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Cell, LabelList, Legend, Pie, PieChart } from "recharts";
import InfoCard from "../../InfoCard";

const colours = ["#82ca9d", "#8884d8"];

/*
[
	{ name: "Mobile", value: 72.6 },
	{ name: "Desktop", value: 27.4 },
]
 */

export default function DeviceBreakdown() {
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState<CategoryValue[] | undefined>();

	useEffect(() => {
		axios
			.get("/api/v1/analytics/general/DeviceBreakdown")
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

				enqueueSnackbar(
					"Failed to get device breakdown analytics. Please contact an admin.",
					{ variant: "error" }
				);
				console.error(error);
			});
	}, [enqueueSnackbar]);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Device Breakdown
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
