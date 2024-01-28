import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = ({ cart }) => {
	const navigate = useNavigate();
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);

	const onSubmit = async e => {
		e.preventDefault();

		if (!stripe || !elements) return;

		setIsProcessing(true);

		const { error } = await stripe.confirmPayment({ elements, redirect: "if_required" });
		setIsProcessing(false);

		if (!error) {
			alert("Successfully paid for. Redirecting to bookings page");
			for (const product of cart) {
				await axios.post(`http://localhost:5021/booking/create/${product.id}`, {
					activityId: product.activity.id,	
					activityName: product.activity.name,
					bookedDate: product.bookedDate,
					timeslot: product.timeslot,
					activityPostalCode: product.activity.postalCode,
					childQuantity: product.childQuantity,
					adultQuantity: product.adultQuantity,
					initialAdultPrice: product.activity.adultPrice,
					initialChildPrice: product.activity.childPrice
				});
			}
			navigate("/bookings");
		}
	}

	return <>
		<form onSubmit={onSubmit}>
			<div className="p-6 w-[700px] rounded-lg" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
				<PaymentElement />
			</div>
			<div className="p-6 w-[700px] rounded-lg mt-8 flex justify-between" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
				<p className="w-[355px] text-sm font-medium self-center">By clicking "Pay Now", you agree that you have read and understood the Terms and Conditions as well as the Cancellation Policy</p>
				<div className="flex flex-grow justify-center text-center">
					<div>
						<p className="text-2xl font-bold mb-2 text-[#EB4710]">S${(cart.reduce((a, p) => a + (p.adultQuantity * p.activity.adultPrice) + (p.childQuantity * p.activity.childPrice), 0)).toFixed(2)}</p>
						<button disabled={isProcessing} type="submit" className="font-bold text-white rounded-md w-[140px] h-[40px]" style={{ background: "linear-gradient(102deg, #EB4710 25.27%, #F8BA05 93.93%)" }}>
							<span>{isProcessing ? "Processing ..." : "Pay now"}</span>
						</button>
					</div>
				</div>
			</div>
		</form>
	</>
}

export default CheckoutForm;