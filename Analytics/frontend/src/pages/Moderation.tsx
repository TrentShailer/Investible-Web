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
import TableItem from "../components/moderation/TableItem";
import TableRowSkeleton from "../components/moderation/TableRowSkeleton";
import { useSnackbar } from "notistack";
import DeleteDialog from "../components/moderation/DeleteDialog";

export default function Moderation() {
	const [TableData, SetTableData] = useState<LeaderboardRow[] | null>(null);
	const [DeleteTarget, SetDeleteTarget] = useState<LeaderboardRow | null>(null);

	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		FetchTableData();
	}, []);

	const FetchTableData = () => {
		SetTableData(null);
		axios
			.get("/api/v1/leaderboard")
			.then((response) => {
				if (response.status === 200) {
					if (response.data.leaderboard) {
						SetTableData(response.data.leaderboard);
					} else {
						throw new Error("Got empty response");
					}
				} else {
					throw new Error("Unexpected response: " + response.status);
				}
			})
			.catch((error) => {
				SetTableData([]);
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
	};

	const CloseDeleteDialog = (reload: boolean | undefined) => {
		SetDeleteTarget(null);
		if (reload) {
			FetchTableData();
		}
	};

	return (
		<>
			<DeleteDialog Close={CloseDeleteDialog} Target={DeleteTarget} />
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
							{TableData === null ? (
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
