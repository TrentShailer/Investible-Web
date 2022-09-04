import { Container } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React from "react";
import Contact from "../../components/analytics/general/Contact";
import EndReason from "../../components/analytics/general/EndReason";
import Games from "../../components/analytics/general/Games";
import Players from "../../components/analytics/general/Players";

export default function General() {
	return (
		<Container>
			<Players />
			<Grid2 sx={{ marginTop: 4 }} container justifyContent={"space-between"}>
				<Games />
				<EndReason />
				<Contact />
			</Grid2>
		</Container>
	);
}
