import { useNavigate, useSearchParams } from "react-router-dom"

const CategoryButton = ({ cat, setFilterShown }) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const search = searchParams.get("search");
	const category = searchParams.get("category");

	return <button onClick={() => {
		navigate(`/activities?${search ? `search=${search}` : ""}${cat ? `${search ? "&" : ""}category=${cat}` : ""}`);
		setFilterShown(false);
	}} className={`font-semibold p-2 text-sm rounded-full ${!cat && !category ? "bg-red-600 text-white" : cat && category && cat == category ? "bg-red-600 text-white" : "bg-yellow-300"}`} style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}>
		{cat ? cat : "All Categories"}
	</button>
}

export default CategoryButton;