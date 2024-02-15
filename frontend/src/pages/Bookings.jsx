import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import axios from "axios";

const Bookings = () => {
	const navigate = useNavigate();
	const user = useUser();
	const [bookings, setBookings] = useState([]);
	useEffect(() => {
		if (!user) navigate("/activities");
		(async () => {
			const response = await axios.get(`http://localhost:5021/booking/get-bookings/${user?.id}`)
			setBookings(response.data);
			console.log(response.data);
		})();
	}, [user]);

	return <>
		<Nav />
		<div className="max-w-[1300px] mx-auto px-4 pt-28">
			<div className="flex justify-between">
				<h1 className="font-bold text-3xl">Booking History</h1>
			</div>
			<table className="mt-12 w-full rounded-lg" style={{ boxShadow: "0px 1px 2px 2px rgba(0, 0, 0, 0.50)" }}>
				<thead className="border-b-[3px] border-b-[#E6533F]">
					<tr>
						<td className="py-5 text-xl font-bold pl-6">Activity</td>
						<td className="py-5 text-xl font-bold">Activity Date</td>
						<td className="py-5 text-xl font-bold">Booking ID</td>
						<td className="py-5 text-xl font-bold">Price</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{bookings?.map((booking, index) => {
						return <tr className={`${index % 2 == 0 ? "bg-gray-50" : ""}`} key={booking.id}>
							<td className="pl-6 py-4 font-bold">{booking.activityName}</td>
							<td>{new Date(booking.bookedDate).toLocaleDateString("en-US", { day: "numeric", month: "numeric", year: "numeric" })} {booking.timeslot && <>{new Date(`2024-01-01T${booking.timeslot}:00`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</>}</td>
							<td>{booking.id}</td>
							<td>S${(((booking.childQuantity * booking.initialChildPrice) + (booking.adultQuantity * booking.initialAdultPrice)) * (booking.appliedDiscount ? 1 - (booking.appliedDiscount / 100) : 1) ).toFixed(2)}</td>
							<td className="pr-6 py-4 flex justify-end items-center gap-2">
								<div className="flex gap-4">
									<button className="text-sm rounded-lg text-white font-medium px-4 py-2" style={{
										background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
										boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
									}} onClick={() => navigate(`/bookings/${booking.id}`)}>View Bookings</button>
								</div>
							</td>
						</tr>
					})}
					<tr>

					</tr>
				</tbody>
			</table>
		</div>
	</>
}

export default Bookings;