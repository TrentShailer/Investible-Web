import { LoginOutlined } from "@mui/icons-material";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import React, { useState } from "react";
import { useSnackbar } from "notistack";

export default function Login() {
	const [password, setPassword] = useState("");
	const [helperText, setHelperText] = useState("");
	const { enqueueSnackbar } = useSnackbar();

	const Submit = () => {
		setHelperText("");
		axios
			.post("/api/v1/login", { password: password })
			.then(() => {
				window.location.href = "/";
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					if (error.status === "401") {
						setHelperText("Password is incorrect");
						return;
					}
				}
				console.error(error);
				enqueueSnackbar("Failed to login. Please report this.", { variant: "error" });
			});
	};

	return (
		<Grid2 container direction="column" mt={8} gap={4}>
			<Grid2 container justifyContent="center">
				<img src="IPPFA.png" alt="IPPFA Logo" />
			</Grid2>
			<Grid2 container justifyContent="center">
				<Card sx={{ minWidth: 400 }} variant="outlined">
					<CardContent>
						<Typography variant="h6">Investible Admin Panel</Typography>
						<TextField
							margin="normal"
							fullWidth
							label="Username"
							defaultValue={"admin"}
							disabled
						/>
						<TextField
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									Submit();
								}
							}}
							error={helperText ? true : false}
							helperText={helperText}
							margin="normal"
							autoFocus
							fullWidth
							label="Password"
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
						<Button
							onClick={Submit}
							sx={{ marginTop: 2 }}
							fullWidth
							variant="contained"
							size="large"
							startIcon={<LoginOutlined />}>
							Login
						</Button>
					</CardContent>
				</Card>
			</Grid2>
		</Grid2>
	);
}
