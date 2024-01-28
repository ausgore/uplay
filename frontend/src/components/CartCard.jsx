import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";

const CartCard = ({ product, setCart }) => {
	const user = useUser();
	const [url, setURL] = useState("");

	useEffect(() => {
		(async () => {
			const fileRes = await axios.get(`http://localhost:5021/activity/file/${product.activityId}`, { responseType: "arraybuffer" });
			const blob = new Blob([fileRes.data], { type: "image/png" });
			const objectURL = URL.createObjectURL(blob);
			setURL(objectURL);
		})();
	}, [product]);

	const remove = async () => {
		alert("Are you sure you want to delete? (Auto YES)")
		await axios.delete(`http://localhost:5021/user/delete-cart/${product.id}`);
		const response = await axios.get(`http://localhost:5021/user/cart/${user.id}`);
		setCart(response.data);
	}

	const incChild = async () => {
		await axios.put(`http://localhost:5021/user/update-cart/${product.id}`, { childQuantity: product.childQuantity + 1, adultQuantity: product.adultQuantity });
		const response = await axios.get(`http://localhost:5021/user/cart/${user.id}`);
		setCart(response.data);
	}

	const decChild = async () => {
		if (product.childQuantity - 1 == 0 && !product.adultQuantity) remove();
		else {
			if (product.childQuantity > 0) {
				await axios.put(`http://localhost:5021/user/update-cart/${product.id}`, { childQuantity: product.childQuantity - 1, adultQuantity: product.adultQuantity });
				const response = await axios.get(`http://localhost:5021/user/cart/${user.id}`);
				setCart(response.data);
			}
		}
	}


	const incAdult = async () => {
		await axios.put(`http://localhost:5021/user/update-cart/${product.id}`, { adultQuantity: product.adultQuantity + 1, childQuantity: product.childQuantity });
		const response = await axios.get(`http://localhost:5021/user/cart/${user.id}`);
		setCart(response.data);
	}

	const decAdult = async () => {
		if (!product.childQuantity && product.adultQuantity - 1 == 0) remove();
		else {
			if (product.adultQuantity > 0) {
				await axios.put(`http://localhost:5021/user/update-cart/${product.id}`, { adultQuantity: product.adultQuantity - 1, childQuantity: product.childQuantity });
				const response = await axios.get(`http://localhost:5021/user/cart/${user.id}`);
				setCart(response.data);
			}
		}
	}

	return <div key={product.id} className="flex justify-between p-5 rounded-lg gap-20" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
		{/* Image title and delete */}
		<div className="flex">
			{/* Image of product */}
			<div className="aspect-[16/9] max-w-[199px] mr-4">
				<img src={url} alt="activity_image" className="object-cover w-full h-full rounded-lg" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.60)" }} />
			</div>
			<div className="flex flex-col justify-between">
				<div>
					{/* Title */}
					<h1 className="font-bold text-lg">{product.activity.name.substr(0, 25)}{product.activity.name.length > 25 ? "..." : ""}</h1>
					{/* Date */}
					<p className="italic">{new Date(product.bookedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
					{product.timeslot && <p className="italic">{product.timeslot}</p>}
				</div>
				<a className="underline text-red-500 font-bold text-sm cursor-pointer" onClick={remove}>Remove</a>
			</div>
		</div>
		{/* Back */}
		<div>
			<table>
				<tbody>
					{product.activity.childPrice && <tr>
						<td className="font-medium">Child</td>
						<td className="px-4">S${product.activity.childPrice.toFixed(2)}</td>
						<td>
							<div className="flex flex-row">
								<button onClick={decChild}>-</button>
								<span className="px-2 font-medium">{product.childQuantity}</span>
								<button onClick={incChild}>+</button>
							</div>
						</td>
					</tr>}
					{product.activity.adultPrice && <tr>
						<td className="font-medium">Adult</td>
						<td className="px-4">S${product.activity.adultPrice.toFixed(2)}</td>
						<td>
							<div className="flex flex-row">
								<button onClick={decAdult}>-</button>
								<span className="px-2 font-medium">{product.adultQuantity}</span>
								<button onClick={incAdult}>+</button>
							</div>
						</td>
					</tr>}
				</tbody>
			</table>
		</div>
	</div>
}

export default CartCard;