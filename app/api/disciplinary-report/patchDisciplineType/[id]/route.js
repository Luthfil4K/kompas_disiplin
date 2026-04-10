import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {

    const { id } = await params;

    const body = await req.json();
    const { data } = body;
    console.log("data")
    console.log(data)
    console.log("data")

    const updateType = await prisma.tbl_violation_report.update({
      where: {
        id: id,
      },
      data: {
        violationTypeId: data.violationTypeId,
      },
    });

    return Response.json(updateType, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Gagal update data: " + error.message },
      { status: 500 }
    );
  }
}