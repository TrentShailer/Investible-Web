import { Logout } from "@mui/icons-material";
import { Box, Button, Tab, Tabs } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";

type Props = {
	page: number;
	onChange: Function;
};

export default function MenuBar({ page, onChange }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const logout = () => {
		axios
			.delete("/api/v1/session")
			.then((response) => {
				if (response.status === 200) {
					window.location.href = "/";
					return;
				} else {
					throw new Error("Unexpected response: " + response.status);
				}
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					enqueueSnackbar("Failed to delete your session: " + error.message, {
						variant: "error",
					});
				} else {
					enqueueSnackbar(error, {
						variant: "error",
					});
				}
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
					<Tab label="Moderation" />
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
