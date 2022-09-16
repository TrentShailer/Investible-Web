import {
	Container,
	FormControl,
	FormControlLabel,
	FormLabel,
	Paper,
	Radio,
	RadioGroup,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TableItem from "../components/leaderboard/TableItem";
import TableRowSkeleton from "../components/leaderboard/TableRowSkeleton";
import { useSnackbar } from "notistack";
import DeleteDialog from "../components/leaderboard/DeleteDialog";
import ViewDialog from "../components/leaderboard/ViewDialog";
import Grid2 from "@mui/material/Unstable_Grid2";

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
	const [view, setView] = useState<"everything" | "competition">("everything");

	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		FetchTableData();
	}, [view]);

	useEffect(() => {
		FetchTableData();
	}, []);

	const FetchTableData = () => {
		SetTableData(null);
		axios
			.get("/api/v1/leaderboard" + (view === "competition" ? "?competition=true" : ""))
			.then((response) => {
				SetTableData(response.data);
			})
			.catch((error) => {
				SetTableData([]);
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
				<Grid2 container justifyContent="center">
					<Paper sx={{ padding: 2, marginTop: 2, width: 200 }}>
						<FormControl>
							<FormLabel>View</FormLabel>
							<RadioGroup
								onChange={(v) => {
									setView(v.target.value as "everything" | "competition");
								}}
								value={view}
								defaultValue="everything">
								<FormControlLabel
									value="everything"
									control={<Radio />}
									label="Everything"
								/>
								<FormControlLabel
									value="competition"
									control={<Radio />}
									label="Current Competition"
								/>
							</RadioGroup>
						</FormControl>
					</Paper>
				</Grid2>
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
