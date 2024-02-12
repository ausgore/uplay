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
import Activities from "./pages/Activities";
import UpdateActivity from "./pages/UpdateActivity";
import ManageActivities from "./pages/ManageActivities";
import EditProfile from "./pages/EditProfile";
import ManageUsers from "./pages/ManageUsers";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking";
import CreateChatbotPrompt from "./pages/Chatbot/CreateChatbotPrompt";
import ManageChatbotPrompts from "./pages/Chatbot/ManageChatbotPrompts";
import UpdateChatbotPrompt from "./pages/Chatbot/UpdatePrompt";
import Checkout from "./pages/Checkout";
import Announcements from "./pages/Announcements";
import NewAnnouncement from "./pages/NewAnnouncement";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/edit-profile" element={<EditProfile />} />
					<Route path="/new-announcement" element={<NewAnnouncement />} />

					<Route path="/" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />

					<Route path="/announcements" element={<Announcements />} />

					<Route path="/bookings" element={<Bookings />} />
					<Route path="/bookings/:id" element={<Booking />} />
					<Route path="/checkout" element={<Checkout />} />

					<Route path="/activities" element={<Activities />} />
					<Route path="/activities/:id" element={<Activity />} />
					<Route path="/cart" element={<Cart />} />

					<Route path="/create-activity" element={<CreateActivity />} />
					<Route path="/manage-activities" element={<ManageActivities />} />
					<Route path="/manage-users" element={<ManageUsers />} />
					<Route path="/update-activity/:id" element={<UpdateActivity />} />

					<Route path="/create-chatbot-prompt" element={<CreateChatbotPrompt />} />
					<Route path="/manage-chatbot-prompts" element={<ManageChatbotPrompts />} />
					<Route path="/update-chatbot-prompt/:id" element={<UpdateChatbotPrompt />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	</React.StrictMode>
);
