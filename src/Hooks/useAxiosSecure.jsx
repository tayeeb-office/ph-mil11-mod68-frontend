import { useEffect, useMemo } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useContext(AuthContext);

  const axiosSecure = useMemo(() => {
    return axios.create({
      baseURL: "https://ph-mil11-mod68-backend.vercel.app",
    });
  }, []);

  useEffect(() => {
    const auth = getAuth();

    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        try {
          const token = await auth.currentUser?.getIdToken(true); // force refresh
          if (token) {
            config.headers = config.headers || {};
            config.headers.authorization = `Bearer ${token}`;
          }
        } catch (err) {
          console.error("Token attach failed:", err);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          try {
            if (logOut) await logOut();
          } catch (e) {
            console.error("Logout failed:", e);
          } finally {
            navigate("/login"); 
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [axiosSecure, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
