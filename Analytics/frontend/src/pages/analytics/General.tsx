import { Container } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React from "react";
import Contact from "../../components/analytics/general/Contact";
import DeviceBreakdown from "../../components/analytics/general/DeviceBreakdown";
import Games from "../../components/analytics/general/Games";
import GameCount from "../../components/analytics/general/GameCount";
import TotalPlayers from "../../components/analytics/general/TotalPlayers";

export default function General() {
	return (
		<Container maxWidth={"xl"}>
			<GameCount />
			<Grid2 sx={{ marginTop: 4 }} container justifyContent={"space-between"}>
				<Games />
				<DeviceBreakdown />
				<TotalPlayers />
				<Contact />
			</Grid2>
		</Container>
	);
}
