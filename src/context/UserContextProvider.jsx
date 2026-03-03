import { useState } from "react";
import { UserContext } from "./UserContext";

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    function saveUser(userData) {
        console.log("Saving user:", userData); 
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    function logout() {
        setUser(null);
        localStorage.removeItem("user");
    }

    return (
        <UserContext.Provider value={{ user, saveUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}
