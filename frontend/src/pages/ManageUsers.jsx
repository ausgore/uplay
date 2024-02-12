import { useNavigate } from "react-router-dom"
import Nav from "../components/Nav"
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

const ManageUsers = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState();
	const user = useUser();
	useEffect(() => {
		(async () => {
			const response = await axios.get("http://localhost:5021/user");
			setUsers(response.data);
		})();
	}, []);

	const changeRole = async (id, role) => {
		await axios.post(`http://localhost:5021/user/update-user-role/${id}/${role}`);
		const response = await axios.get("http://localhost:5021/user");
		setUsers(response.data);
	}

	return <div>
		<Nav staff={true} />
		<div className="max-w-[1300px] mx-auto px-4 pt-28">
			<div className="flex justify-between">
				<h1 className="font-bold text-3xl">Manage Users</h1>
			</div>
			<table className="mt-12 w-full rounded-lg" style={{ boxShadow: "0px 1px 2px 2px rgba(0, 0, 0, 0.50)" }}>
				<thead className="border-b-[3px] border-b-[#E6533F]">
					<tr>
						<td className="py-5 text-xl font-bold pl-6">UserID</td>
						<td className="py-5 text-xl font-bold">Full Name</td>
						<td className="py-5 text-xl font-bold">Email</td>
						<td className="py-5 text-xl font-bold">HP Number</td>
						<td className="py-5 text-xl font-bold">User Role</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{users?.map((thisUser, index) => {
						return <tr className={`${index % 2 == 0 ? "bg-gray-50" : ""}`} key={thisUser.id}>
							<td className="pl-6 py-4 font-bold">{thisUser.id}</td>
							<td>{thisUser.name}</td>
							<td>{thisUser.email}</td>
							<td>+65 {thisUser.mobileNumber}</td>
							<td>
								{thisUser.id == 1 ? "Admin" : user.role == "Staff" ? thisUser.role : <select className="cursor-pointer outline-none" value={thisUser.role} onChange={(e) => changeRole(thisUser.id, e.target.value)}>
									<option value={thisUser.role}>{thisUser.role}</option>
									<option value={thisUser.role == "Staff" ? "User" : "Staff"}>{thisUser.role == "Staff" ? "User" : "Staff"}</option>
								</select>}
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

export default ManageUsers;