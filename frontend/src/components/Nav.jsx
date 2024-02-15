import Bell from "../assets/images/bell.png";
import Logo from "../assets/images/logo.png";
import Cart from "../assets/images/cart.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useUser, useUserUpdate } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import NavItem from "./NavItem";
import axios from "axios";

const Nav = ({ staff, disableSearch, transparent, setFilterShown, cartUpdated }) => {
	const user = useUser();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");

	const [cart, setCart] = useState([]);
	const [latestDate, setLatestDate] = useState([]);
	useEffect(() => {
		if (user) {
			(async () => {
				const response = await axios.get("http://localhost:5021/announcement/latest");
				setLatestDate(response.data);
			})();
		}
	}, []);

	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/user/cart/${user?.id}`).catch(e => e.response);
			setCart(response.data);
		})();
	}, [user, cartUpdated]);

	useEffect(() => {
		if (staff && !user) return navigate("/");
		if (user && user.role != "Staff" && user.id != 1 && staff) return navigate("/");
	}, [user]);

	const [searchParams] = useSearchParams();
	const category = searchParams.get("category");

	const handleSearch = (e) => {
		if (e.key == "Enter") {
			navigate(`/activities?search=${search}${category ? `&category=${category}` : ""}`);
			setSearch("");
			if (setFilterShown) setFilterShown(false);
		}
	}

	const [hovering, setHovering] = useState(false);

	const updateUser = useUserUpdate();
	const logout = () => {
		updateUser(null);
		if (staff) navigate("/login");
	}

	return <nav className={`${transparent ? "" : "bg-white"} fixed w-full top-0 z-10`}>
		<div className="max-w-[1600px] mx-auto px-4 py-6 flex items-center justify-between">
			{/* Search */}
			{!disableSearch && <div className="lg:block hidden">
				<input type="text" placeholder="Search activities" className="py-2 px-4 border outline-none rounded-lg border-gray-500 w-[300px]" onKeyDown={handleSearch} value={search} onChange={e => setSearch(e.target.value)} />
			</div>}
			{/* Logo */}
			<div className={`self-center cursor-pointer`} onClick={() => navigate("/")}>
				<img src={Logo} className="w-20 md:w-24 lg:w-28" />
			</div>
			{/* Navigators for PC */}
			<div className="flex-row items-center hidden lg:flex gap-4">
				{/* For if they haven't signed in */}
				{!user && <>
					{/* Login */}
					<Link to="/login" className="py-2 px-10 text-white font-bold rounded-[10px] bg-black" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}>
						Log In
					</Link>
					{/* Sign Up */}
					<Link to="/signup" className="py-2 px-9 text-white font-bold rounded-[10px]" style={{
						background: "linear-gradient(102deg, #EB4710 25.27%, #F8BA05 93.93%)",
						boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
					}}>
						Sign Up
					</Link>
				</>}
				{/* For if they have signed in */}
				{user && <>
					{/* Notification */}
					<div className="relative hover:bg-gray-100 rounded-lg p-1 cursor-pointer" onClick={() => navigate("/announcements")}>
						<img src={Bell} className="w-[32px] h-[32px]" />
						{/* This is if there are unread notifications */}
						{new Date(user.lastVisitedAnnouncements) < new Date(latestDate) && <div className="rounded-full bg-purple-500 w-2 h-2 absolute right-0 top-0" />}
					</div>
					{/* Cart */}
					<div className="relative hover:bg-gray-100 rounded-lg p-1 mr-2 cursor-pointer" onClick={() => navigate("/cart")}>
						<img src={Cart} className="w-[32px] h-[32px]" />
						{/* If there are items in the cart */}
						{cart.length > 0 && <div className="rounded-full bg-[#E6533F] w-5 h-5 absolute -right-2 -top-1 flex justify-center items-center">
							<p className="text-xs text-white font-semibold">{cart.length}</p>
						</div>}
					</div>
					<div className="flex items-center relative" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.10))"}}>
						<div className={`${staff ? "bg-[#BA93FF]" : "bg-[#D9D9D9]"} rounded-t-lg w-[225px] px-4 py-1 relative`} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
							<p className="font-bold text-sm">{user?.name}</p>
							<p className="text-sm">{user?.email}</p>
							{hovering && <div className={`w-full absolute ${staff ? "bg-[#BA93FF]" : "bg-[#E7E7E7]"} right-0 top-12 px-2 py-2 rounded-b-lg`} style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.10))"}}>
								<ul className="text-sm font-medium">
									<NavItem staff={staff} to="/edit-profile">Edit Profile</NavItem>
									{!staff && <NavItem staff={staff} to="/bookings">Booking History</NavItem>}
									{staff && <>
										<NavItem staff={staff} to="/new-announcement">Create Announcement</NavItem>
										<NavItem staff={staff} to="/manage-activities">Manage Activities</NavItem>
									    <NavItem staff={staff} to="/manage-discounts">Manage Discounts</NavItem>
										<NavItem staff={staff} to="/manage-users">Manage Users</NavItem>
										<NavItem staff={staff} to="/manage-chatbot-prompts">Manage Chatbot Prompts</NavItem>
									</>}
								</ul>
								<hr className="border-black my-2" />
								<ul className="text-sm font-medium">
									{(user.role == "Staff" || user.id == 1) && !staff && <NavItem staff={staff} to="/manage-activities">Switch to Staff</NavItem>}
									{staff && <NavItem staff={staff} to="/activities">Back to Customer</NavItem>}
									<NavItem staff={staff} onClick={() => logout()}>Log Out</NavItem>
								</ul>
							</div>}
						</div>
					</div>
				</>}
			</div>
			{/* Navigators for Mobile TODO Later */}
		</div>
	</nav>
}

export default Nav;