import Logo from "../assets/images/logo.png";
import Dance from "../assets/images/dance.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useUserUpdate } from "../contexts/UserContext";

const Login = () => {
	const updateUser = useUserUpdate();
	const navigate = useNavigate();

	const [emailValue, setEmailValue] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordValue, setPasswordValue] = useState("");
	const [passwordError, setPasswordError] = useState("");

	
	const onSubmit = async e => {
		e.preventDefault();
		
		const response = await axios.post("http://localhost:5021/user/login", { email: emailValue, password: passwordValue }).catch(e => e.response);
		if (response.data.message) {
			setEmailError(response.data.message);
			return setPasswordError(response.data.message);
		}

		setEmailError("");
		setPasswordError("");
		
		updateUser(response.data);
		alert(`Successfully logged in as ${response.data.email}`);
		navigate("/activities");
	}

	const forgotPassword = async e => {
		setPasswordError("");

		if (!emailValue.length) return setEmailError("Please enter the email of the account you can't log into.");
		const response = await axios.post(`http://localhost:5021/user/forget-password?email=${emailValue}`).catch(e => e.response);
		if (response.data.message) return setEmailError("We can't seem to find an account under that email address.");

		setEmailError("");

		console.log(response.data);
		alert(`We have sent a link to ${emailValue} (DEBUG Immediate Redirect: ${response.data.resetCode})`);
		navigate(`/reset-password/${response.data.resetCode}?email=${encodeURIComponent(emailValue)}`);
	}

	return <>
		<div className="flex flex-row h-screen w-full">
			<section className="w-full h-full hidden lg:block">
				<img src={Dance} className="h-screen object-cover" />
			</section>
			<section className="w-screen h-full">
				<div className="px-8 md:px-10 md:pt-12 py-8 md:mt-8 flex flex-col justify-center items-center">
					<img src={Logo} className="w-32 lg:w-52" />
					<h1 className="font-bold text-2xl md:text-3xl mt-2 md:mt-9 mb-6 lg:mb-20">Login</h1>
					<form className="w-full max-w-[600px] lg:px-20" onSubmit={onSubmit} >
						<div className="flex flex-col pb-8">
							<label htmlFor="email" className="font-medium text-lg mb-1">Email</label>
							<div className="flex flex-col">
								<input type="email" id="email" className="border-b-[#E6533F] border-b-[3px] outline-none p-1 w-full" value={emailValue} onChange={e => setEmailValue(e.target.value)} required />
								<span className="text-sm italic text-red-500">{emailError}</span>
							</div>
						</div>
						<div className="flex flex-col pb-8">
							<label htmlFor="password" className="font-medium text-lg mb-1">Password</label>
							<div className="flex flex-col">
								<input type="password" id="password" className="border-b-[#E6533F] border-b-[3px] outline-none p-1 w-full" value={passwordValue} onChange={e => setPasswordValue(e.target.value)} required />
								<span className="text-sm italic text-red-500">{passwordError}</span>
							</div>
						</div>
						<div className="flex justify-between pb-8">
							<div>
								<input type="checkbox" id="rememberMe" />
								<label className="ml-4 font-medium" htmlFor="rememberMe">Remember Me?</label>
							</div>
							<a className="text-[#EB4710] underline-offset-1 underline font-medium cursor-pointer" onClick={forgotPassword}>Forgot Password?</a>
						</div>
						<div className="flex justify-center mt-12">
							<button type="submit" className="py-2 px-12 text-white font-bold text-lg" style={{
								borderRadius: "10px",
								background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
								boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
							}}>
								Log In
							</button>
						</div>
					</form>
					<p className="text-center mt-8 font-bold text-lg">Don't have an account? <Link to="/" className="text-[#EB4710]">Sign Up</Link></p>
				</div>
			</section>
		</div>
	</>;
}

export default Login;