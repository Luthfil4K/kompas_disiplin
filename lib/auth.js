import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
export function signToken(payload) {
  console.log(SECRET)
  console.log(SECRET)
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};