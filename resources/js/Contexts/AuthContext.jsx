import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { router } from "@inertiajs/react";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser }) => {
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        // If user data changes in Inertia, update it globally
        window.addEventListener("inertia:success", (event) => {
            if (event.detail?.page?.props?.auth?.user) {
                setUser(event.detail.page.props.auth.user);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
