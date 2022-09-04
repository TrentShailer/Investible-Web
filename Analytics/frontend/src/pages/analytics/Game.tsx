import { Container, Divider, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React from "react";
import BlockDistribution from "../../components/analytics/game/BlockDistribution";
import GameTime from "../../components/analytics/game/GameTime";
import PortfolioValue from "../../components/analytics/game/PortfolioValue";
import Turns from "../../components/analytics/game/Turns";

export default function Game() {
	return (
		<Container maxWidth={"xl"}>
			<Grid2 sx={{ marginTop: 4 }} container justifyContent={"space-between"}>
				<GameTime />
				<Turns />
				<BlockDistribution />
				<PortfolioValue />
			</Grid2>
		</Container>
	);
}
