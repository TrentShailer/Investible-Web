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
			.then(() => {
				enqueueSnackbar(`Successfully deleted leaderboard entry: ${Target.name}`, {
					variant: "success",
				});
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

				enqueueSnackbar("Failed to delete leaderboard entry. Please Report this.", {
					variant: "error",
				});
				console.error(error);
			})
			.finally(() => {
				Close(true);
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
