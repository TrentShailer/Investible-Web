import { Container, Divider, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import React from "react";
import BlockDistributionComparison from "../../components/analytics/game/BlockDistributionComparison";
import EndReasonDistribution from "../../components/analytics/game/EndReasonDistribution";
import EventDistribution from "../../components/analytics/game/EventDistribution";
import GameLengthHistogram from "../../components/analytics/game/GameLengthHistogram";
import PortfolioValueComparison from "../../components/analytics/game/PortfolioValueComparison";
import PortfolioValueHistogram from "../../components/analytics/game/PortfolioValueHistogram";
import TurnsComparison from "../../components/analytics/game/TurnsComparison";
import TurnsHistogram from "../../components/analytics/game/TurnsHistogram";

export default function Game() {
	return (
		<Container maxWidth={"xl"}>
			<Grid2 sx={{ marginTop: 2 }} container justifyContent={"space-between"}>
				<GameLengthHistogram />
				<TurnsHistogram />
			</Grid2>
			<Grid2 sx={{ marginTop: 2 }} container justifyContent={"space-between"}>
				<EndReasonDistribution />
				<PortfolioValueHistogram />
				<EventDistribution />
			</Grid2>
			<Grid2 sx={{ marginTop: 2 }} container justifyContent={"space-between"}>
				<BlockDistributionComparison />
				<TurnsComparison />
				<PortfolioValueComparison />
			</Grid2>
		</Container>
	);
}
