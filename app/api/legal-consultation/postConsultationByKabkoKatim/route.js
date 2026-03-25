import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const { data } = body;

    const postConsultation = await prisma.tbl_consultation.create({
      data: {
        id: data.id,
        name: data.fullName,
        position: data.position,
        workUnitId: data.workUnit,
        phone: data.phone,
        topic: data.topic,
        linkFile: data.linkFile?data.linkFile:"",
      },
    });
    return Response.json(postConsultation, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Gagal insert data: " + err.message },
      { status: 500 }
    );
  }
}