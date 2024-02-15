import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Nav from "../components/Nav"
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import ActivityCard from "../components/ActivityCard";
import Chatbot from "./Chatbot/Chatbot";
import Filter from "../assets/images/filter.png";
import CategoryButton from "../components/CategoryButton";
import RatingButton from "../components/RatingButton";

const Activities = () => {
	const [activities, setActivities] = useState([]);

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const search = searchParams.get("search");
	const category = searchParams.get("category");

	const [filterShown, setFilterShown] = useState(false);

	const [tags, setTags] = useState([]);
	const [tagsToFilter, setTagsToFilter] = useState([]);
	const [minPrice, setMinPrice] = useState();
	const [maxPrice, setMaxPrice] = useState();
	const [rating, setRating] = useState();

	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/activity/get-unique-tags`);
			setTags(response.data);
		})();
		(async () => {
			const response = await axios.get("http://localhost:5021/activity");
			setActivities(response.data);
		})();
	}, []);

	const clearRating = () => {
		setTagsToFilter([]);
		setMinPrice("");
		setMaxPrice("");
		setRating("");
	}


	return <>
		<Nav setFilterShown={setFilterShown} />
		<div className="max-w-[1400px] mx-auto px-4 pt-32">
			{/* Categories */}
			<div className="grid grid-cols-6 max-w-[1050px] mx-auto gap-4">
				<CategoryButton setFilterShown={setFilterShown} />
				<CategoryButton setFilterShown={setFilterShown} cat="Dine and Wine" />
				<CategoryButton setFilterShown={setFilterShown} cat="Family Bonding" />
				<CategoryButton setFilterShown={setFilterShown} cat="Hobbies and Wellness" />
				<CategoryButton setFilterShown={setFilterShown} cat="Sports and Adventure" />
				<CategoryButton setFilterShown={setFilterShown} cat="Travel" />
			</div>
			<div className={`flex ${search ? "justify-between" : "justify-end"} my-8`}>
				{search && <div className="items-center flex">
					<h1 className="text-2xl font-bold">Results for "{search}"</h1>
					<Link to="/activities" className="font-bold text-lg text-red-700 ml-4 cursor-pointer">x</Link>
				</div>}
				{/* Filter */}
				<div className="relative">
					<button className="flex justify-center items-center bg-[#FFBC97] w-[140px] h-[40px] rounded-lg" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }} onClick={() => setFilterShown(true)}>
						<img src={Filter} className="w-[22px] h-[22px]" />
						<span className="ml-2 font-medium">Filter</span>
					</button>
					{/* Filter Box */}
					{filterShown && <div className="absolute w-[1200px] right-0 top-0 bg-[#FFE7DA] rounded-lg p-6" style={{ boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.40)" }}>
						<div className="flex items-center justify-between">
							<h1 className="font-bold text-2xl mb-6">Filter</h1>
							<button className="font-bold cursor-pointer" onClick={() => setFilterShown(false)}>X</button>
						</div>
						{/* First row */}
						<div className="flex gap-16">
							{/* Price range */}
							<div className="w-1/2">
								<h2 className="font-bold">Price Range</h2>
								<hr className="my-6 border-[#4E4E4E]" />
								<div className="flex items-center justify-between">
									<div className="flex">
										<input type="number" className="p-1 px-4 rounded-lg outline-none w-[140px]" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
										<p className="mx-3 font-bold text-2xl"> - </p>
										<input type="number" className="p-1 px-4 rounded-lg outline-none w-[140px]" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
									</div>
									<button className="text-white text-sm px-3 py-1 rounded-lg bg-[#838383]" onClick={() => {
										setMinPrice("");
										setMaxPrice("");
									}}>Reset</button>
								</div>
							</div>
							{/* Tags */}
							<div className="w-1/2">
								<h2 className="font-bold">Tags</h2>
								<hr className="my-6 border-[#4E4E4E]" />
								<div className="flex flex-wrap gap-4">
									{tags.map(tag => (<div key={tag} className={`${tagsToFilter.includes(tag) ? `bg-white text-[#EB4710] border-[#EB4710]` : "bg-[#CFCFCF] border-[#CFCFCF]"} border-2 rounded-3xl font-bold text-center text-xs px-4 py-1 cursor-pointer`} style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }} onClick={() => {
										if (!tagsToFilter.includes(tag)) setTagsToFilter([...tagsToFilter, tag]);
										else setTagsToFilter(tagsToFilter.filter(t => t !== tag));
									}}>{tag}</div>))}
								</div>
							</div>
						</div>
						{/* Second row */}
						<div className="mt-12">
							<div className="w-1/2">
								<h2 className="font-bold">Reviews</h2>
								<hr className="my-6 border-[#4E4E4E]" />
								<div className="grid grid-cols-1 w-[205px] gap-4">
									<RatingButton rating={rating} btnRating={5} setRating={setRating} />
									<RatingButton rating={rating} btnRating={4} setRating={setRating} />
									<RatingButton rating={rating} btnRating={3} setRating={setRating} />
									<RatingButton rating={rating} btnRating={2} setRating={setRating} />
									<RatingButton rating={rating} btnRating={1} setRating={setRating} />
								</div>
							</div>
						</div>
						{/* Third row */}
						<div className="flex justify-end gap-4">
							<button className="bg-[#838383] text-white w-[110px] py-1 rounded-lg" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }} onClick={clearRating}>Clear Filters</button>
							<button className="text-white w-[110px] py-1 rounded-lg font-medium" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", background: "linear-gradient(114deg, #933EFF -3.16%, #BA93FF 130.28%)" }} onClick={() => setFilterShown(false)}>Apply</button>
						</div>
					</div>}
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
				{activities?.filter(a => {
					return (search ? a.name.toLowerCase().includes(search) : true) 
						&& (category ? a.category == category : true) 
						&& (rating ? a.reviews.reduce((a, r) => a + r.rating, 0) == rating : true)
						&& (tags.length > 0 ? tagsToFilter.every(tag => a.tags.map(t => t.content).includes(tag)) : true)
						&& (minPrice > 0 ? a.childPrice >= minPrice || a.adultPrice >= minPrice : true)
						&& (maxPrice > 0 ? a.childPrice <= maxPrice || a.adultPrice <= maxPrice : true)
				}).map(activity => <ActivityCard key={activity.id} activity={activity} />)}
			</div>
		</div>
		<Chatbot />
	</>
}

export default Activities;