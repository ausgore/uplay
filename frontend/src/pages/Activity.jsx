import { useState } from "react";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

// TODO: Export max-w-[1300px] mx-auto px-4 to its own "container" class
// Create separate button component

const Activity = () => {
	const user = useUser();
	const navigate = useNavigate();
	const ntucPrice = 49.9;
	const [ntucQuantity, setNTUCQuantity] = useState(0);
	const guestPrice = 54.9;
	const [guestQuantity, setGuestQuantity] = useState(0);

	const addToCart = async () => {
		if (ntucQuantity + guestQuantity == 0) return alert("You cannot add nothing to your cart.");
		if (!user) return alert("You must be logged in to be able to add to cart.");

		await axios.post("http://localhost:5021/user/add-to-cart", {
			userId: user.id,
			name: "Hot Yoga Studio LAVA @ Great World City",
			ntucQuantity: ntucQuantity,
			guestQuantity: guestQuantity
		});
		alert(`You have added Hot Yoga Studio to cart with NTUC: ${ntucQuantity}, Guest: ${guestQuantity}`);
		navigate("/cart");
	}

	return <>
		<Nav />
		<div className="max-w-[1300px] mx-auto px-4 pt-24">
			{/* Header */}
			<div className="mt-2 mb-3 flex flex-col lg:flex-row gap-2 lg:gap-12">
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
				{/* LEFT */}
				{/* Image description */}
				<div>
					{/* Image */}
					<div className="aspect-[16/9] max-w-[719px]">
						<img src="/yoga.png" alt="activity_image" className="object-cover w-full h-full rounded-lg" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.60)" }} />
					</div>
				</div>
				{/* RIGHT */}
				{/* Cart */}
				<div className="mt-8 xl:mt-0 p-7 rounded-lg h-fit w-fit" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
					<h2 className="font-semibold text-lg mb-4">Select Option</h2>
					{/* Options */}
					<div className="flex flex-col gap-6">
						{/* NTUC Member Bar */}
						<div className="flex flex-row px-4 py-2 justify-between bg-[#FF8541] rounded-lg gap-20 items-center" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
							<p className="font-bold">NTUC Member</p>
							<div className="flex flex-row items-center">
								{/* Price, do not multiply */}
								<p className="font-medium mr-4">S${ntucPrice.toFixed(2)}</p>
								<button onClick={() => setNTUCQuantity(q => q == 0 ? 0 : q - 1)}>-</button>
								<span className="px-2 font-medium">{ntucQuantity}</span>
								<button onClick={() => setNTUCQuantity(q => q + 1)}>+</button>
							</div>
						</div>
						{/* Guest Bar */}
						<div className="flex flex-row px-4 py-2 justify-between rounded-lg gap-20 items-center" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
							<p className="font-bold">Guest</p>
							<div className="flex flex-row items-center">
								{/* Price, do not multiply */}
								<p className="font-medium mr-4">S${guestPrice.toFixed(2)}</p>
								<button onClick={() => setGuestQuantity(q => q == 0 ? 0 : q - 1)}>-</button>
								<span className="px-2 font-medium">{guestQuantity}</span>
								<button onClick={() => setGuestQuantity(q => q + 1)}>+</button>
							</div>
						</div>
					</div>
					{/* Total */}
					<p className="text-sm mt-6">Total</p>
					<div className="flex flex-row justify-between">
						<p className="text-3xl font-semibold">S$ {((ntucQuantity * ntucPrice) + (guestQuantity * guestPrice)).toFixed(2)}</p>
						<button onClick={addToCart} className="py-2 px-4 text-white font-bold text-lg" style={{
							borderRadius: "10px",
							background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
							boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
						}}>
							Add To Cart
						</button>
					</div>
				</div>
			</div>
			<section className="mt-8 lg:mt-16 max-w-[716px]">
				{/* Highlights */}
				<div className="flex flex-row items-center">
					<h1 className="font-bold text-lg mb-2">Highlights</h1>
					<div className="flex-grow bg-[#EB4710] h-[2px] mx-4"></div>
				</div>
				<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

				<div className="flex flex-row items-center mt-12">
					<h1 className="font-bold text-lg mb-2">What's Included</h1>
					<div className="flex-grow bg-[#EB4710] h-[2px] mx-4"></div>
				</div>
				<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

				<div className="flex flex-row items-center mt-12">
					<h1 className="w-fit font-bold text-lg mb-2">Terms and Conditions</h1>
					<div className="flex-grow bg-[#EB4710] h-[2px] mx-4"></div>
				</div>
				<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
			</section>
		</div>
	</>;
}

export default Activity;