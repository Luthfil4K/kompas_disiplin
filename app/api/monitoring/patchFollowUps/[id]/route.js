import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {

    const { id } = await params;

    const body = await req.json();
    const { data } = body;

    const updateFollowUp = await prisma.tbl_follow_up.update({
      where: {
        id: id,
      },
      data: {
        notes: data.notes,
        linkFile: data.linkFile,
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