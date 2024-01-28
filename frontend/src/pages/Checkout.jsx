import axios from "axios";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import Nav from "../components/Nav";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
	const [stripePromise, setStripePromise] = useState();
	const [clientSecret, setClientSecret] = useState("");
	const user = useUser();
	const [cart, setCart] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) navigate("/activities");
	}, []);
	
	useEffect(() => {
		(async () => {
			if (user) {
				const response = await axios.get(`http://localhost:5021/user/cart/${user.id}`).catch(e => e.response);
				if (response.status == 200) setCart(response.data);
			}
		})();
	}, [user]);

	useEffect(() => {
		(async () => {
			const response = await axios.get("http://localhost:5021/stripe/config");
			const { publishableKey } = response.data;
			setStripePromise(loadStripe(publishableKey));
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const total = cart.reduce((a, p) => a + (p.adultQuantity * p.activity.adultPrice) + (p.childQuantity * p.activity.childPrice), 0);
			const response = await axios.post(`http://localhost:5021/stripe/create-payment-intent/${total}`);
			const { clientSecret } = response.data;
			setClientSecret(clientSecret);
		})();
	}, [cart]);

	return <>
		<Nav />
		<div className="max-w-[1300px] mx-auto px-4 pt-32">
			<h1 className="font-bold text-3xl mb-10">Checkout</h1>
			{cart && stripePromise && clientSecret && <Elements stripe={stripePromise} options={{ clientSecret }}>
				<CheckoutForm cart={cart} />
			</Elements>}
		</div>
	</>
}

export default Checkout;