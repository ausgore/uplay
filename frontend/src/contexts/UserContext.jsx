import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);
const UserUpdateContext = createContext(() => {});

export const useUser = () => useContext(UserContext);
export const useUserUpdate = () => useContext(UserUpdateContext);

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const updateUser = (user) => {
		setUser(user);
	}
	
	return <UserContext.Provider value={user}>
		<UserUpdateContext.Provider value={updateUser}>
			{children}
		</UserUpdateContext.Provider>
	</UserContext.Provider>;
}