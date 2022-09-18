import { AddCircleOutline } from "@mui/icons-material";
import { Accordion, Button, Container } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import CompetitionDisplay from "../components/competition/CompetitionDisplay";
import CreateDialog from "../components/competition/CreateDialog";
import DeleteDialog from "../components/competition/DeleteDialog";
import EditDialog from "../components/competition/EditDialog";
import LeaderboardDialog from "../components/competition/LeaderboardDialog";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export default function Competition() {
	const { enqueueSnackbar } = useSnackbar();
	const [competitions, setCompetitions] = React.useState<Competition[] | undefined>();

	const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
	const [deleteDialogId, setDeleteDialogId] = React.useState<string | undefined>();
	const [leaderboardDialogId, setLeaderboardDialogId] = React.useState<string | undefined>();
	const [editDialogTarget, setEditDialogTarget] = React.useState<Competition | undefined>();

	const [expanded, setExpanded] = React.useState<string | false>(false);

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false);
	};

	useEffect(() => {
		FetchCompetitions();
	}, []);

	const FetchCompetitions = () => {
		axios
			.get("/api/v1/competition")
			.then((res) => {
				dayjs.extend(utc);
				dayjs.extend(timezone);
				let tz = dayjs.tz.guess();

				let competitions = (res.data as Competition[]).map((competition) => {
					let start_date = dayjs
						.utc(competition.start_date)
						.tz(tz)
						.format("YYYY/MM/DD hh:mm A");
					let end_date = dayjs
						.utc(competition.end_date)
						.tz(tz)
						.format("YYYY/MM/DD hh:mm A");
					return {
						id: competition.id,
						title: competition.title,
						details: competition.details,
						start_date: start_date,
						end_date: end_date,
					};
				});

				setCompetitions(competitions);
			})
			.catch((err) => {
				if (axios.isAxiosError(err)) {
					if (err.response?.status === 401) {
						enqueueSnackbar("You are not logged in", { variant: "error" });
						return;
					}
				}
				enqueueSnackbar("Failed to get competition data. Please report this.", {
					variant: "error",
				});
				console.error(err);
			});
	};

	const OpenLeaderboard = (id: string) => {
		setLeaderboardDialogId(id);
	};
	const CloseLeaderboard = () => {
		setLeaderboardDialogId(undefined);
	};

	const OpenDeleteCompetition = (id: string) => {
		setDeleteDialogId(id);
	};
	const CloseDeleteCompetition = (refresh: boolean) => {
		if (refresh) {
			FetchCompetitions();
		}
		setDeleteDialogId(undefined);
	};

	const OpenCreateCompetition = () => {
		setCreateDialogOpen(true);
	};
	const CloseCreateCompetition = (refresh: boolean) => {
		if (refresh) {
			FetchCompetitions();
		}
		setCreateDialogOpen(false);
	};

	const OpenEditCompetition = (competition: Competition) => {
		setEditDialogTarget(competition);
	};

	const CloseEditCompetition = (refresh: boolean) => {
		if (refresh) {
			FetchCompetitions();
		}
		setEditDialogTarget(undefined);
	};

	return (
		<>
			<CreateDialog open={createDialogOpen} Close={CloseCreateCompetition} />
			<DeleteDialog id={deleteDialogId} Close={CloseDeleteCompetition} />
			<LeaderboardDialog id={leaderboardDialogId} Close={CloseLeaderboard} />
			<EditDialog competition={editDialogTarget} Close={CloseEditCompetition} />
			<Container sx={{ paddingTop: 4 }}>
				<Button
					sx={{ marginBottom: 2 }}
					onClick={OpenCreateCompetition}
					startIcon={<AddCircleOutline />}>
					Create New Competition
				</Button>
				{competitions?.map((competition) => (
					<CompetitionDisplay
						expanded={expanded}
						competition={competition}
						handleChange={handleChange}
						openLeaderboard={OpenLeaderboard}
						openEditCompetition={OpenEditCompetition}
						openDeleteCompetition={OpenDeleteCompetition}
					/>
				))}
			</Container>
		</>
	);
}
