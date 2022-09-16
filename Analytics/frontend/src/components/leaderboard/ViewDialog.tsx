import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import InfoGrid from "./ViewDialog/InfoGrid";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

type Props = {
	Close: Function;
	Target: LeaderboardRow | null;
};

export default function ViewDialog({ Close, Target }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	dayjs.extend(utc);
	dayjs.extend(timezone);
	const [TZ, setTZ] = React.useState<string>(dayjs.tz.guess());
	const [data, setData] = React.useState<DetailedLeaderboardRow | null>(null);

	useEffect(() => {
		if (Target !== null) {
			axios
				.get(`/api/v1/leaderboard/${Target.id}`)
				.then((res) => {
					let data = res.data as DetailedLeaderboardRow;
					data.timestamp = dayjs.utc(data.timestamp).tz(TZ).format("YYYY/MM/DD hh:mm a");
					setData(data);
				})
				.catch((error) => {
					Close();
					if (axios.isAxiosError(error)) {
						if (error.status === "401" || error.response?.status === 401) {
							enqueueSnackbar("You are not logged in", {
								variant: "error",
							});
							return;
						}
					}

					enqueueSnackbar("Failed to get leaderboard data. Please report this.", {
						variant: "error",
					});
					console.error(error);
				});
		} else {
			setData(null);
		}
	}, [Target, Close, enqueueSnackbar]);

	return (
		<Dialog
			open={Target ? true : false}
			onClose={() => {
				Close();
			}}
			maxWidth="md"
			fullWidth>
			<DialogTitle>View Leaderboard Entry '{Target?.name}'</DialogTitle>
			<DialogContent>
				{data === null ? (
					<Grid2 container justifyContent="center">
						<CircularProgress />
					</Grid2>
				) : (
					<Box sx={{ marginTop: 2 }}>
						<InfoGrid
							titles={["Display Name", "Full Name"]}
							values={[
								data.name,
								data.first_name === null || data.last_name === null
									? null
									: `${data.first_name} ${data.last_name}`,
							]}
						/>
						<InfoGrid titles={["Email", "Mobile"]} values={[data.email, data.mobile]} />
						<InfoGrid
							titles={["Device", "Clicked Contact"]}
							values={[
								data.mobile_device ? "Mobile" : "Desktop",
								data.clicked_contact ? "Yes" : "No",
							]}
						/>
						<Divider sx={{ marginBottom: 2, marginTop: 1 }}>
							<Typography variant="overline" color={grey[500]}>
								Game Info
							</Typography>
						</Divider>
						<InfoGrid
							titles={["Timestamp", "Game Version"]}
							values={[data.timestamp, data.game_version]}
						/>
						<Typography mt={1} color={grey[500]} variant="subtitle2">
							These should match.
						</Typography>
						<InfoGrid
							titles={["Leaderboard Portfolio Value", "Game Portfolio Value"]}
							values={[
								"$" + data.portfolio_value.toLocaleString("en-US"),
								"$" + data.game_portfolio_value!.toLocaleString("en-US"),
							]}
						/>
						<InfoGrid
							titles={["Turns", "Game Length"]}
							values={[data.turns!.toString(), data.game_time!.toFixed(2) + "s"]}
						/>
						<InfoGrid
							titles={["Positive Event Count", "Negative Event Count"]}
							values={[
								data.positive_event_count!.toString(),
								data.negative_event_count!.toString(),
							]}
						/>
						<InfoGrid
							titles={["Insurance Count", "High Risk Count"]}
							values={[
								data.insurance_count!.toString(),
								data.high_risk_count!.toString(),
							]}
						/>
						<InfoGrid
							titles={["Low Risk Count", ""]}
							values={[data.low_risk_count!.toString(), ""]}
						/>
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						Close();
					}}
					autoFocus>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
