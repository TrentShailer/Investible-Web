import {
	Dialog,
	DialogTitle,
	DialogContent,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Pagination,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import TableRowSkeleton from "../leaderboard/TableRowSkeleton";
import ViewDialog from "../leaderboard/ViewDialog";
import TableItem from "./TableItem";

type Props = {
	id: string | undefined;
	Close: () => void;
};

function range(min: number, max: number) {
	var len = max - min + 1;
	var arr = new Array(len);
	for (var i = 0; i < len; i++) {
		arr[i] = min + i;
	}
	return arr;
}

export default function LeaderboardDialog({ id, Close }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const [TableData, setTableData] = React.useState<LeaderboardRow[] | null>(null);
	const [ViewTarget, setViewTarget] = React.useState<LeaderboardRow | null>(null);
	const [page, setPage] = React.useState(1);
	const [pageCount, setPageCount] = React.useState(1);

	useEffect(() => {
		if (id) {
			let uri = `/api/v1/competition/${id}/leaderboard?page=${page}`;
			setTableData(null);
			axios
				.get(uri)
				.then((res) => {
					setTableData(res.data.leaderboard);
					setPageCount(res.data.pageCount);
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
					enqueueSnackbar("Failed to get leaderboard. Please Report this.", {
						variant: "error",
					});
					console.error(error);
				});
		} else {
			setTableData(null);
		}
	}, [id, page]);

	const Reset = () => {
		Close();
	};

	const OpenViewDialog = (leaderboardRow: LeaderboardRow) => {
		setViewTarget(leaderboardRow);
	};

	const CloseViewDialog = () => {
		setViewTarget(null);
	};

	return (
		<>
			<ViewDialog Target={ViewTarget} Close={CloseViewDialog} />

			<Dialog fullWidth maxWidth="lg" open={id ? true : false} onClose={Reset}>
				<DialogTitle>View Competition Leaderboard</DialogTitle>
				<DialogContent>
					<TableContainer sx={{ marginTop: 2, marginBottom: 4 }} component={Paper}>
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
												index={index + (page - 1) * 10}
												row={row}
												OpenViewDialog={OpenViewDialog}
											/>
										))}
									</>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<Grid2 container justifyContent="center">
						<Pagination
							count={pageCount}
							color="primary"
							showFirstButton
							showLastButton
							page={page}
							onChange={(e, newPage) => {
								setPage(newPage);
							}}
						/>
					</Grid2>
				</DialogContent>
			</Dialog>
		</>
	);
}
