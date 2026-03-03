
// import { logout } from "@/helpers/logout";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// baseURL:"http://192.168.0.99:45455", //nabeeh
// baseURL:"http://192.168.0.123:45455",  //shine
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      // await logout();
    }
    return Promise.reject(error);
  }
);

export default api;
