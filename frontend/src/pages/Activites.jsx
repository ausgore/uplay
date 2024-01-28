import { useNavigate, useSearchParams } from "react-router-dom";
import Nav from "../components/Nav"
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import ActivityCard from "../components/ActivityCard";
import Chatbot from "./Chatbot/Chatbot";

const Activities = () => {
	const user = useUser();
	const [activities, setActivities] = useState([]);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const search = searchParams.get("search");

	useEffect(() => {
		(async () => {
			const response = await axios.get("http://localhost:5021/activity");
			setActivities(response.data);
		})();
	}, []);

	return <>
		<Nav />
		<div className="max-w-[1400px] mx-auto px-4 pt-32">
			{search && <h1 className="my-8 text-2xl font-bold">Results for "{search}"</h1>}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
				{activities.filter(a => search ? a.name.includes(search) : true).map(activity => <ActivityCard key={activity.id} activity={activity} />)}
			</div>
		</div>
		<Chatbot/>
	</>
}

export default Activities;