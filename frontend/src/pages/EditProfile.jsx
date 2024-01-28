import { useEffect, useState } from "react";
import Nav from "../components/Nav"
import { useUser, useUserUpdate } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Construction from "../assets/images/construction.png";
import axios from "axios";

const EditProfile = () => {
	const navigate = useNavigate();
	const user = useUser();
	const updateUser = useUserUpdate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [birthDate, setBirthDate] = useState("");

	useEffect(() => {
		if (!user) navigate("/activities");
		setName(user?.name);
		setEmail(user?.email);
		setMobile(user?.mobileNumber);
		setBirthDate(user?.birthDate);
	}, [user]);

	const saveChanges = async () => {
		const response = await axios.put(`http://localhost:5021/user/update-user/${user?.id}`, {
			name,
			email,
			mobileNumber: mobile,
			birthDate: birthDate
		}).catch(e => e.response);
		updateUser(response.data);
		setName(response.data.name);
		setEmail(response.data.email);
		setMobile(response.data.mobileNumber);
		setBirthDate(response.data.birthDate);
		console.log(response.data);
		if (response.status == 200) return alert("Profile successfully updated.");
	}

	const today = new Date()
	const minDate = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate()).toISOString().split('T')[0];

	return <>
		<Nav disableSearch transparent />
		<div className="flex flex-row h-screen w-full">
			<section className="w-fit h-full hidden lg:block">
				<img src={Construction} className="h-screen object-cover" />
			</section>
			<section className="h-full pt-12 mx-auto">
				<div className="px-8 md:px-10 md:pt-12 py-8 md:mt-8 flex flex-col items-center">
					{/* Header */}
					<div className="flex mt-2 md:mt-9 mb-6 lg:mb-20">
						<h1 className="font-bold text-2xl md:text-3xl">Edit Profile</h1>
						<button className="ml-20 text-white font-bold px-4 rounded-lg" style={{ background: "linear-gradient(112deg, #EB4710 -1.37%, #FBDA01 192.46%)" }} onClick={saveChanges}>Save Changes</button>
					</div>
					<form className="mx-2 w-[380px] max-w-[340px]">
						<div className="flex flex-col pb-8">
							<label htmlFor="name" className="font-medium mb-1">Name</label>
							<div className="flex flex-row">
								<input type="text" id="name" className="border-b-[#933EFF] border-b-[3px] outline-none p-1 w-full" value={name} onChange={e => setName(e.target.value)} required />
							</div>
						</div>
						<div className="flex flex-col pb-8">
							<label htmlFor="email" className="font-medium mb-1">Email</label>
							<div className="flex flex-row">
								<input type="email" id="email" className="border-b-[#933EFF] border-b-[3px] outline-none p-1 w-full" value={email} onChange={e => setEmail(e.target.value)} required />
							</div>
						</div>
						<div className="flex flex-col pb-8">
							<label htmlFor="phone" className="font-medium mb-1">Phone Number</label>
							<div className="flex flex-row">
								<input type="number" id="phone" className="border-b-[#933EFF] border-b-[3px] outline-none p-1 w-full" value={mobile} onChange={e => setMobile(e.target.value)} required maxLength={8} minLength={8} />
							</div>
						</div>
						<div className="flex flex-col pb-8">
							<label htmlFor="birthdate" className="font-medium mb-1">Date of Birth</label>
							<div className="flex flex-row">
								<input type="date" id="birthdate" className="border-b-[#933EFF] border-b-[3px] outline-none p-1 w-full" value={birthDate.split("T")[0]} onChange={e => setBirthDate(e.target.value)} required max={minDate} />
							</div>
						</div>
					</form>
				</div>
			</section>
		</div>
	</>
}

export default EditProfile;