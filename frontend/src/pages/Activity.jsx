import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import Star from "../assets/images/star.png";
import BlankStar from "../assets/images/blankstar.png";
import Review from "../components/Review";

// TODO: Export max-w-[1300px] mx-auto px-4 to its own "container" class
// Create separate button component

const Activity = () => {
	const user = useUser();
	const navigate = useNavigate();
	const { id } = useParams();
	const [activity, setActivity] = useState();

	const [url, setURL] = useState("");
	const [date, setDate] = useState("");
	const [dateError, setDateError] = useState("");
	const [timeslot, setTimeslot] = useState("");
	const [timeslotError, setTimeslotError] = useState("");
	const handleTimeslot = (ts) => setTimeslot(ts);
	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/activity?id=${id}`).catch(e => e.response);
			if (response.status != 200 || !response.data[0]) {
				alert(`(DEBUG) No activity with ID ${id}. Returning to sign in page.`);
				navigate("/");
			}
			setActivity(response.data[0]);

			const fileRes = await axios.get(`http://localhost:5021/activity/file/${response.data[0].id}`, { responseType: "arraybuffer" });
			const blob = new Blob([fileRes.data], { type: "image/png" });
			const objectURL = URL.createObjectURL(blob);
			setURL(objectURL);
		})();
	}, [id]);

	const [childQuantity, setChildQuantity] = useState(0);
	const [adultQuantity, setAdultQuantity] = useState(0);

	const addToCart = async () => {
		let hasError = false;
		if (!date) {
			hasError = true;
			setDateError("You must select a date to book.");
		}
		if (activity.timeslots.length > 0 && !timeslot) {
			hasError = true;
			setTimeslotError("You must choose a timeslot to book.");
		}

		if (hasError) return;

		setDateError("");
		setTimeslotError("");

		if (childQuantity + adultQuantity == 0) return alert("You cannot add nothing to your cart.");
		if (!user) return alert("You must be logged in to be able to add to cart.");

		const response = await axios.post("http://localhost:5021/user/add-to-cart", {
			userId: user.id,
			childQuantity,
			adultQuantity,
			activityId: activity.id,
			timeslot,
			bookedDate: date
		}).catch(e => e.response);

		if (response.status != 200) return alert("An error occurred trying to add this to cart");

		alert(`Successfully added to cart!`);
		navigate("/cart");
	}

	return <>
		<Nav />
		<div className="max-w-[1300px] mx-auto px-4 pt-32">
			<div className="flex mb-4">
				<Link to="/activities" className="font-medium hover:text-red-600">Home</Link>
				<p className="mx-3"> / </p>
				<Link to={`/activities?category=${activity?.category}`} className="font-medium hover:text-red-600">{activity?.category}</Link>
			</div>
			{/* Header */}
			<div className="mt-2 mb-3 flex flex-col lg:flex-row gap-2 lg:gap-12">
				{/* Title */}
				<h1 className="text-lg md:text-2xl font-bold">{activity?.name}</h1>
				{/* Tags */}
				{/* <div className="flex flex-row max-w-full gap-3">
					<div className="text-white font-bold items-center flex px-4 py-2 lg:py-1 text-xs lg:text-base" style={{
						borderRadius: "10px",
						background: "linear-gradient(293deg, #BA93FF -23.61%, #933EFF 80.31%)",
						boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
					}}>
						BESTSELLER
					</div>
				</div> */}
			</div>
			{/* Address */}
			<p className="font-medium">{activity?.postalCode}</p>
			{/* Image, Description and Cart */}
			<div className="flex flex-col xl:flex-row justify-between mt-6">
				{/* LEFT */}
				{/* Image description */}
				<div>
					{/* Image */}
					<div className="aspect-[16/9] w-[719px]">
						<img src={url} alt="activity_image" className="object-cover w-full h-full rounded-lg" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.60)" }} />
					</div>
				</div>
				{/* RIGHT */}
				{/* Cart */}
				<div className="mt-8 xl:mt-0 p-7 rounded-lg h-fit w-fit" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
					{/* Date */}
					<div className="mb-4">
						<h2 className="font-semibold text-lg mb-1">Select Date</h2>
						<input type="date" value={date} onChange={e => setDate(e.target.value)} className="outline-none cursor-pointer required" min={(new Date(activity?.startingAt) >= new Date() ? activity?.startingAt : new Date(Date.now() + 8.64e+7)).toISOString().split("T")[0]} max={activity?.endingAt?.split("T")} />
						{dateError.length != 0 && <p className="text-red-500 text-sm italic">{dateError}</p>}
					</div>
					{/* Timeslots */}
					{activity?.timeslots.length != 0 && <div className="mb-4">
						<h2 className="font-semibold text-lg mb-1">Select Timeslots</h2>
						<div className="grid grid-cols-3 gap-2">
							{activity?.timeslots.map(ts => {
								const value = ts.timeslot.split(":").slice(0, 2).join(":")
								return <div key={ts.id} className={`py-1 text-center rounded-lg border-2 font-medium ${timeslot == value ? "border-[#EB4710] text-[#EB4710]" : "border-black"} cursor-pointer`} onClick={() => handleTimeslot(value)}> {value} </div>
							})}
						</div>
						{timeslotError.length != 0 && <p className="text-red-500 text-sm italic mt-1">{timeslotError}</p>}
					</div>}
					<h2 className="font-semibold text-lg mb-4">Select Option</h2>
					{/* Options */}
					<div className="flex flex-col gap-6">
						{/* Child Price */}
						{activity?.childPrice && <div className="flex flex-row px-4 py-2 justify-between bg-[#FF8541] rounded-lg gap-20 items-center" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
							<p className="font-bold">Child</p>
							<div className="flex flex-row items-center">
								{/* Price, do not multiply */}
								<p className="font-medium mr-4">S${activity?.childPrice.toFixed(2)}</p>
								<button onClick={() => setChildQuantity(q => q == 0 ? 0 : q - 1)}>-</button>
								<span className="px-2 font-medium">{childQuantity}</span>
								<button onClick={() => setChildQuantity(q => q + 1)}>+</button>
							</div>
						</div>}
						{/* Adult Price */}
						{activity?.adultPrice && <div className="flex flex-row px-4 py-2 justify-between rounded-lg gap-20 items-center" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
							<p className="font-bold">Adult</p>
							<div className="flex flex-row items-center">
								{/* Price, do not multiply */}
								<p className="font-medium mr-4">S${activity?.adultPrice.toFixed(2)}</p>
								<button onClick={() => setAdultQuantity(q => q == 0 ? 0 : q - 1)}>-</button>
								<span className="px-2 font-medium">{adultQuantity}</span>
								<button onClick={() => setAdultQuantity(q => q + 1)}>+</button>
							</div>
						</div>}
					</div>
					{/* Total */}
					<p className="text-sm mt-6">Total</p>
					<div className="flex flex-row justify-between">
						<p className="text-3xl font-semibold">S$ {(((childQuantity ?? 0) * activity?.childPrice) + ((adultQuantity ?? 0) * activity?.adultPrice)).toFixed(2)}</p>
						<button type="submit" onClick={addToCart} className="py-2 px-4 text-white font-bold text-lg ml-6" style={{
							borderRadius: "10px",
							background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
							boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
						}}>
							Add To Cart
						</button>
					</div>
				</div>
			</div>
			<section className="mt-8 lg:mt-16 max-w-[716px] mb-20">
				{/* Highlights */}
				<div className="flex flex-row items-center">
					<h1 className="font-bold text-lg mb-2">Description</h1>
					<div className="flex-grow bg-[#EB4710] h-[2px] mx-4"></div>
				</div>
				<p>{activity?.description}</p>
			</section>
			<hr className="my-12 border-[1px]" />
			<div className="my-4 justify-center text-center w-full items-center">
				<h1 className="md:text-2xl font-bold text-xl mb-4">Let's see what others thought about it...</h1>
				<div className="flex flex-row lg:text-center justify-center items-center w-full">
					{/* Average rating */}
					{activity?.reviews.length > 0 && <h1 className="font-bold text-3xl">{(activity?.reviews.reduce((a, b) => a + b.rating, 0) / activity?.reviews.length).toFixed(1)}</h1>}
					{activity?.reviews.length == 0 && <h1 className="font-bold text-3xl">0.0</h1>}
					<img src={(activity?.reviews.reduce((a, b) => a + b.rating, 0) / activity?.reviews.length) >= 1 ? Star : BlankStar} className="w-[30px] h-[30px] ml-4" />
					<img src={(activity?.reviews.reduce((a, b) => a + b.rating, 0) / activity?.reviews.length) >= 2 ? Star : BlankStar} className="w-[30px] h-[30px] ml-1" />
					<img src={(activity?.reviews.reduce((a, b) => a + b.rating, 0) / activity?.reviews.length) >= 3 ? Star : BlankStar} className="w-[30px] h-[30px] ml-1" />
					<img src={(activity?.reviews.reduce((a, b) => a + b.rating, 0) / activity?.reviews.length) >= 4 ? Star : BlankStar} className="w-[30px] h-[30px] ml-1" />
					<img src={(activity?.reviews.reduce((a, b) => a + b.rating, 0) / activity?.reviews.length) >= 5 ? Star : BlankStar} className="w-[30px] h-[30px] ml-1" />
				</div>
				{/* Number of reviews */}
				<p className="font-semibold mt-1">Based on {activity?.reviews.length} reviews</p>
			</div>
			<hr className="my-12 border-[#EB4710] border-[1px] mx-auto max-w-[800px]" />
			{/* Reviews */}
			<div className="max-w-[800px] mx-auto mb-20">
				{activity?.reviews.map(review => <Review review={review} key={review.id} />)}
			</div>
		</div>
	</>;
}

export default Activity;