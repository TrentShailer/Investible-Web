import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Box,
	styled,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { MobileDateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

type Props = {
	open: boolean;
	Close: (refresh: boolean) => void;
};

const TitleTextField = styled(TextField)({
	"& .MuiInputBase-input": {
		fontSize: 59,
		lineHeight: 1.1,
		fontWeight: 900,
		"text-align": "center",
	},
});
const DetailTextField = styled(TextField)({
	"& .MuiInputBase-input": {
		fontSize: 28,
		lineHeight: 1.25,
		"text-align": "center",
	},
});

const DateTextField = styled(TextField)({
	"& .MuiInputBase-input": {
		cursor: "pointer",
	},
});

export default function CreateDialog({ open, Close }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const [title, setTitle] = useState<string>("");
	const [details, setDetails] = useState<string>("");
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const [TZ, setTZ] = useState<string>(dayjs.tz.guess());

	const Reset = (refresh: boolean) => {
		setStartDate(null);
		setEndDate(null);
		setTitle("");
		setDetails("");
		Close(refresh);
	};

	const Confirm = () => {
		if (startDate === null || endDate === null || title === "" || details === "") {
			enqueueSnackbar("Please fill in all fields", { variant: "warning" });
			return;
		}
		axios
			.post("/api/v1/competition/create", {
				title,
				details,
				start_date: startDate,
				end_date: endDate,
			})
			.then((res) => {
				enqueueSnackbar("Competition created successfully", { variant: "success" });
			})
			.catch((err) => {
				if (axios.isAxiosError(err)) {
					if (err.status === "401" || err.response?.status === 401) {
						enqueueSnackbar("You are not logged in", { variant: "error" });
						return;
					}
				}
				enqueueSnackbar("Failed to create competition", { variant: "error" });
				console.error(err);
			})
			.finally(() => {
				Reset(true);
			});
	};

	return (
		<Dialog
			maxWidth="sm"
			fullWidth
			open={open}
			onClose={() => {
				Reset(false);
			}}>
			<DialogTitle>Create Competition</DialogTitle>
			<DialogContent>
				<TitleTextField
					margin="normal"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
					label="Title"
					multiline
					fullWidth
					maxRows={2}
					helperText={`Maximum 2 lines | ${title.length}/38 characters`}
				/>
				<DetailTextField
					margin="normal"
					value={details}
					onChange={(e) => {
						setDetails(e.target.value);
					}}
					label="Details"
					fullWidth
					multiline
					maxRows={8}
					helperText={`Maximum 8 lines | ${details.length}/320 characters`}
				/>
				<Box sx={{ marginTop: 1 }}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Grid2 container justifyContent={"space-between"}>
							<MobileDateTimePicker
								value={startDate}
								label="Start Date"
								inputFormat="YYYY/MM/DD hh:mm a"
								onChange={(newDate) => {
									setStartDate(newDate);
								}}
								renderInput={(params) => (
									<DateTextField helperText={`In ${TZ} time`} {...params} />
								)}
							/>
							<MobileDateTimePicker
								value={endDate}
								label="End Date"
								inputFormat="YYYY/MM/DD hh:mm a"
								onChange={(newDate) => {
									setEndDate(newDate);
								}}
								renderInput={(params) => (
									<DateTextField helperText={`In ${TZ} time`} {...params} />
								)}
							/>
						</Grid2>
					</LocalizationProvider>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						Reset(false);
					}}>
					Cancel
				</Button>
				<Button autoFocus color="success" onClick={Confirm}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
}
