import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
export function signToken(payload) {

  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

export const getMe = async () => {
  try {
    const res = await api.get("/auth/me", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};