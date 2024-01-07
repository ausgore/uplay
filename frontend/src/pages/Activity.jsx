import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import { useUser } from "../contexts/UserContext";

// TODO: Export max-w-[1600px] mx-auto px-4 to its own "container" class
// Create separate button component

const Activity = () => {
	const user = useUser();

	return <>
		<nav className="bg-white fixed w-full top-0 z-10">
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
		<div className="max-w-[1600px] mx-auto px-4 pt-20">
			<div className="mt-4 mb-3 flex flex-col lg:flex-row gap-2 lg:gap-12">
				{/* Title */}
				<h1 className="text-lg md:text-2xl font-bold">Hot Yoga Studio LAVA @ Great World City</h1>
				{/* Tags */}
				<div className="flex flex-row max-w-full gap-3">
					<div className="text-white font-bold items-center flex px-4 py-2 lg:py-1 text-xs lg:text-base" style={{
						borderRadius: "10px",
						background: "linear-gradient(293deg, #BA93FF -23.61%, #933EFF 80.31%)",
						boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
					}}>
						BESTSELLER
					</div>
				</div>
			</div>
			{/* Address */}
			<p className="font-medium">1 Kim Seng Promenade #02-102/103 Great World City, Singapore 237994</p>
			{/* Image, Description and Cart */}
			<div className="flex flex-col xl:flex-row justify-between mt-6">
				{/* Image description */}
				<div>
					{/* Image */}
					<div className="aspect-[16/9] max-w-[719px]">
						<img src="/yoga.png" alt="activity_image" className="object-cover w-full h-full rounded-lg" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.60)" }} />
					</div>
				</div>
				{/* Cart */}
				<div className="mt-8 xl:mt-0 p-7 rounded-lg" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
					<p>hi</p>
				</div>
			</div>
		</div>
	</>;
}

export default Activity;