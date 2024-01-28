import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Screenshot from "../assets/screenshot.png";
import CartCard from "../components/CartCard";

const Cart = () => {
	const validCouponCodes = ["uplay23"];

	const navigate = useNavigate();
	const user = useUser();
	const [cart, setCart] = useState([]);

	const [couponCodeValue, setCouponCodeValue] = useState("");
	const [appliedCouponCode, setAppliedCouponCode] = useState("");

	const applyCouponCode = () => {
		if (!validCouponCodes.includes(couponCodeValue.toLowerCase())) return alert("Provided coupon is invalid. (Try UPLAY23)");
		setAppliedCouponCode(couponCodeValue);
		setCouponCodeValue("");
		alert("Coupon code has been applied.");
	}

	useEffect(() => {
		(async () => {
			if (user) {
				const response = await axios.get(`http://localhost:5021/user/cart/${user.id}`).catch(e => e.response);
				if (response.status == 200) setCart(response.data);
				console.log(response.data);
			}
		})();
	}, [user]);

	const checkout = async () => {
		if (!cart.length) return alert("You can't checkout with nothing.");
		navigate("/checkout");
	}

	return <>
		<Nav />
		<div className="max-w-[1300PX] mx-auto px-4 pt-32">
			{/* Header */}
			<div className="mt-2 mb-3 gap-2 lg:gap-12 flex flex-row justify-between">
				{/* Title */}
				<h1 className="text-lg md:text-2xl font-bold">Your Cart</h1>
				<Link to="/activities" className="font-bold text-sm cursor-pointer">{"<"} Continue Shopping</Link>
			</div>
			{/* List of products */}
			<div className="flex flex-col xl:flex-row justify-between mt-12">
				<div className="flex flex-col gap-4">
					{cart.length == 0 && <p className="text-xl font-bold text-gray-300">
						There is nothing in your cart right now.
					</p>}
					{/* Each product */}
					{cart.map(product => <CartCard key={product.id} product={product} setCart={setCart} />)}
				</div>
				<div className="mt-8 xl:mt-0 p-4 rounded-lg h-fit w-fit" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
					<h2 className="font-bold text-lg mb-4">Cart Summary</h2>
					<table className="w-full">
						<tbody>
							<tr>
								<td className="font-semibold">Subtotal</td>
								<td className="font-semibold text-right">S${cart.reduce((a, p) => a + (p.adultQuantity * p.activity.adultPrice) + (p.childQuantity * p.activity.childPrice), 0).toFixed(2)}</td>
							</tr>
							{appliedCouponCode && <tr className="text-[#096A00] text-sm font-semibold">
								<td className="pr-7">CODE : {appliedCouponCode.toUpperCase()} (20%OFF)</td>
								<td className="text-right">-S${(cart.reduce((a, p) => a + (p.adultQuantity * p.activity.adultPrice) + (p.childQuantity * p.activity.childPrice), 0) * 0.2).toFixed(2)}</td>
							</tr>}
							<tr>
								<td className="font-bold text-lg pt-8">Total</td>
								<td className="font-bold text-lg pt-8 text-right">S${(cart.reduce((a, p) => a + (p.adultQuantity * p.activity.adultPrice) + (p.childQuantity * p.activity.childPrice), 0) * (appliedCouponCode ? 0.8 : 1)).toFixed(2)}</td>
							</tr>
						</tbody>
					</table>
					{/* Apply discount */}
					<div className="flex flex-row border rounded-lg justify-between mt-4">
						<input type="text" placeholder="Enter Discount Code" className="py-1 px-2 outline-none" maxLength={20} onChange={e => setCouponCodeValue(e.target.value)} value={couponCodeValue} />
						<button onClick={applyCouponCode} className="text-center text-white font-bold rounded-r-lg text-sm border-l px-4" style={{
							background: "linear-gradient(299deg, #57319A -10.47%, #BA93FF 281.87%)"
						}}>Apply</button>
					</div>
					{/* Checkout */}
					<div className="flex justify-center mt-8">
						<button onClick={checkout} className="py-2 px-8 text-white font-bold" style={{
							borderRadius: "10px",
							background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
							boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
						}}>
							Checkout
						</button>
					</div>
				</div>
			</div>
			<div>
				<img src={Screenshot} alt="screenshot" className="mt-24" />
			</div>
		</div>
	</>
}

export default Cart;