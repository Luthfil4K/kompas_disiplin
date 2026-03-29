import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log("me1")
    
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("me2")
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log("me3")

    console.log("PAYLOAD:", payload.role);
    return Response.json({
      user: {
        id: payload.id,
        name: payload.name,
        role: payload.role,
        email:payload.email
      },
    });
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}