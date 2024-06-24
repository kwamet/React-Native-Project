import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setUser(res);
                    setIsLoggedIn(true);
                }else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <GlobalContext.Provider 
        value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

