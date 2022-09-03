import { Delete } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";
import React from "react";

type Props = {
	index: number;
	OpenDeleteDialog: Function;
	row: LeaderboardRow;
};

export default function TableItem({ index, row, OpenDeleteDialog }: Props) {
	return (
		<TableRow>
			<TableCell align="center">{index + 1}</TableCell>
			<TableCell align="center">{row.name}</TableCell>
			<TableCell align="center">${row.portfolio_value.toLocaleString("en-US")}</TableCell>
			<TableCell align="center">
				<IconButton
					onClick={() => {
						OpenDeleteDialog(row);
					}}>
					<Delete />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}
