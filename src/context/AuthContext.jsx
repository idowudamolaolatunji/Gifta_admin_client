import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
	const [admin, setAdmin] = useState(() =>
		Cookies.get("admin") ? JSON.parse(Cookies.get("admin")) : null,
	);
	const [token, setToken] = useState(Cookies.get("token") || null);
	const [refetchHelp, setRefetchHelp] = useState(false);

	// FUNCTION TO REFETCH
	const handleRefetchHelp = () => {
		setRefetchHelp(!refetchHelp);
	};

	const handleChange = (admin, token ) => {
		setAdmin(admin);
		setToken(token);
	};

	const handleAdmin = (admin) => {
		setAdmin(admin);
	};

	const logout = async () => {
		try {
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/logout`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if(!res.ok) throw new Error('Something went wrong!');
			const data = await res.json();

			if(data.status !== 'success') throw new Error(data.message);
			Cookies.remove("admin");
			Cookies.remove("token");
		} catch (err) {
			console.log(err.message)
			Cookies.remove("admin");
			Cookies.remove("token");
		}
	};

	useEffect(() => {
		Cookies.set("admin", JSON.stringify(admin), { expires: 365 });
		Cookies.set("token", token, { expires: 365 });
	}, [admin, token]);

	let contextData = {
		admin: admin,
		token: token,
		handleChange,
		handleAdmin,
		logout,
		refetchHelp,
		handleRefetchHelp,
	};

	return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

