// ...existing code...
import { useContext, useEffect, useMemo } from "react"
import { AuthContext } from "../utlities/providers/AuthProvider"
import { useNavigate } from "react-router-dom"
import axios from "axios"


const useAxiosSecure = () => {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate();

    // create stable axios instance
    const axiosSecure = useMemo(() => axios.create({
      baseURL: 'https://yoga-master-1.onrender.com/',
    }), []);

    useEffect(() => {
      const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
        // read both possible token keys
        const token = localStorage.getItem('token') || localStorage.getItem('yoga-token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      const responseInterceptor = axiosSecure.interceptors.response.use((response) => response, async (error) => {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
              // Unauthorized or Forbidden
              try { await logout(); } catch(_) {}
              navigate('/login');
              // fall through to reject
          }
          throw error;
      });

      return () => {
        axiosSecure.interceptors.request.eject(requestInterceptor);
        axiosSecure.interceptors.response.eject(responseInterceptor);
      };
    },[logout, navigate, axiosSecure]);

    return axiosSecure;
}

export default useAxiosSecure
// ...existing code...