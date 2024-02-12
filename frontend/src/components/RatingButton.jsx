import Star from "../assets/images/star.png";
import BlankStar from "../assets/images/blankstar.png";


const RatingButton = ({ rating, btnRating, setRating }) => {
	return <button className={`${rating == btnRating ? "border-[#ed8a19] bg-white" : "border-[#CFCFCF] bg-[#CFCFCF]"} border-2 px-4 py-[5.5px] rounded-lg outline-none`} style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }} onClick={() => {
		if (rating == btnRating) setRating(null);
		else setRating(btnRating);
	}}>
		<div className="flex flex-row items-center">
			<img src={btnRating >= 1 ? Star : BlankStar} className="w-[15px] h-[15px] mr-1" />
			<img src={btnRating >= 2 ? Star : BlankStar} className="w-[15px] h-[15px] mr-1" />
			<img src={btnRating >= 3 ? Star : BlankStar} className="w-[15px] h-[15px] mr-1" />
			<img src={btnRating >= 4 ? Star : BlankStar} className="w-[15px] h-[15px] mr-1" />
			<img src={btnRating >= 5 ? Star : BlankStar} className="w-[15px] h-[15px] mr-2" />
			<p className={`text-sm font-semibold ${rating == btnRating ? "text-[#ed8a19]" : ""}`}>and above</p>
		</div>
	</button>
}

export default RatingButton;