
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {

    const violaitionReport = await prisma.tbl_violation_report.findMany({
      include:{
        workUnit:true,
        violationType:true,
        followUps:true,
      }
    });

    return Response.json(violaitionReport, { status: 200 });
  } catch (error) {
    console.error(error);
    console.log(error);
    return Response.json({ error: "Gagal mengambil data: ",error }, { status: 500 });
  }
}
