import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const { data } = body;
    

    const postViolation = await prisma.tbl_violation_report.create({
      data: {
        reporterName: data.reporterName,
        reportedName: data.reportedName,
        workUnit: {
            connect: { id: data.workUnit }, 
        },
        reportedNip: data.nip,
        reportedPosition: data.position,
        violationType: {
            connect: { id: data.violationType }, 
        },
        violationDesc: data.description,
        linkFile: data.linkFile?data.linkFile:"",
        linkFileVio: data.linkFileVio?data.linkFileVio:"",
        USER:{
          connect: {id:data.userId}
        }
        // userId:data.userId
        
      },
    });
    return Response.json(postViolation, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Gagal insert data: " + err.message },
      { status: 500 }
    );
  }
}