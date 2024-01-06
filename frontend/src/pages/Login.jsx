import Logo from "../assets/images/logo.png";
import Dance from "../assets/images/dance.png";

const Login = () => {
	const today = new Date();
	const minDate = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate()).toISOString().split('T')[0];

	return <>
		<div className="flex flex-row h-screen w-full">
			<section className="w-full h-full hidden lg:block">
				<img src={Dance} className="h-screen object-cover" />
			</section>
			<section className="w-screen h-full">
				<div className="px-8 md:px-10 md:pt-12 py-8 md:mt-8 flex flex-col justify-center items-center">
					<img src={Logo} className="w-32 lg:w-52" />
					<h1 className="font-bold text-2xl md:text-3xl mt-2 md:mt-9 mb-6 lg:mb-20">Login</h1>
					<form className="w-full max-w-[600px] lg:px-20">
						<div className="flex flex-col pb-8">
							<label htmlFor="email" className="font-medium text-lg mb-1">Email</label>
							<div className="flex flex-row items-center">
								<input type="email" id="email" className="border-b-[#E6533F] border-b-[3px] outline-none p-1 w-full" placeholder="john.doe@gmail.com" />
								<p className="ml-1 hidden">O</p>
							</div>
						</div>
						<div className="flex flex-col pb-8">
							<label htmlFor="password" className="font-medium text-lg mb-1">Password</label>
							<div className="flex flex-row items-center">
								<input type="password" id="password" className="border-b-[#E6533F] border-b-[3px] outline-none p-1 w-full" />
								<p className="ml-1 hidden">O</p>
							</div>
						</div>
						<div className="flex justify-between pb-8">
							<div>
								<input type="checkbox" id="rememberMe" />
								<label className="ml-4 font-medium" htmlFor="rememberMe">Remember Me?</label>
							</div>
							<a className="text-[#EB4710] underline-offset-1 underline font-medium">Forgot Password?</a>
						</div>
						<div className="flex justify-center mt-12">
							<button className="py-2 px-12 text-white font-bold text-lg" style={{
								borderRadius: "10px",
								background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
								boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
							}}>
								Log In
							</button>
						</div>
					</form>
					<p className="text-center mt-8 font-bold text-lg">Don't have an account? <a className="text-[#EB4710]">Sign Up</a></p>
				</div>
			</section>
		</div>
	</>;
}

export default Login;