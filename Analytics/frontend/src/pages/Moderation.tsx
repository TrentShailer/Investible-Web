import { Delete } from "@mui/icons-material";
import {
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Paper,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TableItem from "../components/moderation/TableItem";
import TableRowSkeleton from "../components/moderation/TableRowSkeleton";
import { useSnackbar } from "notistack";

export default function Moderation() {
	const [TableData, SetTableData] = useState<LeaderboardRow[]>([
		{ name: "Trent", portfolio_value: 43234234, id: "####" },
		{ name: "Trent", portfolio_value: 43234234, id: "####" },
		{ name: "Trent", portfolio_value: 43234234, id: "####" },
		{ name: "Trent", portfolio_value: 43234234, id: "####" },
		{ name: "Trent", portfolio_value: 43234234, id: "####" },
	]);
	const [TableLoading, SetLoading] = useState(true);
	const [ShowDeleteDialog, SetShowDeleteDialog] = useState(false);
	const [DeleteTarget, SetDeleteTarget] = useState<LeaderboardRow | undefined | null>();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	useEffect(() => {
		FetchTableData();
	}, []);

	const FetchTableData = () => {
		SetLoading(true);
		SetTableData([]);
		axios
			.get("/api/v1/leaderboard")
			.then((response) => {
				SetLoading(false);
				if (response.status === 200) {
					if (response.data.leaderboard) {
					} else {
						throw new Error("Got empty response");
					}
				} else {
					throw new Error("Unexpected response: " + response.status);
				}
			})
			.catch((error) => {
				SetLoading(false);
				if (axios.isAxiosError(error)) {
					enqueueSnackbar("Failed to fetch leaderboard: " + error.message, {
						variant: "error",
					});
				} else {
					enqueueSnackbar(error, { variant: "error" });
				}
			});
	};

	const OpenDeleteDialog = (row: LeaderboardRow) => {
		SetDeleteTarget(row);
		SetShowDeleteDialog(true);
	};

	const DeleteLeaderboardEntry = () => {
		CloseDeleteDialog();
		if (!DeleteTarget) {
			enqueueSnackbar("Target entry was not set.", { variant: "error" });
			return;
		}
		axios
			.delete(`/api/v1/leaderboard/${DeleteTarget.id}`)
			.then((response) => {
				if (response.status === 200) {
					enqueueSnackbar(`Sucessfully deleted leaderboard entry: ${DeleteTarget.name}`, {
						variant: "success",
					});
					FetchTableData();
				} else {
					throw new Error("Unexpected response: " + response.status);
				}
			})
			.catch((error) => {
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

	const CloseDeleteDialog = () => {
		SetShowDeleteDialog(false);
	};

	return (
		<>
			<Dialog open={ShowDeleteDialog} onClose={CloseDeleteDialog}>
				<DialogTitle>Delete Leaderboard Entry {DeleteTarget?.name}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Deleting a leaderboard entry is a permanant action and cannot be undone.
						This will not remove the leaderboard entry from any backups of the database.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={CloseDeleteDialog} autoFocus>
						Cancel
					</Button>
					<Button color="error" onClick={DeleteLeaderboardEntry}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Container>
				<TableContainer sx={{ marginTop: 4 }} component={Paper}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell align="center">Place</TableCell>
								<TableCell align="center">Name</TableCell>
								<TableCell align="center">Portfolio Value</TableCell>
								<TableCell align="center">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{TableLoading ? (
								<>
									<TableRowSkeleton />
									<TableRowSkeleton />
									<TableRowSkeleton />
									<TableRowSkeleton />
									<TableRowSkeleton />
								</>
							) : (
								<>
									{TableData.map((row, index) => (
										<TableItem
											key={row.id}
											index={index}
											row={row}
											OpenDeleteDialog={OpenDeleteDialog}
										/>
									))}
								</>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
		</>
	);
}
