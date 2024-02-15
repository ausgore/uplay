import { useEffect, useState } from "react";
import Nav from "../components/Nav"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageDiscounts = () => {
	const navigate = useNavigate();
	const [discounts, setDiscounts] = useState([]);
	useEffect(() => {
		(async () => {
			const response = await axios.get("http://localhost:5021/discount");
			setDiscounts(response.data);
		})();
	}, []);

	const updateStatus = async (id, status) => {
		await axios.post(`http://localhost:5021/discount/update-status/${id}/${status}`);
		const response = await axios.get("http://localhost:5021/discount");
		setDiscounts(response.data);
	}

	return <>
		<Nav staff={true} />
		<div className="max-w-[1300px] mx-auto px-4 pt-28">
			<div className="flex justify-between">
				<h1 className="font-bold text-3xl">Manage Discounts</h1>
				<button className="rounded-lg text-white font-medium px-4 py-2 text-lg" style={{
					background: "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)",
					boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
				}} onClick={() => navigate("/create-discount")}>+ Add Discount</button>
			</div>
			<table className="mt-12 w-full rounded-lg" style={{ boxShadow: "0px 1px 2px 2px rgba(0, 0, 0, 0.50)" }}>
				<thead className="border-b-[3px] border-b-[#E6533F]">
					<tr>
						<td className="py-5 text-xl font-bold pl-6 w-[200px]">DiscountID</td>
						<td className="py-5 text-xl font-bold">Code</td>
						<td className="py-5 text-xl font-bold w-[200px]">Percentage</td>
						<td className="py-5 text-xl font-bold">Status</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{discounts?.map((discount, index) => {
						return <tr className={`${index % 2 == 0 ? "bg-gray-50" : ""}`} key={discount.id}>
							<td className="pl-6 py-4 font-bold">{discount.id}</td>
							<td>{discount.code}</td>
							<td>{discount.percentage}%</td>
							<td>
								<select className="cursor-pointer outline-none" value={discount.disabled} onChange={e => updateStatus(discount.id, e.target.value)}>
									<option value={discount.disabled}>{discount.disabled ? "Disabled" : "Enabled"}</option>
									<option value={!discount.disabled}>{discount.disabled ? "Enabled" : "Disabled"}</option>
								</select>
							</td>
							<td className="pr-6 py-4 flex justify-end items-center gap-2">
								<div className="flex gap-4">
									<button className="text-sm rounded-lg text-white font-medium px-4 py-2" style={{
										background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
										boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
									}} onClick={() => navigate(`/update-discount/${discount.id}`)}>Edit Details</button>
									<button className="text-sm rounded-lg text-white font-medium px-4 py-2" style={{
										background: "linear-gradient(111deg, #FF2424 -1.39%, #580C0C 143.42%)",
										boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
									}}>Delete</button>
								</div>
							</td>
						</tr>
					})}
				</tbody>
			</table>
		</div>
	</>
}

export default ManageDiscounts;