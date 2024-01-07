import React from "react"
import ReactDOM from "react-dom/client";
import "./main.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ResetPassword from "./pages/ResetPassword";
import Activity from "./pages/Activity";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					<Route path="/activities" element={<Activity />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	</React.StrictMode>
);
