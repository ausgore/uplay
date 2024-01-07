import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from 'react';
import axios from "axios";
const stripePromise = loadStripe("pk_test_51NnHKDLBQ2JqxfdOjNLPRf0fVoRRLwnEoyTxqVX8dI9ls9A9GDYFnHytjL8OZOWIgcZpcqlvgUkHAraYRMDcqb6d00vvqISnXP");

const StripeWrapper = ({ cents, children }) => {
	const [secret, setSecret] = useState(null);

	useEffect(() => {
		if (cents) axios.post(`http://localhost:5021/stripe/create-payment-intent`, { amount: cents }).then(res => setSecret(res.data.client_secret));
	}, [cents]);

	return secret && <Elements key={Date.now()} stripe={stripePromise} options={{ clientSecret: secret }}>
		{children}
	</Elements>;
}

export default StripeWrapper;