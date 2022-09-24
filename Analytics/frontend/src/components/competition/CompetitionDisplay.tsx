import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Edit, Visibility } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

type Props = {
	expanded: string | false;
	competition: Competition;
	handleChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
	openLeaderboard: (id: string) => void;
	openDeleteCompetition: (id: string) => void;
	openEditCompetition: (competition: Competition) => void;
};

export default function CompetitionDisplay({
	expanded,
	competition,
	handleChange,
	openLeaderboard,
	openDeleteCompetition,
	openEditCompetition,
}: Props) {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	const [TZ, setTZ] = React.useState<string>(dayjs.tz.guess());

	const exportLeaderboard = (id: string) => {
		window.open(`/api/v1/competition/${id}/export`, "_blank");
	};

	return (
		<Accordion expanded={expanded === competition.id} onChange={handleChange(competition.id)}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1bh-header">
				<Typography sx={{ width: "33%", flexShrink: 0 }}>Competition</Typography>
				<Typography sx={{ color: "text.secondary" }}>
					{`${competition.start_date} — ${competition.end_date} (${TZ})`}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Grid2 container justifyContent={"space-between"}>
					<Grid2 xs={8}>
						<Typography variant="h6">Title</Typography>
						<Typography gutterBottom>{competition.title}</Typography>
						<Typography variant="h6">Details</Typography>
						<Typography>{competition.details}</Typography>
					</Grid2>
					<Grid2 xs={3}>
						<Typography variant="h6" textAlign={"center"}>
							Actions
						</Typography>
						<Grid2 sx={{ marginTop: 2 }} container justifyContent={"center"}>
							<Button
								onClick={() => {
									openLeaderboard(competition.id);
								}}
								startIcon={<Visibility />}>
								View Leaderboard
							</Button>
						</Grid2>
						<Grid2 sx={{ marginTop: 2 }} container justifyContent={"center"}>
							<Button
								onClick={() => {
									exportLeaderboard(competition.id);
								}}
								startIcon={<FileDownloadIcon />}>
								Export Leaderboard
							</Button>
						</Grid2>
						<Grid2 sx={{ marginTop: 2 }} container justifyContent={"center"}>
							<Button
								onClick={() => {
									openEditCompetition(competition);
								}}
								startIcon={<Edit />}>
								Edit Competition
							</Button>
						</Grid2>
						<Grid2 sx={{ marginTop: 2 }} container justifyContent={"center"}>
							<Button
								onClick={() => {
									openDeleteCompetition(competition.id);
								}}
								startIcon={<DeleteIcon />}
								color="error">
								Delete Competition
							</Button>
						</Grid2>
					</Grid2>
				</Grid2>
			</AccordionDetails>
		</Accordion>
	);
}
