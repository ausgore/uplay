import Logo from "../assets/images/logo.png";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FormError from "../components/FormError";
import axios from "axios";
import { useUserUpdate } from "../contexts/UserContext";

const ResetPassword = () => {
	const navigate = useNavigate();
	const updateUser = useUserUpdate();
	const { token } = useParams();
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email"); 

	const [passwordValue, setPasswordValue] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");

	const onSubmit = async e => {
		e.preventDefault();

		if (passwordValue != confirmPasswordValue) {
			setPasswordError("Passwords do not match.");
			return setConfirmPasswordError("Passwords do not match.");
		}

		setPasswordError("");
		setConfirmPasswordError("");

		// Change password and update databse
		const response = await axios.post("http://localhost:5021/user/reset-password", { email, newPassword: passwordValue, resetCode: token }).catch(e => e.response);
		// If it for some reason didn't work
		if (response.status != 200) alert("An error has occured. Please try again.");
		else {
			alert("Successfully changed password. Please log in again.");
			// Remove user from contexdt so they will have to log in again
			updateUser(null);
		}

		return navigate("/login");
	};

	return <div className="flex justify-center pt-12 flex-col items-center">
		<img src={Logo} className="w-32" />
		<h1 className="text-2xl font-bold mt-6 mb-3">Reset Account Password</h1>
		<p className="text-lg mb-12 font-bold">Enter your new password</p>
		<form className="mx-2" onSubmit={onSubmit}>
			<div className="flex flex-col pb-8">
				<label htmlFor="password" className="font-medium mb-1">New Password</label>
				<div className="flex flex-row items-center">
					<input type="password" id="password" className="border-b-[#E6533F] border-b-[3px] outline-none p-1 w-full" value={passwordValue} onChange={e => setPasswordValue(e.target.value)} required />
					<FormError errorMessage={passwordError} />
				</div>
			</div>
			<div className="flex flex-col pb-8">
				<label htmlFor="password" className="font-medium mb-1">Confirm New Password</label>
				<div className="flex flex-row items-center">
					<input type="password" id="password" className="border-b-[#E6533F] border-b-[3px] outline-none p-1 w-full" value={confirmPasswordValue} onChange={e => setConfirmPasswordValue(e.target.value)} required />
					<FormError errorMessage={confirmPasswordError} />
				</div>
			</div>
			<div className="flex justify-center mt-12">
				<button type="submit" className="py-2 px-12 text-white font-bold text-lg" style={{
					borderRadius: "10px",
					background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
					boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
				}}>
					Change Password
				</button>
			</div>
		</form>
	</div>;
}

export default ResetPassword;