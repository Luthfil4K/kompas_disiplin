import api from "@/lib/api";

export const getMe = async () => {
  console.log("di service auth")
  const res = await api.get("/auth/me", {
    withCredentials: true, 
  });
  return res.data;
};