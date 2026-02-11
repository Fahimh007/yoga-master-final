import { useEffect, useMemo } from "react";
import axios from "axios";

const useAxiosFetch = () => {
  const axiosInstance = useMemo(() => axios.create({ baseURL: "https://yoga-master-1.onrender.com" }), []);

  useEffect(() => {
    const reqId = axiosInstance.interceptors.request.use(config => config, err => Promise.reject(err));
    const resId = axiosInstance.interceptors.response.use(res => res, err => Promise.reject(err));
    return () => {
      axiosInstance.interceptors.request.eject(reqId);
      axiosInstance.interceptors.response.eject(resId);
    };
  }, [axiosInstance]);

  return axiosInstance;
};

export default useAxiosFetch;
