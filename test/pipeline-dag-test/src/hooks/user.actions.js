import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosService, { baseURL } from "../helpers/axios";
import { useUser } from "./UserContext";

function useUserActions() {
    const navigate = useNavigate();
    const { setUser } = useUser();

    function setUserDataAndState(res) {
        const userData = {
            access: res.data.access,
            refresh: res.data.refresh,
            user: res.data.user,
        };
        localStorage.setItem("auth", JSON.stringify(userData));
        setUser(res.data.user);
    }

    function register(data) {
        return axios.post(`${baseURL}/api/auth/register/`, data).then((res) => {
            navigate("/sign-in", { state: { username: res.data.username } });
        });
    }

    function login(data) {
        return axios.post(`${baseURL}/api/auth/login/`, data).then((res) => {
            setUserDataAndState(res);
            navigate("/");
        });
    }

    function logout() {
        localStorage.removeItem("auth");
        setUser(null);
        navigate("/sign-in");
    }

    function edit(data, userId) {
        return axiosService
            .put(`${baseURL}/api/users/${userId}/`, data)
            .then((res) => {
                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        access: getAccessToken(),
                        refresh: getRefreshToken(),
                        user: res.data,
                    }),
                );
                setUser(res.data);
            });
    }

    return {
        login,
        register,
        logout,
        edit,
    };
}

function getUser() {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return auth?.user || {username: "anonymous"};
}
function getAccessToken() {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return auth?.access;
}
function getRefreshToken() {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return auth?.refresh;
}

export {
    useUserActions,
    getUser,
    getAccessToken,
    getRefreshToken,
};
