import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Box,
	styled,
	TextField,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

type Props = {
	competition: Competition | undefined;
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

export default function EditDialog({ competition, Close }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const [title, setTitle] = useState<string>("");
	const [details, setDetails] = useState<string>("");
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);

	dayjs.extend(utc);
	dayjs.extend(timezone);

	const [TZ, setTZ] = useState<string>(dayjs.tz.guess());

	useEffect(() => {
		if (competition) {
			setTitle(competition.title);
			setDetails(competition.details);
			setStartDate(competition.start_date);
			setEndDate(competition.end_date);
		} else {
			setStartDate(null);
			setEndDate(null);
			setTitle("");
			setDetails("");
		}
	}, [competition]);

	const Reset = (refresh: boolean) => {
		setTitle("");
		setStartDate(null);
		setEndDate(null);
		setDetails("");
		Close(refresh);
	};

	const Confirm = () => {
		if (competition) {
			if (startDate === null || endDate === null || title === "" || details === "") {
				enqueueSnackbar("Please fill in all fields", { variant: "warning" });
				return;
			}
			axios
				.put(`/api/v1/competition/${competition.id}`, {
					title,
					details,
					start_date: startDate,
					end_date: endDate,
				})
				.then(() => {
					enqueueSnackbar("Competition updated", { variant: "success" });
				})
				.catch((error) => {
					if (axios.isAxiosError(error)) {
						if (error.status === "401" || error.response?.status === 401) {
							enqueueSnackbar("You are not logged in", { variant: "error" });
							return;
						}
					}
					enqueueSnackbar("Failed to update competition", { variant: "error" });
					console.error(error);
				})
				.finally(() => {
					Reset(true);
				});
		}
	};
	return (
		<Dialog
			open={competition ? true : false}
			onClose={() => {
				Close(false);
			}}>
			<DialogTitle>Edit Competition</DialogTitle>
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
					helperText={`Maximum 2 lines | ${title.length ?? 0}/38 characters`}
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
					helperText={`Maximum 8 lines | ${details.length ?? 0}/320 characters`}
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
						Close(false);
					}}
					autoFocus>
					Cancel
				</Button>
				<Button color="success" onClick={Confirm}>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}
