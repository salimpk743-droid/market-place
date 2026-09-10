#!/usr/bin/env node
/**
 * Programmatic Next.js dev server. Bound by preview-dev.mjs on loopback so
 * the grok preview proxy discovers the outer listener, not this process.
 */
import { createServer } from "node:http";
import next from "next";

const hostname = process.env.NEXT_LISTEN_HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8082);

const app = next({ dev: true, hostname, port });
await app.prepare();

const handle = app.getRequestHandler();
const upgrade = app.getUpgradeHandler();

const server = createServer((req, res) => {
  handle(req, res);
});

server.on("upgrade", (req, socket, head) => {
  upgrade(req, socket, head);
});

server.listen(port, hostname, () => {
  console.log(`> Next dev on http://${hostname}:${port}`);
});
