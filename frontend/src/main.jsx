import React from "react"
import ReactDOM from "react-dom/client";
import "./main.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ResetPassword from "./pages/ResetPassword";
import Activity from "./pages/Activity";
import Cart from "./pages/Cart";
import CreateActivity from "./pages/CreateActivity";
import Activities from "./pages/Activites";
import UpdateActivity from "./pages/UpdateActivity";
import ManageActivities from "./pages/ManageActivities";
import EditProfile from "./pages/EditProfile";
import ManageUsers from "./pages/ManageUsers";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/edit-profile" element={<EditProfile />} />
					<Route path="/" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />

					<Route path="/bookings" element={<Bookings />} />
					<Route path="/bookings/:id" element={<Booking />} />

					<Route path="/activities" element={<Activities />} />
					<Route path="/activities/:id" element={<Activity />} />
					<Route path="/cart" element={<Cart />} />

					<Route path="/create-activity" element={<CreateActivity />} />
					<Route path="/manage-activities" element={<ManageActivities />} />
					<Route path="/manage-users" element={<ManageUsers />} />
					<Route path="/update-activity/:id" element={<UpdateActivity />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	</React.StrictMode>
);
