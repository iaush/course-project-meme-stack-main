import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";

/**
 * @typedef {Object} LogoutProps
 * @property {String} redirect
 * 
 * @param {LogoutProps} props
 * @returns 
 */
function Logout({ redirect }) {
    const navigate = useNavigate();
    const logout = useUserStore(state => state.logout);

    useEffect(() => {
        logout();
        navigate(redirect);
    }, [])
}


export default Logout;