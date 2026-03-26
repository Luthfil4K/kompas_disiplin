import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { data } = body;

    let result;

    if (data.type === "consultation") {
      result = await prisma.tbl_consultation.update({
        where: { id },
        data: { status: data.status },
      });
    }

    if (data.type === "violation") {
      result = await prisma.tbl_violation_report.update({
        where: { id },
        data: { status: data.status },
      });
    }

    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Gagal update status: " + err.message },
      { status: 500 }
    );
  }
}