import { useNavigate } from "react-router-dom"
import Nav from "../components/Nav"
import { useEffect, useState } from "react";
import axios from "axios";

const ManageActivities = () => {
	const navigate = useNavigate();
	const [activities, setActivities] = useState();
	useEffect(() => {
		(async () => {
			const response = await axios.get("http://localhost:5021/activity");
			setActivities(response.data);
		})();
	}, []);

	const deleteActivity = async (id) => {
		const response = await axios.delete(`http://localhost:5021/activity/delete/${id}`).catch(e => e.response);
		if (response.status != 200) return alert("There was an error trying to delete this activity.");
		const { data } = await axios.get("http://localhost:5021/activity");
		setActivities(data);
	}
	

	return <div>
		<Nav />
		<div className="max-w-[1300px] mx-auto px-4 pt-28">
			<div className="flex justify-between">
				<h1 className="font-bold text-3xl">Manage Activities</h1>
				<button className="rounded-lg text-white font-medium px-4 py-2 text-lg" style={{
					background: "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)",
					boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
				}} onClick={() => navigate("/create-activity")}>+ Add Activity</button>
			</div>
			<table className="mt-12 w-full rounded-lg" style={{ boxShadow: "0px 1px 2px 2px rgba(0, 0, 0, 0.50)" }}>
				<thead className="border-b-[3px] border-b-[#E6533F]">
					<tr>
						<td className="py-5 text-xl font-bold pl-6 w-[200px]">ActivityID</td>
						<td className="py-5 text-xl font-bold">Name</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{activities?.map((activity, index) => {
						return <tr className={`${index % 2 == 0 ? "bg-gray-50" : ""}`} id={activity.id}>
							<td className="pl-6 py-4 font-bold">{activity.id}</td>
							<td>{activity.name}</td>
							<td className="pr-6 py-4 flex justify-end items-center gap-2">
								<div className="flex gap-4">
									<button className="text-sm rounded-lg text-white font-medium px-4 py-2" style={{
										background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
										boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
									}} onClick={() => navigate(`/update-activity/${activity.id}`)}>Edit Details</button>
									<button onClick={() => deleteActivity(activity.id)} className="text-sm rounded-lg text-white font-medium px-4 py-2" style={{
										background: "linear-gradient(111deg, #FF2424 -1.39%, #580C0C 143.42%)",
										boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
									}}>Delete</button>
								</div>
							</td>
						</tr>
					})}
					<tr>
						
					</tr>
				</tbody>
			</table>
		</div>
	</div>
}

export default ManageActivities;