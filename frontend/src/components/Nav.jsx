import Logo from "../assets/images/logo.png";
import { Link } from "react-router-dom"
import { useUser } from "../contexts/UserContext";

const Nav = () => {
	const user = useUser();
	
	return <nav className="bg-white fixed w-full top-0 z-10">
		<div className="max-w-[1600px] mx-auto px-4 py-6 flex items-center justify-between">
			{/* Logo */}
			<img src={Logo} className="w-20 md:w-24 lg:w-28" />
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
			</div>
			{/* Navigators for Mobile TODO Later */}
		</div>
	</nav>
}

export default Nav;