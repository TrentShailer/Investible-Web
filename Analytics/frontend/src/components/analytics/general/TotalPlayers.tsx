import { Skeleton, Typography } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import InfoCard from "../../InfoCard";

export default function TotalPlayers() {
	const { enqueueSnackbar } = useSnackbar();
	const [playerCount, setPlayerCount] = React.useState<number | undefined>();

	useEffect(() => {
		axios
			.get("/api/v1/analytics/general/total_players")
			.then((response) => {
				setPlayerCount(response.data);
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					if (error.status === "401" || error.response?.status === 401) {
						enqueueSnackbar("You are not logged in", { variant: "error" });
						return;
					}
				}
				enqueueSnackbar("Failed to get total players. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	}, []);

	return (
		<InfoCard>
			<Typography variant="h5" textAlign={"center"}>
				Total Player Count
			</Typography>
			{playerCount === undefined ? (
				<Skeleton sx={{ marginTop: 5 }} height={120} />
			) : (
				<Typography mt={8} variant="h2" textAlign={"center"}>
					{playerCount.toLocaleString()}
				</Typography>
			)}
		</InfoCard>
	);
}
