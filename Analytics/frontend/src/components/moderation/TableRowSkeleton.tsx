import { Skeleton, TableCell, TableRow } from "@mui/material";
import React from "react";

export default function TableRowSkeleton() {
	return (
		<TableRow>
			<TableCell sx={{ margin: 0 }}>
				<Skeleton variant="rounded" />
			</TableCell>
			<TableCell>
				<Skeleton variant="rounded" />
			</TableCell>
			<TableCell>
				<Skeleton variant="rounded" />
			</TableCell>
			<TableCell>
				<Skeleton variant="rounded" />
			</TableCell>
		</TableRow>
	);
}
