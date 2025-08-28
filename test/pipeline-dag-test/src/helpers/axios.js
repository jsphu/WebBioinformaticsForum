import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getAccessToken, getRefreshToken } from "../hooks/user.actions";

const axiosService = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosService.interceptors.request.use(async (config) => {
    /*
     *  Retrieving the access token from the localStorage
     *  and adding it to the headers of the request
     */
    config.headers.Authorization = `Bearer ${getAccessToken()}`;
    return config;
});

axiosService.interceptors.response.use(
    (res) => Promise.resolve(res),
    (err) => Promise.reject(err),
);

const refreshAuthLogic = async (failedRequest) => {
    return axios
        .post(
            "api/auth/refresh/",
            { refresh: getRefreshToken() },
            {
                baseURL: "http://localhost:8000",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
        .then((resp) => {
            const { access } = resp.data;
            let user = null;

            try {
                const auth = JSON.parse(localStorage.getItem("auth") || "{}");
                user = auth?.user || null;
            } catch (e) {
                console.error("Failed to read user data from localStorage", e);
            }

            // Update the failed request
            failedRequest.response.config.headers["Authorization"] =
                "Bearer " + access;

            // Store new access token while preserving user
            localStorage.setItem(
                "auth",
                JSON.stringify({
                    access,
                    user,
                }),
            );
        })
        .catch(() => {
            try {
                const auth = JSON.parse(localStorage.getItem("auth") || "{}");
                auth.access = null;
                localStorage.setItem("auth", JSON.stringify(auth));
            } catch (e) {
                console.error(
                    "Failed to update auth object in localStorage",
                    e,
                );
            }
        });
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export async function fetcher(url) {
    return await axiosService.get(url).then((res) => res.data);
}

export default axiosService;
