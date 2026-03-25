import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api`,
});

export default api;