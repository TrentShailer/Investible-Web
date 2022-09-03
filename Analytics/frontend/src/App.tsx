import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useSnackbar } from "notistack";
import Home from "./pages/Home";

function App() {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	if (window.innerWidth < 600) {
		enqueueSnackbar("This site is not optimised for a mobile device.", { variant: "error" });
	}
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
