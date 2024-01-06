import Logo from "../assets/images/logo.png";
import WholeKitchen from "../assets/images/kitchen.png";

const SignUp = () => {
	const today = new Date();
	const minDate = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate()).toISOString().split('T')[0];

	return <>
		<div className="flex flex-row h-screen w-full">
			<section className="w-full h-full hidden lg:block">
				<img src={WholeKitchen} className="h-screen object-cover" />
			</section>
			<section className="w-screen h-full">
				<div className="px-8 md:px-10 md:pt-12 py-8 md:mt-8 flex flex-col justify-center items-center">
					<img src={Logo} className="w-32 lg:w-52" />
					<h1 className="font-bold text-2xl md:text-3xl mt-2 md:mt-9 mb-6 lg:mb-20">Sign Up</h1>
					<form className="w-full max-w-[600px]">
						<table className="w-full">
							<tr className="flex flex-col md:table-row">
								<td>
									<div className="flex flex-col md:mr-12 pb-4">
										<label htmlFor="name" className="font-medium text-lg mb-1">Name</label>
										<div className="flex flex-row items-center">
											<input type="text" id="name" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" placeholder="John Doe" />
											<p className="ml-1 hidden">O</p>
										</div>
									</div>
								</td>
								<td>
									<div className="flex flex-col pb-4">
										<label htmlFor="email" className="font-medium text-lg mb-1">Email</label>
										<div className="flex flex-row items-center">
											<input type="email" id="email" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" placeholder="john.doe@gmail.com" />
											<p className="ml-1 hidden">O</p>
										</div>
									</div>
								</td>
							</tr>
							<tr className="flex flex-col md:table-row">
								<td>
									<div className="flex flex-col md:mr-12 pb-4">
										<label htmlFor="phone" className="font-medium text-lg mb-1">Phone Number</label>
										<div className="flex flex-row items-center">
											<input type="phone" id="phone" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" placeholder="8123 4567" />
											<p className="ml-1 hidden">O</p>
										</div>
									</div>
								</td>
								<td>
									<div className="flex flex-col pb-4">
										<label htmlFor="birthdate" className="font-medium text-lg mb-1">Date of Birth</label>
										<div className="flex flex-row items-center">
											<input type="date" id="birthdate" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" max={minDate} />
											<p className="ml-1 hidden">O</p>
										</div>
									</div>
								</td>
							</tr>
							<tr className="flex flex-col md:table-row">
								<td>
									<div className="flex flex-col md:mr-12 pb-4">
										<label htmlFor="password" className="font-medium text-lg mb-1">Password</label>
										<div className="flex flex-row items-center">
											<input type="password" id="password" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" />
											<p className="ml-1 hidden">O</p>
										</div>
									</div>
								</td>
								<td>
									<div className="flex flex-col pb-4">
										<label htmlFor="confirm_password" className="font-medium text-lg mb-1">Confirm Password</label>
										<div className="flex flex-row items-center">
											<input type="password" id="confirm_password" className="border-b-[#BA93FF] border-b-[3px] outline-none p-1 w-full" />
											<p className="ml-1 hidden">O</p>
										</div>
									</div>
								</td>
							</tr>
						</table>
						<div className="w-full flex justify-center mt-12">
							<button className="py-2 px-12 text-white font-bold text-lg" style={{
								borderRadius: "10px",
								background: "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)",
								boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
							}}>
								Sign Up
							</button>
						</div>
					</form>
				</div>
			</section>
		</div>
	</>;
}

export default SignUp;