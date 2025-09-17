
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.133:3095",
// baseURL:"http://192.168.0.99:45456",
  withCredentials: true, // ✅ Necessary for cookies
});

export default api;
