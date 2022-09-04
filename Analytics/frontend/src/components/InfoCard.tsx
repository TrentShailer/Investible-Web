import { Paper } from "@mui/material";
import React from "react";

type Props = {
	children?: any;
};

export default function InfoCard({ children }: Props) {
	return (
		<Paper elevation={2} sx={{ padding: 2, width: 300, height: 250 }}>
			{children}
		</Paper>
	);
}
