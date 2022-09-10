import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { useEffect } from "react";

type Props = {
	titles: (string | null)[];
	values: (string | null)[];
};

export default function InfoGrid({ titles, values }: Props) {
	return (
		<>
			<Grid2 container justifyContent="space-between">
				<Grid2 xs={6}>
					<Typography noWrap variant="body1" color={grey[500]}>
						{titles[0]}
					</Typography>
				</Grid2>
				<Grid2 xs={6}>
					<Typography noWrap variant="body1" color={grey[500]}>
						{titles[1]}
					</Typography>
				</Grid2>
			</Grid2>
			<Grid2 container justifyContent={"space-between"}>
				<Grid2 xs={6}>
					<Typography noWrap variant="h5" gutterBottom>
						{values[0] === null ? "N/A" : values[0]}
					</Typography>
				</Grid2>
				<Grid2 xs={6}>
					<Typography noWrap variant="h5" gutterBottom>
						{values[1] === null ? "N/A" : values[1]}
					</Typography>
				</Grid2>
			</Grid2>
		</>
	);
}
