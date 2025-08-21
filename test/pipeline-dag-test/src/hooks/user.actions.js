import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios";

function useUserActions() {
    const navigate = useNavigate();
    const baseURL = "http://localhost:8000/api";

    function register(data) {
        return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
            setUserData(res);
            navigate("/");
        });
    }
    function login(data) {
        return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
            setUserData(res);
            navigate("/");
        });
    }
    function logout() {
        localStorage.removeItem("auth");
        navigate("/login");
    }

    function edit(data, userId) {
        return axiosService
            .patch(`${baseURL}/user/${userId}/`, data)
            .then((res) => {
                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        access: getAccessToken(),
                        refresh: getRefreshToken(),
                        user: res.data,
                    }),
                );
            });
    }

    return {
        login,
        register,
        logout,
        edit,
    };
}
function setUserData(res) {
    localStorage.setItem(
        "auth",
        JSON.stringify({
            access: res.data.access,
            refresh: res.data.refresh,
            user: res.data.user,
        }),
    );
}

function getUser() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth.user;
}
function getAccessToken() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth.access;
}
function getRefreshToken() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth.refresh;
}

export {
    useUserActions,
    getUser,
    getAccessToken,
    getRefreshToken,
    setUserData,
};
