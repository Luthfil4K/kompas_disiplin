import { PrismaClient } from "@prisma/client";

let prisma;

// Hindari Prisma membuat banyak koneksi saat hot reload (dev mode)
if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

export default prisma;
