
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {

    const consultation = await prisma.tbl_consultation.findMany({
      include:{
        workUnit:true,
        followUps:true,
        USER:true
      }
    });

    return Response.json(consultation, { status: 200 });
  } catch (error) {
    console.error(error);
    console.log(error);
    return Response.json({ error: "Gagal mengambil data: ",error }, { status: 500 });
  }
}
