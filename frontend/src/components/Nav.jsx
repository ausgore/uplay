import Logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext";
import Profile from "../assets/images/profile.png";
import { useState } from "react";

const Nav = () => {
	const user = useUser();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const handleSearch = (e) => {
		if (e.key == "Enter") {
			navigate(`/activities?search=${search}`);
		}
	}
	
	return <nav className="bg-white fixed w-full top-0 z-10">
		<div className="max-w-[1600px] mx-auto px-4 py-6 flex items-center justify-between">
			{/* Search */}
			<div className="lg:block hidden">
				<input type="text" placeholder="Search activities" className="py-2 px-4 border outline-none rounded-lg border-gray-500 w-[300px]" onKeyDown={handleSearch} value={search} onChange={e => setSearch(e.target.value)} />
			</div>
			{/* Logo */}
			<div className="w-20 md:w-24 lg:w-28">
				<img src={Logo} className="w-full" />
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
					<Link to="/" className="py-2 px-9 text-white font-bold rounded-[10px]" style={{
						background: "linear-gradient(102deg, #EB4710 25.27%, #F8BA05 93.93%)",
						boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
					}}>
						Sign Up
					</Link>
				</>}
				{/* For if they ahve signed in */}
				{user && <>
					<div className="flex items-center relative">
						<div className="bg-[#D9D9D9] absolute right-[40px] z-[-2] h-[54px] w-[250px] rounded-l-full" style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.10))" }}>
							<div className="px-8 pt-2 text-sm">
								<p className="font-bold">FirstName LastName</p>
								<p>{user?.email}</p>
							</div>
						</div>
						<div className="w-[67px] relative">
							<img src={Profile} />
							<div className="bg-white rounded-full w-[50px] h-[50px] absolute bottom-2 right-2 z-[-1]"></div>
						</div>
					</div>
				</>}
			</div>
			{/* Navigators for Mobile TODO Later */}
		</div>
	</nav>
}

export default Nav;