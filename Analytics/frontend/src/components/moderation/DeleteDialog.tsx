import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React from "react";

type Props = {
	Close: Function;
	Target: LeaderboardRow | null;
};

export default function DeleteDialog({ Close, Target }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const Confirm = () => {
		if (!Target) {
			enqueueSnackbar("Target entry was not set.", { variant: "error" });
			return;
		}
		axios
			.delete(`/api/v1/leaderboard/${Target.id}`)
			.then((response) => {
				if (response.status === 200) {
					enqueueSnackbar(`Sucessfully deleted leaderboard entry: ${Target.name}`, {
						variant: "success",
					});
					Close(true);
				} else {
					throw new Error("Unexpected response: " + response.status);
				}
			})
			.catch((error) => {
				Close(true);
				if (axios.isAxiosError(error)) {
					enqueueSnackbar(`Failed to delete leaderboard entry: ${error.message}`, {
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
		<Dialog
			open={Target ? true : false}
			onClose={() => {
				Close();
			}}>
			<DialogTitle>Delete Leaderboard Entry {Target?.name}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Deleting a leaderboard entry is a permanant action and cannot be undone. This
					will not remove the leaderboard entry from any backups of the database.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						Close();
					}}
					autoFocus>
					Cancel
				</Button>
				<Button color="error" onClick={Confirm}>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}
