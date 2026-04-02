import dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

const PORT = process.env.PORT;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  httpServer.listen(PORT, () => {
    console.log(`Ready on http://localhost:${PORT}`);
  });
});