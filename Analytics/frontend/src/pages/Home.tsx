import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import MenuBar, { Page } from "../components/MenuBar";
import Game from "./analytics/Game";
import General from "./analytics/General";
import Leaderboard from "./Leaderboard";
import Competition from "./Competition";

export default function Home() {
	const [page, setPage] = useState<Page>();
	const [Body, setBody] = useState(<></>);
	const { enqueueSnackbar } = useSnackbar();

	const onFocus = () => {
		axios.get("/api/v1/authenticated").catch((error) => {
			if (axios.isAxiosError(error)) {
				if (error.status === "401" || error.response?.status === 401) {
					window.location.href = "/login";
					return;
				}
			}
			console.error(error);
			enqueueSnackbar("Failed to check authentication. Please report this.", {
				variant: "error",
			});
		});
	};

	useEffect(() => {
		let storedPage = window.localStorage.getItem("page");
		if (storedPage) {
			setPage(parseInt(storedPage));
		}

		window.addEventListener("focus", onFocus);

		return () => {
			window.removeEventListener("focus", onFocus);
		};
	}, []);

	useEffect(() => {
		if (page !== undefined) {
			window.localStorage.setItem("page", page.toString());
		}
		switch (page) {
			case Page.competition:
				setBody(<Competition />);
				break;
			case Page.leaderboard:
				setBody(<Leaderboard />);
				break;
			case Page.generalAnalytics:
				setBody(<General />);
				break;
			case Page.gameAnalytics:
				setBody(<Game />);
				break;
		}
	}, [page]);

	return (
		<>
			<MenuBar
				page={page ? page : Page.competition}
				onChange={(value: Page) => {
					setPage(value);
				}}
			/>
			{Body}
		</>
	);
}
