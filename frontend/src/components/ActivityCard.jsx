import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Star from "../assets/images/star.png";

const ActivityCard = ({ activity }) => {
	const [file, setFile] = useState("");
	const navigate = useNavigate();
	useEffect(() => {
		(async () => {
			if (activity) {
				const response = await axios.get(`http://localhost:5021/activity/file/${activity.id}`, { responseType: "arraybuffer" });
				const buffer = new Uint8Array(response.data);
				let binary = "";
				const bytes = new Uint8Array(buffer);
				for (const byte of bytes) binary += String.fromCharCode(byte);
				setFile(`data:image/png;base64,${btoa(binary)}`);
			}
		})();
	}, [activity]);

	return <div key={activity.id}>
		<div className="cursor-pointer" onClick={() => navigate(`/activities/${activity.id}`)}>
			{/* Image */}
			<div className="aspect-[16/9] max-w-[719px]">
				<img src={file} alt="activity_image" className="object-cover w-full h-full rounded-lg" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.60)" }} />
			</div>
			{/* Title */}
			<h1 className="mt-3 lg:my-3 font-bold md:text-lg lg:text-xl">{activity.name}</h1>
		</div>
		{/* First Row */}
		<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
			{/* Date for mobile */}
			<div className="min-w-max self-start block lg:hidden mb-2">
				<p className="text-[#737373] font-semibold text-sm">{activity.isDaily ? "Daily" : "1 Apr - 5 Apr"}</p>
			</div>
			{/* Tag Wrapper */}
			{activity.tags.filter(t => t.content.length).length > 0 && <div className="flex flex-wrap gap-4">
				{activity.tags.filter(t => t.content.length).map(tag => (<div key={tag.id} className="bg-[#FFBC97] rounded-3xl text-[#EB4710] font-semibold text-center text-xs py-2 px-3" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}>{tag.content}</div>))}
			</div>}
			{/* Date for web */}
			<div className="min-w-max self-start hidden lg:block">
				<p className="text-[#737373] font-semibold text-sm">{activity.isDaily ? "Daily" : `${new Date(activity?.startingAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${activity?.endingAt ? ` - ${new Date(activity?.endingAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}`}</p>
			</div>
		</div>
		{/* Second Row */}
		{activity.reviews.length > 0 && <div className="flex items-center mt-4">
			<div className="w-[17px] h-[17px]">
				<img src={Star} />
			</div>
			<p className="text-[#ED8A19] font-bold mx-1">{(activity?.reviews.reduce((a, b) => a + b.rating, 0) / activity?.reviews.length).toFixed(1)}</p>
			<p className="text-[#5F5F5F] font-semibold italic text-sm">({activity.reviews.length})</p>
		</div>}
		{/* Third Row */}
		<div className="flex justify-between mt-2">
			<p className="text-2xl font-semibold">S$ {((activity.childPrice ? activity.childPrice : activity.adultPrice) ?? 0).toFixed(2)}</p>
			<button type="button" onClick={() => navigate(`/activities/${activity.id}`)} className="rounded-lg text-white font-semibold max-w-[189px] px-4" style={{
				background: "linear-gradient(102deg, #EB4710 25.27%, #F8BA05 93.93%)",
				boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
			}}>Buy Now</button>
		</div>
	</div>
}

export default ActivityCard;
