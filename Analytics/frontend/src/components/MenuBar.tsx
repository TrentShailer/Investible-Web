import { Logout } from "@mui/icons-material";
import { Box, Button, Tab, Tabs } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";

type Props = {
	page: Page;
	onChange: Function;
};

enum Page {
	competition,
	leaderboard,
	generalAnalytics,
	gameAnalytics,
}

export default function MenuBar({ page, onChange }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const logout = () => {
		axios
			.delete("/api/v1/session")
			.then((response) => {
				window.location.href = "/login";
			})
			.catch((error) => {
				enqueueSnackbar("Failed to log out. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	};

	return (
		<Box sx={{ borderBottom: 1, borderColor: "divider", background: "#fff" }}>
			<Grid2 container justifyContent={"space-around"}>
				<Tabs
					onChange={(e, v) => {
						onChange(v);
					}}
					value={page}>
					<Tab label="Competition" />
					<Tab label="Leaderboard" />
					<Tab label="General Analytics" />
					<Tab label="Game Analytics" />
				</Tabs>
				<Button onClick={logout} startIcon={<Logout />} color="error">
					Logout
				</Button>
			</Grid2>
		</Box>
	);
}

export { Page };
