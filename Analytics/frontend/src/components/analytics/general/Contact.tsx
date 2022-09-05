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

const colours = ["#82ca9d", "#8884d8"];

/* [
	{ name: "Clicked Contact", value: 10 },
	{ name: "Didn't Click Contact", value: 90 },
] */
export default function Contact() {
	const [data, setData] = useState<CategoryValue[] | undefined>();
	const { enqueueSnackbar } = useSnackbar();
	useEffect(() => {
		axios
			.get("/api/v1/analytics/general/contact")
			.then((response) => {
				if (response.status === 200) {
					setData(response.data);
				} else {
					throw new Error("Unexpected Response: " + response.status);
				}
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					enqueueSnackbar("Failed to get contact data: " + error.message, {
						variant: "error",
					});
				} else {
					enqueueSnackbar("Failed to get contact data: " + error, {
						variant: "error",
					});
				}
			});
	}, []);
	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				% Clicked Contact
			</Typography>
			<Grid2 container justifyContent="center">
				{data === undefined ? (
					<Skeleton sx={{ marginTop: 1 }} variant="circular" width={160} height={160} />
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
