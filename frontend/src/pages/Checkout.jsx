import Nav from "../components/Nav";
import StripeWrapper from "../components/StripeWrapper";
import CheckoutForm from "./CheckoutForm";

const Checkout = () => {

	return <>
		<Nav />
		<div className="max-w-[1300PX] mx-auto px-4 pt-24">
			<StripeWrapper cents={100}>
				<CheckoutForm />
			</StripeWrapper>
		</div>
	</>;
}

export default Checkout;