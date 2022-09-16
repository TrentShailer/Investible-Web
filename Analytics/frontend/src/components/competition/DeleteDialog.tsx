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
	id: string | undefined;
	Close: (refresh: boolean) => void;
};
export default function DeleteDialog({ id, Close }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const Confirm = () => {
		axios
			.delete(`/api/v1/competition/${id}`)
			.then(() => {
				enqueueSnackbar(`Successfully deleted competition: ${id}`, {
					variant: "success",
				});
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					if (error.status === "401" || error.response?.status === 401) {
						enqueueSnackbar("You are not logged in", {
							variant: "error",
						});
						return;
					}
				}
				enqueueSnackbar("Failed to delete competition. Please Report this.", {
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
			open={id ? true : false}
			onClose={() => {
				Close(false);
			}}>
			<DialogTitle>Delete Competition?</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Deleting a competition is a permanent action and cannot be undone. This will not
					remove the competition from any backups of the database.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						Close(false);
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
