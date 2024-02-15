import React, { useState, useEffect } from 'react';
import Nav from "../components/Nav";
import Amusement from "../assets/images/landing/amusement.png";
import Golfing from "../assets/images/landing/golfing.png";
import Beach from "../assets/images/landing/beach.png";
import { useNavigate } from "react-router-dom";
import ActivityCard from "../components/ActivityCard";
import axios from "axios";
import Chatbot from "./Chatbot/Chatbot";

const images = [Amusement, Golfing, Beach];
const texts = ["Amusement Park", "Golf Course", "Beach Party"];

const Home = () => {
	const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * 3));
	const [fade, setFade] = useState(true);
	const [search, setSearch] = useState("");
	const [activities, setActivities] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/activity`);
			setActivities(response.data);
			console.log(response.data);
		})();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setFade(false);
			setTimeout(() => {
				setCurrentIndex((currentIndex + 1) % images.length);
				setFade(true);
			}, 500);
		}, 15000);

		return () => clearInterval(interval);
	}, [currentIndex]);

	const handleEnterSearch = e => {
		if (e.key == "Enter") navigate(`/activities?search=${search}`);
	}
	return (
		<>
			<Nav disableSearch withShadow />
			<div className={`h-[850px] w-full transition-opacity duration-1000 ease-in-out ${fade ? "opacity-100" : "opacity-0"} flex justify-center items-center`} style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "bottom", backgroundImage: `url(${images[currentIndex]})`, boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}>
				<div>
					<h1 className="text-3xl font-bold text-left mb-2">Let's find a ...</h1>
					<div className="relative items-center flex">
						<input type="text" placeholder={texts[currentIndex]} className="py-3 px-4 w-[500px] rounded-lg outline-none text-lg" style={{ boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.30)" }} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleEnterSearch} />
						<button onClick={() => navigate(`/activities?search=${search}`)} className="absolute right-4 text-white font-semibold px-5 py-1 rounded-lg" style={{ background: "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)", boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}>
							Search
						</button>
					</div>
				</div>
			</div>
			<div className="max-w-[1400px] mx-auto px-4 pt-32 mb-20">
				<h1 className="text-2xl font-bold mb-10">Here's our recommendations</h1>
				<div className="grid grid-cols-4 gap-16 gap-y-14">
					{activities?.sort((a, b) => {
						const bAverage = (b.reviews.reduce((x, r) => x + r.rating, 0) / b.reviews.length);
						const aAverage = (a.reviews.reduce((x, r) => x + r.rating, 0) / a.reviews.length);
						if (b.reviews.length == a.reviews.length && bAverage == aAverage) return b.reviews.length - a.reviews.legnth;
						return bAverage - aAverage;
					}).map(activity => <ActivityCard hideTags key={activity.id} activity={activity} />).splice(0, 8)}
				</div>
			</div>
			<Chatbot />
		</>
	);
};

export default Home;