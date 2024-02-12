import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateActivity = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const [name, setName] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [postalCodeError, setPostalCodeError] = useState("");
	const [tags, setTags] = useState("");
	const [adultPrice, setAdultPrice] = useState("");
	const [adultPriceError, setAdultPriceError] = useState("");
	const [childPrice, setChildPrice] = useState("");
	const [childPriceError, setChildPriceError] = useState("");
	const [description, setDescription] = useState("");

	const [isDaily, setIsDaily] = useState(true);
	const handleDaily = () => setIsDaily(!isDaily);
	const [startingDate, setStartingDate] = useState("");
	const [startingDateError, setStartingDateError] = useState("");

	const [endingDate, setEndingDate] = useState("");
	const [hour, setHour] = useState();
	const [minute, setMinute] = useState();
	const [timeslots, setTimeslots] = useState([]);

	const [file, setFile] = useState();
	const [url, setURL] = useState();
	const [fileUpdated, setFileUpdated] = useState(false);
	const uploadFile = (e) => {
		setFileUpdated(true);
		setURL(URL.createObjectURL(e.target.files[0]));
		setFile(e.target.files[0]);
	}

	const addTimeslot = async () => {
		if (!hour || hour.length > 2 || !minute || minute.length > 2) return alert("You must provide a valid time to add.");
		const timeslot = `${hour.length == 1 ? "0" : ""}${hour}:${minute.length == 1 ? "0" : ""}${minute}`;
		if (timeslots.includes(timeslot)) return alert("This is already an existing timeslot.");
		setHour("");
		setMinute("");

		const response = await axios.post(`http://localhost:5021/activity/add-timeslot/${id}`, { timeslot: `${timeslot}:00` }).catch(e => e.response);
		setTimeslots(response.data.timeslots);
	}
	const removeTimeslot = async (id) => {
		const newTimeslots = timeslots.filter(timeslot => timeslot.id != id);
		setTimeslots(newTimeslots);
		const response = await axios.put(`http://localhost:5021/activity/remove-timeslot/${id}/${id}`).catch(e => e.response);
		if (response.status != 200) return alert("There was an error trying to remove this timeslot. Please refresh and try again.");
	};

	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/activity?id=${id}`).catch(e => e.response);
			if (response.status != 200 || !response.data[0]) {
				alert(`(DEBUG) No activity with ID ${id}. Returning to sign in page.`);
				navigate("/");
			}

			const fileResponse = await axios.get(`http://localhost:5021/activity/file/${id}`, { responseType: "arraybuffer" });
			const buffer = new Uint8Array(fileResponse.data);
			let binary = "";
			const bytes = new Uint8Array(buffer);
			for (const byte of bytes) binary += String.fromCharCode(byte);
			const blob = new Blob([fileResponse.data], { type: "image/png" });
			const objectURL = URL.createObjectURL(blob);
			setFile(`data:image/png;base64,${btoa(binary)}`);
			setURL(objectURL);
			
			setName(response.data[0].name);
			setPostalCode(response.data[0].postalCode);
			setTags(response.data[0].tags.map(t => t.content).join(", "));
			setAdultPrice(response.data[0].adultPrice);
			setChildPrice(response.data[0].childPrice);
			setDescription(response.data[0].description);
			setIsDaily(response.data[0].isDaily);
			setTimeslots(response.data[0].timeslots);
			if (response.data[0].startingAt) setStartingDate(response.data[0].startingAt.split("T")[0]);
			if (response.data[0].endingAt) setEndingDate(response.data[0].endingAt.split("T")[0]);
		})();
	}, [id]);

	const onSubmit = async e => {
		let hasError = false;
		e.preventDefault();

		if (!adultPrice && !childPrice) {
			hasError = true;
			setAdultPriceError("At least one value must be set.");
			setChildPriceError("At least one value must be set.");
		}
		else {
			if (parseInt(adultPrice) <= 0) {
				hasError = true;
				setAdultPriceError("You cannot have negative pricing.");
			}
			if (parseInt(childPrice) <= 0) {
				hasError = true;
				setChildPriceError("You cannot have negative pricing.");
			}
		}

		if (!isDaily) {
			if (!startingDate.length) {
				hasError = true;
				setStartingDateError("The starting date must at least be set if this activity isn't daily.");
			}
		}

		if (hasError) return;

		setAdultPriceError("");
		setChildPriceError("");
		setStartingDateError("");

		const response = await axios.put(`http://localhost:5021/activity/update/${id}`, {
			postalCode,
			name,
			childPrice: childPrice ? parseInt(childPrice) : null,
			adultPrice: adultPrice ? parseInt(adultPrice) : null,
			description,
			isDaily,
			startingAt: startingDate.length ? startingDate : null,
			endingAt: endingDate.length ? endingDate : null
		}).catch(e => e.response);

		if (file && fileUpdated) {
			const formData = new FormData();
			formData.append("file", file);
			const fileResponse = await axios.post(`http://localhost:5021/activity/upload-file/${id}`, formData).catch(e => e.response);
			if (fileResponse.status != 200) return alert("An error occured when trying to edit a file");	
		}

		if (response.status != 200) return alert("An error occurred when trying to update the activity.");

		// Setting tags
		const separatedTags = tags.replace(/ /g, "").split(",");
		const setTagsResponse = await axios.put(`http://localhost:5021/activity/set-tags/${id}`, separatedTags.map(tag => ({ content: tag }))).catch(e => e.response);
		if (setTagsResponse.status != 200) return alert("An error occured when trying to set the new tags.");

		alert("Activity successfully updated. (DEBUG) Going to activity page.");
		return navigate(`/activities/${response.data.id}`);
	}


	return <>
		<Nav staff={true} />
		<div className="max-w-[1300px] mx-auto px-4 pt-28">
			<h1 className="font-bold text-2xl md:text-4xl">Update Activity</h1>
			<form className="mt-6 flex flex-col" onSubmit={onSubmit}>
				{/* IMAGE */}
				<input type="file" id="image" onChange={uploadFile} accept=".png, .jpg, .jpeg" />
				{file && <div className="aspect-[16/9] max-w-[600px] my-2">
					<img alt="activity_image" className="object-cover w-full h-full rounded-lg border" src={url} />
				</div>}
				{/* NAME */}
				<label htmlFor="name" className="items-center font-semibold text-xl mt-3">Name <span className="text-red-500 text-sm">*</span></label>
				<input id="name" placeholder="Activity Name" className="p-2 outline-none max-w-[414px] rounded-lg my-2" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }} required value={name} onChange={e => setName(e.target.value)} />

				<label htmlFor="location" className="items-center font-semibold text-xl mt-3">Location <span className="text-red-500 text-sm">*</span></label>
				<input id="location" placeholder="Enter Postal Code" className="p-2 outline-none max-w-[414px] rounded-lg my-2" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }} required value={postalCode} onChange={e => setPostalCode(e.target.value)} />
				{postalCodeError && <span className="text-sm text-red-500">{postalCodeError}</span>}

				<label htmlFor="tags" className="items-center font-semibold text-xl mt-3">Tags</label>
				<textarea id="tags" placeholder="Beginner-Friendly, Elderly-Friendly" className="p-2 outline-none max-w-[591px] h-[166px] rounded-lg mt-2 resize-none" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }} value={tags} onChange={e => setTags(e.target.value)} />
				<span className="my-2 text-sm italic">Separate each tag with a comma</span>

				<p className="font-semibold text-xl mt-3">Price Options</p>
				<table className="my-2 max-w-[591px] rounded mb-3" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
					<thead className="w-full border-b-2">
						<tr className="w-full">
							<th className="text-left text-lg pl-8 py-2">Option Name</th>
							<th className="text-left text-lg">Price (SGD)</th>
						</tr>
					</thead>
					<tbody className="w-full">
						<tr className="py-4 px-8 w-full">
							<td className="text-left text-lg pl-8 font-semibold">Adult</td>
							<td>
								<div className="flex flex-col my-3">
									<input placeholder="Enter price" className={`py-2 px-4 outline-none max-w-[192px] rounded-md border-2 ${adultPriceError.length > 0 ? "border-red-500" : ""}`} type="number" value={adultPrice} onChange={e => setAdultPrice(e.target.value)} />
									{adultPriceError && <span className="text-sm text-red-500">{adultPriceError}</span>}
								</div>
							</td>
						</tr>
						<tr className="py-4 px-8 w-full">
							<td className="text-left text-lg pl-8 font-semibold">Child</td>
							<td>
								<div className="flex flex-col my-3">
									<input placeholder="Enter price" className={`py-2 px-4 outline-none mb-1 max-w-[192px] rounded-md border-2 ${childPriceError.length > 0 ? "border-red-500" : ""}`} type="number" value={childPrice} onChange={e => setChildPrice(e.target.value)} />
									{childPriceError && <span className="text-sm text-red-500">{childPriceError}</span>}
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				<p className="font-semibold text-xl mt-3">Date and Time Slots</p>
				<div className="mt-3 max-w-[866px] p-4 px-7 rounded" style={{ boxShadow: "0px 1px 2px 2px rgba(0, 0, 0, 0.40)" }}>
					<div className="flex">
						<p className="font-semibold">Daily</p>
						<div className="relative bg-[#e5e5e5] border w-[50px] rounded-[10px] items-center flex justify-center border-gray-400 ml-6 mr-2 cursor-pointer" onClick={handleDaily}>
							<div className={`absolute w-[16px] h-[16px] ${isDaily ? "right-1" : "left-1"} rounded-full`} style={{ background: "linear-gradient(156deg, #8946FF 3.98%, #7B31FF 97.62%)" }} />
						</div>
						<p className="text-sm self-center font-semibold text-gray-400">{isDaily ? "ENABLED" : "DISABLED"}</p>
					</div>
					{!isDaily && <div className="mt-3 grid grid-cols-1 lg:grid-cols-2">
						<div className="flex flex-col">
							<label htmlFor="startingDate" className="text-lg font-semibold mb-1">Starting Date</label>
							<input id="startingDate" type="date" className={`max-w-[200px] outline-none cursor-pointer px-2 py-1 border rounded ${startingDateError.length > 0 ? "border-red-500" : ""}`} value={startingDate} max={endingDate} onChange={e => setStartingDate(e.target.value)} />
							{startingDateError && <span className="text-sm text-red-500">{startingDateError}</span>}
							<label htmlFor="endingDate" className="text-lg font-semibold mb-1 mt-4">Ending Date</label>
							<input id="endingDate" type="date" className="max-w-[200px] outline-none cursor-pointer px-2 py-1 border rounded" value={endingDate} min={startingDate} onChange={e => setEndingDate(e.target.value)} />
						</div>
						<div className="mt-4 lg:mt-0 flex flex-col justify-between">
							<p className="text-lg font-semibold mb-1">Time Slots</p>
							<div className="flex-grow mb-4 grid grid-cols-3 sm:grid-cols-3 gap-4">
								{timeslots.sort((a, b) => new Date(`1970-01-01T${a}:00`) - new Date(`1970-01-01T${b}:00`)).map(timeslot => {
									return <div key={timeslot.id} className="relative border-[#933EFF] border-2 py-1 max-w-[126px] h-fit text-center rounded-lg">
										<button className="absolute -top-[7px] right-1 w-[15px] h-[15px] bg-[#933EFF] rounded-full text-center items-center flex justify-center" type="button" onClick={e => removeTimeslot(timeslot.id)}>
											<span className="text-[10px] font-bold text-white">x</span>
										</button>
										<span className="font-bold text-[#933EFF]">{timeslot.timeslot.split(":").slice(0, 2).join(":")}</span>
									</div>;
								})}
							</div>
							{/* Adding a new timeslot */}
							<div className="flex flex-col sm:flex-row w-full sm:items-center">
								<div className="flex my-2">
									<input className="w-[40px] outline-none border rounded text-center px-1" placeholder="MM" min={0} max={23} maxLength={2} type="number" value={hour} onChange={e => setHour(e.target.value)} />
									<p className="mx-2 font-bold">:</p>
									<input className="w-[40px] outline-none border rounded mr-3 text-center px-1" placeholder="SS" min={0} max={59} maxLength={2} type="number" value={minute} onChange={e => setMinute(e.target.value)} />
								</div>
								<button type="button" className="text-white max-w-[119px] rounded-lg py-1 px-2" style={{ background: "linear-gradient(113deg, #EB4710 22.91%, #FBDA01 155.17%)", boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }} onClick={addTimeslot}>
									Add Time Slot
								</button>
							</div>
						</div>
					</div>}
				</div>

				<label htmlFor="description" className="items-center font-semibold text-xl mt-6">Add Description</label>
				<textarea id="description" placeholder="Enter description" className="p-2 outline-none max-w-[591px] h-[166px] rounded-lg mt-2 resize-none" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }} value={description} onChange={e => setDescription(e.target.value)} />

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

export default UpdateActivity;