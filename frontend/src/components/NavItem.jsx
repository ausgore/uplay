import { useNavigate } from "react-router-dom"

const NavItem = ({ staff, to, children, onClick }) => {
	const navigate = useNavigate()
	return <li className={`py-1 px-2 ${staff ? "hover:bg-[#a673ff]" : "hover:bg-[#d7d7d7]"} w-full cursor-pointer`} onClick={() => onClick ? onClick() : navigate(to)}>{children}</li>
}

export default NavItem;