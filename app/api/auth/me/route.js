import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return Response.json({
      user: {
        id: payload.id,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}