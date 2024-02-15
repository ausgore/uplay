import { useNavigate, useParams } from "react-router-dom"
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import axios from "axios";

const UpdateDiscount = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const [code, setCode] = useState("");
	const [codeError, setCodeError] = useState("");
	const [percentage, setPercentage] = useState("");
	const [percentageError, setPercentageError] = useState("");

	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/discount?id=${id}`).catch(e => e.response);
			if (response.status !== 200 || !response.data) {
				alert(`(DEBUG) No discount with ID ${id}. Redirecting...`);
				navigate("/activities");
			}

			setCode(response.data[0].code);
			setPercentage(response.data[0].percentage);
		})();
	}, []);

	const handlePercentageChange = e => {
		if (e.target.value.length == 4) return;
		setPercentage(e.target.value);
	}

	const onSubmit = async e => {
		e.preventDefault();
		var hasError = false;

		if (isNaN(parseInt(percentage)) || parseInt(percentage) < 5 || parseInt(percentage) > 75) {
			hasError = true;
			setPercentageError("Please provide a valid percentage value between 5 and 75.");
		}

		if (hasError) return;

		setCodeError("");
		setPercentageError("");

		const response = await axios.put(`http://localhost:5021/discount/update-discount/${id}`, { code, percentage }).catch(e => e.response);
		if (response.data.code.includes("already in use")) return setCodeError(response.data.code);

		alert("Discount code successfully updated.");
		navigate("/manage-discounts");
	}

	return <>
		<Nav staff={true} />
		<div className="max-w-[1300px] mx-auto px-4 pt-28">
			<h1 className="font-bold text-2xl md:text-4xl">Update Discount</h1>
			<form className="mt-6 flex flex-col" onSubmit={onSubmit}>
				{/* Code */}
				<label htmlFor="code" className="items-center font-semibold text-xl mt-3">Code <span className="text-red-500 text-sm">*</span></label>
				<input id="code" placeholder="uplay23" className="p-2 outline-none max-w-[414px] rounded-lg my-2" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }} required value={code} onChange={e => setCode(e.target.value)} />
				{codeError && <span className="text-sm text-red-500">{codeError}</span>}

				{/* Percentage */}
				<label htmlFor="percentage" className="items-center font-semibold text-xl mt-3">Percentage off <span className="text-red-500 text-sm">*</span></label>
				<input id="percentage" placeholder="10" type="number" className="p-2 outline-none max-w-[414px] rounded-lg my-2" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }} maxLength={2} required value={percentage} onChange={handlePercentageChange} max={75} />
				{percentageError && <span className="text-sm text-red-500">{percentageError}</span>}

				<button className="text-white font-semibold text-lg p-3 rounded-lg max-w-[177px] my-12" style={{
					background: "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)",
					boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
				}} type="submit">
					Save Changes
				</button>
			</form>
		</div>
	</>
}

export default UpdateDiscount;