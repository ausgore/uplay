import { useParams } from "react-router-dom";
import Nav from "../components/Nav"
import { useEffect, useState } from "react";
import axios from "axios";
import Star from "../assets/images/star.png";
import BlankStar from "../assets/images/blankstar.png";
import { useUser } from "../contexts/UserContext";

const Booking = () => {
	const { id } = useParams();
	const [booking, setBooking] = useState();
	const user = useUser();

	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/booking/get-booking/${id}`);
			setBooking(response.data);
			console.log(response.data);
		})();
	}, [id]);

	const [review, setReview] = useState("");
	const [rating, setRating] = useState(1);

	const submitReview = async () => {
		if (!user) return alert("You cannot submit a review while logged out.");
		if (!review?.trim().length) return alert("You cannot leave an empty review.");

		const response = await axios.post(`http://localhost:5021/activity/submit-review/${booking.activityId}`, { userId: user.id, rating, content: review }).catch(e => e.response);
		if (response.status != 200) return alert("An error occurred trying to submit this review");
		const bookingResponse = await axios.post(`http://localhost:5021/booking/add-review/${booking.id}/${response.data.id}`).catch(e => e.response);
		if (bookingResponse.status != 200) return alert("An error occured trying to add this review to the booking");
		
		const updateResponse = await axios.get(`http://localhost:5021/booking/get-booking/${id}`);
		setBooking(updateResponse.data);
		alert("Successfully submitted review!");
	}

	return <>
		<Nav />
		<div className="max-w-[1300px] mx-auto px-4 pt-32">
			<h1 className="font-bold text-2xl mb-14">Booking Details</h1>
			<div className="items-center mb-8">
				<h2 className="font-medium mb-1">Booking ID :</h2>
				<p className="font-bold text-xl">{booking?.id}</p>
				<hr className="border-[#EB4710] mt-8 max-w-[600px]" />
			</div>
			<div className="items-center mb-8">
				<h2 className="font-medium mb-1">Activity Name :</h2>
				<p className="font-bold text-xl">{booking?.activityName}</p>
				<p className="font-medium italic mt-1">{booking?.activityPostalCode}</p>
				<hr className="border-[#EB4710] mt-8 max-w-[600px]" />
			</div>
			<div className="items-center mb-8">
				<h2 className="font-medium mb-1">Selected Date :</h2>
				<p className="font-bold text-xl">{new Date(booking?.bookedDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
				<hr className="border-[#EB4710] mt-8 max-w-[600px]" />
			</div>
			<div className="items-center mb-8">
				<h2 className="font-medium mb-1">Selected Options :</h2>
				{booking?.childQuantity != 0 && <p className="font-bold text-xl">Children x{booking?.childQuantity} - S${booking?.initialChildPrice.toFixed(2)} (S${(booking?.childQuantity * booking?.initialChildPrice).toFixed(2)})</p>}
				{booking?.adultQuantity != 0 && <p className="font-bold text-xl">Adult x{booking?.adultQuantity} - S${booking?.initialAdultPrice.toFixed(2)} (S${(booking?.adultQuantity * booking?.initialAdultPrice).toFixed(2)})</p>}
				<br />
				<p className="font-bold text-xl">Total - S${((booking?.adultQuantity * booking?.initialAdultPrice ?? 0) + (booking?.childQuantity * booking?.initialChildPrice ?? 0)).toFixed(2)}</p>
			</div>
			<hr className="border-black" />
			{!booking?.reviewId && <>
				<div className="mt-8 mb-20">
					<h1 className="text-2xl font-bold">Let others know what you thought of it...</h1>
					<div className="flex flex-row mb-4 my-4">
						<img src={Star} className="w-[35px] h-[35px] mr-1" onClick={e => setRating(1)} />
						<img src={rating >= 2 ? Star : BlankStar} className="w-[35px] h-[35px] mr-1 cursor-pointer" onClick={e => setRating(2)} />
						<img src={rating >= 3 ? Star : BlankStar} className="w-[35px] h-[35px] mr-1 cursor-pointer" onClick={e => setRating(3)} />
						<img src={rating >= 4 ? Star : BlankStar} className="w-[35px] h-[35px] mr-1 cursor-pointer" onClick={e => setRating(4)} />
						<img src={rating >= 5 ? Star : BlankStar} className="w-[35px] h-[35px] mr-1 cursor-pointer" onClick={e => setRating(5)} />
					</div>
					{/* Writing a review */}
					<textarea className="outline-none border w-[800px] h-[250px] rounded-lg px-4 py-2 resize-none border-gray-300" placeholder="What did you think about the activity?" value={review} onChange={e => setReview(e.target.value)} />
				</div>
				{/* Submit review */}
				<button className="rounded-lg max-w-[200px] text-white font-semibold text-sm px-4 py-2 mt-4" style={{ background: "linear-gradient(102deg, #EB4710 25.27%, #F8BA05 93.93%)", boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }} onClick={submitReview}>Submit Review</button>
			</>}
			{booking?.reviewId && <>
				<div className="mt-8 mb-20">
					<h1 className="text-2xl font-bold">Your review</h1>
					<div className="flex flex-row mb-4 my-4">
						<img src={Star} className="w-[35px] h-[35px] mr-1" />
						<img src={booking.review.rating >= 2 ? Star : BlankStar} className="w-[35px] h-[35px] mr-1 cursor-pointer" />
						<img src={booking.review.rating >= 3 ? Star : BlankStar} className="w-[35px] h-[35px] mr-1 cursor-pointer" />
						<img src={booking.review.rating >= 4 ? Star : BlankStar} className="w-[35px] h-[35px] mr-1 cursor-pointer" />
						<img src={booking.review.rating >= 5 ? Star : BlankStar} className="w-[35px] h-[35px] mr-1 cursor-pointer" />
					</div>
					<p>{booking.review.content}</p>
				</div>
			</>}
		</div>
	</>
}

export default Booking;