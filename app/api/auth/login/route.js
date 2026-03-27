import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    console.log(email)
    console.log(password)

    const user = await prisma.tbl_user.findUnique({
      where: { email },
      select:{
        email:true,
        password:true,
        role:true,
        nip:true
      }
    });
    
    // console.log("user")
    // console.log(user)
    
    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);

    console.log("isValid", valid)
    if (!valid) {
      return Response.json({ error: "Password salah" }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      name: user.name,
    });


    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    

    return Response.json({ message: "Login success" });

  } catch (err) {
    console.log(err)
    console.log(err.message)
    return Response.json({ error: err.message }, { status: 500 });
  }
}