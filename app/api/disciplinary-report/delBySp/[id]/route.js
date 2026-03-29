import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {

    const { id } = await params;
    console.log(id)
    console.log(id)
    console.log(id)
    console.log(id)


    try {
        const deleted = await prisma.tbl_violation_report.delete({
            where: { id },
        });

        return Response.json({
            message: 'Deleted successfully',
        });
    } catch (error) {
        console.log(error)
        return Response.json(
            { error: "Gagal delete data: " + error.message },
            { status: 500 }
        );
    }
}