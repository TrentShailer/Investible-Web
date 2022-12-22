import { Button, ButtonGroup, Container, Input, Paper, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";

export default function Manual_Entry() {
	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobile, setMobile] = useState("");
	const [portfolioValue, setPortfolioValue] = useState(0);
	const { enqueueSnackbar } = useSnackbar();
	const clear = () => {
		setDisplayName("");
		setEmail("");
		setFirstName("");
		setLastName("");
		setMobile("");
		setPortfolioValue(0);
	};

	const submit = () => {
		if (!displayName || !email || !firstName || !lastName || !mobile || !portfolioValue) {
			enqueueSnackbar("All fields are required.", {
				variant: "error",
			});
			return;
		}

		axios
			.post("/api/v1/manual_entry", {
				displayName,
				email,
				firstName,
				lastName,
				mobile,
				portfolioValue,
			})
			.then((response) => {
				if (response.data.userExists) {
					enqueueSnackbar(
						"Player already exists, using that player instead of entered values.",
						{
							variant: "info",
						}
					);
					return;
				} else {
					enqueueSnackbar("Successfully submitted.", {
						variant: "success",
					});
					clear();
				}
			})
			.catch((error) => {
				enqueueSnackbar("Failed to submit. Please report this.", {
					variant: "error",
				});
				console.error(error);
			});
	};

	return (
		<Container sx={{ paddingTop: 4 }}>
			<Paper sx={{ padding: 5 }}>
				<Grid2 container justifyContent={"center"} spacing={2}>
					<Grid2 xs={6}>
						<TextField
							value={displayName}
							onChange={(e) => {
								setDisplayName(e.target.value);
							}}
							fullWidth
							label="Display Name"
							variant="outlined"
						/>
					</Grid2>
					<Grid2 xs={6}>
						<TextField
							value={portfolioValue}
							onChange={(e) => {
								let number = Number(e.target.value);
								setPortfolioValue(number);
							}}
							type="number"
							fullWidth
							label="Portfolio Value"
							variant="outlined"
						/>
					</Grid2>
					<Grid2 xs={6}>
						<TextField
							value={firstName}
							onChange={(e) => {
								setFirstName(e.target.value);
							}}
							fullWidth
							label="First Name"
							variant="outlined"
						/>
					</Grid2>
					<Grid2 xs={6}>
						<TextField
							value={lastName}
							onChange={(e) => {
								setLastName(e.target.value);
							}}
							fullWidth
							label="Last Name"
							variant="outlined"
						/>
					</Grid2>
					<Grid2 xs={6}>
						<TextField
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							fullWidth
							label="Email"
							variant="outlined"
						/>
					</Grid2>
					<Grid2 xs={6}>
						<TextField
							value={mobile}
							onChange={(e) => {
								setMobile(e.target.value);
							}}
							fullWidth
							label="Mobile"
							variant="outlined"
						/>
					</Grid2>
					<ButtonGroup variant="contained" sx={{ marginTop: 2 }}>
						<Button onClick={clear}>Clear</Button>
						<Button onClick={submit}>Submit</Button>
					</ButtonGroup>
				</Grid2>
			</Paper>
		</Container>
	);
}
