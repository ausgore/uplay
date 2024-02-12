import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import axios from "axios";
import Image from "../assets/images/announcement.png"
import { useUser, useUserUpdate } from "../contexts/UserContext";

const Announcements = () => {
	const [announcements, setAnnouncements] = useState([]);
	const user = useUser();
	const updateUser = useUserUpdate();

	const [lastVisited, setLastVisited] = useState();

	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/announcement`);
			setAnnouncements(response.data);
		})();
	}, []);

	useEffect(() => {
		if (user) {
			setLastVisited(user.lastVisitedAnnouncements);
			(async () => {
				const response = await axios.post(`http://localhost:5021/user/update-last-visited-announcement/${user.id}`);
				updateUser(response.data);
			})();
		}
	}, []);

	return <>
		<Nav />
		<div className="max-w-[1300PX] mx-auto px-4 pt-32">
			<h1 className="font-bold text-2xl mb-14">Notification Centre</h1>
			{announcements?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(announcement => {
				return <div className="flex flex-row mb-8" key={announcement.id}>
					<img src={Image} alt="announcement" className={`w-[80px] h-[80px] ${new Date(lastVisited).getTime() >= new Date(announcement.createdAt).getTime() ? "grayscale" : ""}`} />
					<div className={`ml-4 ${new Date(lastVisited).getTime() >= new Date(announcement.createdAt).getTime() ? "text-[#8B8B8B]" : ""}`}>
						<h2 className={`font-bold text-lg mb-2`}>{announcement.title}</h2>
						<p>{announcement.description}</p>
						<p className="text-sm mt-4 font-medium">{new Date(announcement.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric"})} {new Date(announcement.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</p>
					</div>
				</div>
			})}
		</div>
	</>
}

export default Announcements;