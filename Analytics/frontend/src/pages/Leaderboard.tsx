import {
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TableItem from "../components/leaderboard/TableItem";
import TableRowSkeleton from "../components/leaderboard/TableRowSkeleton";
import { useSnackbar } from "notistack";
import DeleteDialog from "../components/leaderboard/DeleteDialog";
import ViewDialog from "../components/leaderboard/ViewDialog";

function range(min: number, max: number) {
	var len = max - min + 1;
	var arr = new Array(len);
	for (var i = 0; i < len; i++) {
		arr[i] = min + i;
	}
	return arr;
}

export default function Leaderboard() {
	const [TableData, SetTableData] = useState<LeaderboardRow[] | null>(null);
	const [DeleteTarget, SetDeleteTarget] = useState<LeaderboardRow | null>(null);
	const [ViewTarget, SetViewTarget] = useState<LeaderboardRow | null>(null);

	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		FetchTableData();
	}, []);

	const FetchTableData = () => {
		SetTableData(null);
		axios
			.get("/api/v1/leaderboard")
			.then((response) => {
				if (response.data.leaderboard) {
					SetTableData(response.data.leaderboard);
				} else {
					throw new Error("Empty Response");
				}
			})
			.catch((error) => {
				SetTableData([]);
				if (axios.isAxiosError(error)) {
					if (error.status === "401") {
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
	};

	const OpenDeleteDialog = (row: LeaderboardRow) => {
		SetDeleteTarget(row);
	};

	const CloseDeleteDialog = (reload: boolean | undefined) => {
		SetDeleteTarget(null);
		if (reload) {
			FetchTableData();
		}
	};

	const OpenViewDialog = (row: LeaderboardRow) => {
		SetViewTarget(row);
	};

	const CloseViewDialog = () => {
		SetViewTarget(null);
	};

	return (
		<>
			<DeleteDialog Close={CloseDeleteDialog} Target={DeleteTarget} />
			<ViewDialog Close={CloseViewDialog} Target={ViewTarget} />
			<Container>
				<TableContainer sx={{ marginTop: 4, marginBottom: 4 }} component={Paper}>
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
							{TableData === null ? (
								<>
									{range(1, 10).map((i) => (
										<TableRowSkeleton key={i} />
									))}
								</>
							) : (
								<>
									{TableData.map((row, index) => (
										<TableItem
											key={row.id}
											index={index}
											row={row}
											OpenDeleteDialog={OpenDeleteDialog}
											OpenViewDialog={OpenViewDialog}
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
