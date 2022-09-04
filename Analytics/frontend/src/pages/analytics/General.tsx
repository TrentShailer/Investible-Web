import { Container } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React from "react";
import Players from "../../components/analytics/general/Players";

export default function General() {
	return (
		<Container>
			<Grid2 sx={{ marginTop: 4 }} container justifyContent={"center"}>
				<Players />
			</Grid2>
			<Grid2 sx={{ marginTop: 4 }} container justifyContent={"space-around"}></Grid2>
		</Container>
	);
}
