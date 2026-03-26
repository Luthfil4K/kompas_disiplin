import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { data } = body;

    //  base data
    const followUpData = {
      notes: data.notes,
      linkFile: data.linkFile || "",
      user: {
        connect: { id: data.userId },
      },
    };

    //  conditional relation
    if (data.type === "consultation") {
      followUpData.consultation = {
        connect: { id: data.consultationId },
      };
    }

    if (data.type === "violation") {
      followUpData.violation = {
        connect: { id: data.violationId },
      };
    }

    const postFollowUp = await prisma.tbl_follow_up.create({
      data: followUpData,
    });

    if (data.type === "consultation") {
      await prisma.tbl_consultation.update({
        where: { id: data.consultationId },
        data: {
          status: "FOLLOWED_UP",
        },
      });
    } else if (data.type === "violation") {
      await prisma.tbl_violation_report.update({
        where: { id: data.violationId },
        data: {
          status: "FOLLOWED_UP",
        },
      });
    }

    return Response.json(postFollowUp, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Gagal insert data: " + err.message },
      { status: 500 },
    );
  }
}
