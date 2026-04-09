import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {

    const { id } = await params;

    const body = await req.json();
    const { data } = body;
    console.log("data")
    console.log(data)
    console.log("data")

    const updateFollowUp = await prisma.tbl_violation_report.update({
      where: {
        id: data.violationId,
      },
      data: {
        linkFileVio: data.linkFileVio,
      },
    });

    return Response.json(updateFollowUp, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Gagal update data: " + error.message },
      { status: 500 }
    );
  }
}