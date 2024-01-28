import Star from "../assets/images/star.png";
import BlankStar from "../assets/images/blankstar.png";
import { useEffect, useState } from "react";
import axios from "axios";

const Review = ({ review }) => {
	const [user, setUser] = useState();
	useEffect(() => {
		(async () => {
			const response = await axios.get(`http://localhost:5021/user`);
			const user = response.data.filter(u => u.id == review.userId)[0];
			setUser(user);
		})();
	}, [review]);

	return <div className="max-w-[800px] mb-10">
		<div className="flex">
			{/* Stars */}
			<img src={review.rating >= 1 ? Star : BlankStar} className="w-[20px] h-[20px] mr-1" />
			<img src={review.rating >= 2 ? Star : BlankStar} className="w-[20px] h-[20px] mr-1" />
			<img src={review.rating >= 3 ? Star : BlankStar} className="w-[20px] h-[20px] mr-1" />
			<img src={review.rating >= 4 ? Star : BlankStar} className="w-[20px] h-[20px] mr-1" />
			<img src={review.rating >= 5 ? Star : BlankStar} className="w-[20px] h-[20px] mr-1" />
		</div>
		{/* Text */}
		<p className="mt-2">{review.content}</p>
		{/* Name */}
		<p className="font-bold text-sm italic">{user?.name}</p>
	</div>
}

export default Review;