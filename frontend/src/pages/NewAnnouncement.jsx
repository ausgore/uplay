import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const NewAnnouncement = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const navigate = useNavigate();

	const onSubmit = async e => {
		e.preventDefault();
		await axios.post(`http://localhost:5021/announcement/create`, { title, description });
		alert("Successfully added news!");
		navigate("/manage-activities");
	}

	return <div>
		<Nav staff={true} />
		<div className="max-w-[1300px] mx-auto px-4 pt-28">
			<h1 className="font-bold text-3xl">New Announcement</h1>

			<form className="mt-6 flex flex-col" onSubmit={onSubmit}>
				{/* Title */}
				<label htmlFor="title" className="items-center font-semibold text-xl mt-6">Title <span className="text-red-500 text-sm">*</span></label>
				<input id="title" placeholder="Enter title" className="p-2 outline-none max-w-[414px] rounded-lg my-2" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }} required value={title} onChange={e => setTitle(e.target.value)} />

				{/* Description */}
				<label htmlFor="description" className="items-center font-semibold text-xl mt-6">Description</label>
				<textarea id="description" placeholder="Enter description" className="p-2 outline-none max-w-[591px] h-[166px] rounded-lg mt-2 resize-none" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }} value={description} onChange={e => setDescription(e.target.value)} />

				<button className="rounded-lg w-[200px] h-[40px] text-white font-semibold mt-6" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", background: "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)" }} type="submit">Create Announcement</button>
			</form>
		</div>
	</div>
}

export default NewAnnouncement;