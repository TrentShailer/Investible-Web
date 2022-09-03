import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import MenuBar from "../components/MenuBar";
import Game from "./analytics/Game";
import General from "./analytics/General";
import Moderation from "./Moderation";

export default function Home() {
	const [page, setPage] = useState(0);
	const [Body, setBody] = useState(<></>);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const onFocus = () => {
		axios
			.get("/api/v1/authenticated")
			.then((response) => {
				if (response.status !== 200) {
					throw new Error("Unexpected response: " + response.status);
				}
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					if (error.status === "401") {
						window.location.href = "/login";
					} else {
						enqueueSnackbar("Failed to get authentication status: " + error.message, {
							variant: "error",
						});
					}
				} else {
					enqueueSnackbar(error, { variant: "error" });
				}
			});
	};

	useEffect(() => {
		window.addEventListener("focus", onFocus);

		return () => {
			window.removeEventListener("focus", onFocus);
		};
	}, []);

	useEffect(() => {
		switch (page) {
			case 0:
				setBody(<Moderation />);
				break;
			case 1:
				setBody(<General />);
				break;
			case 2:
				setBody(<Game />);
				break;
		}
	}, [page]);

	return (
		<>
			<MenuBar
				page={page}
				onChange={(value: number) => {
					setPage(value);
				}}
			/>
			{Body}
		</>
	);
}
