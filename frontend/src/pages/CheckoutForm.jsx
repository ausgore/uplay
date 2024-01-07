import { PaymentElement, useStripe } from "@stripe/react-stripe-js";

const CheckoutForm = () => {


	return <form>
		<PaymentElement />
		<button type="submit" />
	</form>
}

export default CheckoutForm;