import Logo from "../assets/images/logo.png";
import WholeKitchen from "../assets/images/kitchen.png";
import { Link, useNavigate } from "react-router-dom";
import FormError from "../components/FormError";
import { useState } from "react";
import axios from "axios";
import { useUserUpdate } from "../contexts/UserContext";

const SignUp = () => {
	const updateUser = useUserUpdate();
	const navigate = useNavigate();

	const today = new Date();
	const minDate = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate()).toISOString().split('T')[0];

	const [emailValue, setEmailValue] = useState("");
	const [emailError, setEmailError] = useState("");
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

		const response = await axios.post("http://localhost:5021/user/register", { email: emailValue, password: passwordValue }).catch(e => e.response);
		if (response.data.message) return setEmailError(response.data.message);

		setEmailError("");
		setPasswordError("");
		setConfirmPasswordError("");

		updateUser(response.data);
		alert(`Successfully registered new account ${emailValue}. Log into account first.`);
		navigate("/login");
	}

	return <>
		<div className="flex flex-row h-screen w-full">
			<section className="w-full h-full hidden lg:block">
				<img src={WholeKitchen} className="h-screen object-cover" />
			</section>
			<section className="w-screen h-full">
				<div className="px-8 md:px-10 md:pt-12 py-8 md:mt-8 flex flex-col justify-center items-center">
					<img src={Logo} className="w-32 lg:w-52" />
					<h1 className="font-bold text-2xl md:text-3xl mt-2 md:mt-9 mb-6 lg:mb-20">Sign Up</h1>
					<form className="w-full max-w-[600px]" onSubmit={onSubmit}>
						<table className="w-full">
							<tbody className="w-full">
								<tr className="flex flex-col md:table-row">
									<td>
										<div className="flex flex-col md:mr-12 pb-4">
											<label htmlFor="name" className="font-medium text-lg mb-1">Name</label>
											<div className="flex flex-row items-center">
												<input type="text" id="name" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" placeholder="John Doe" disabled />
												<FormError />
											</div>
										</div>
									</td>
									<td>
										<div className="flex flex-col pb-4">
											<label htmlFor="email" className="font-medium text-lg mb-1">Email</label>
											<div className="flex flex-row items-center">
												<input type="email" id="email" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" placeholder="john.doe@gmail.com" required value={emailValue} onChange={e => setEmailValue(e.target.value)} />
												<FormError errorMessage={emailError} />
											</div>
										</div>
									</td>
								</tr>
								<tr className="flex flex-col md:table-row">
									<td>
										<div className="flex flex-col md:mr-12 pb-4">
											<label htmlFor="phone" className="font-medium text-lg mb-1">Phone Number</label>
											<div className="flex flex-row items-center">
												<input type="phone" id="phone" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" placeholder="8123 4567" disabled />
												<FormError />
											</div>
										</div>
									</td>
									<td>
										<div className="flex flex-col pb-4">
											<label htmlFor="birthdate" className="font-medium text-lg mb-1">Date of Birth</label>
											<div className="flex flex-row items-center">
												<input type="date" id="birthdate" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" max={minDate} disabled />
												<FormError />
											</div>
										</div>
									</td>
								</tr>
								<tr className="flex flex-col md:table-row">
									<td>
										<div className="flex flex-col md:mr-12 pb-4">
											<label htmlFor="password" className="font-medium text-lg mb-1">Password</label>
											<div className="flex flex-row items-center">
												<input type="password" id="password" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" required value={passwordValue} onChange={e => setPasswordValue(e.target.value)} />
												<FormError errorMessage={passwordError} />
											</div>
										</div>
									</td>
									<td>
										<div className="flex flex-col pb-4">
											<label htmlFor="confirm_password" className="font-medium text-lg mb-1">Confirm Password</label>
											<div className="flex flex-row items-center">
												<input type="password" id="confirm_password" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" required value={confirmPasswordValue} onChange={e => setConfirmPasswordValue(e.target.value)} />
												<FormError errorMessage={confirmPasswordError} />
											</div>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<div className="w-full flex justify-center mt-12">
							<button type="submit" className="py-2 px-12 text-white font-bold text-lg" style={{
								borderRadius: "10px",
								background: "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)",
								boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
							}}>
								Sign Up
							</button>
						</div>
					</form>
					<p className="text-center mt-8 font-bold text-lg">Already have an account? <Link to="/login" className="text-[#8347eb]">Sign In</Link></p>
				</div>
			</section>
		</div>
	</>;
}

export default SignUp;