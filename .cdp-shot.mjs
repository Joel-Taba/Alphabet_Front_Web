import WebSocket from "ws";
import fs from "fs";

const CDP_PORT = 9333;
const BASE = "http://localhost:8080";

async function newTab() {
  const res = await fetch(`http://localhost:${CDP_PORT}/json/new?about:blank`, { method: "PUT" });
  return res.json();
}
function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, { maxPayload: 1024 * 1024 * 1024 });
    ws.on("open", () => resolve(ws));
    ws.on("error", reject);
  });
}
function send(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1e9);
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.off("message", handler);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };
    ws.on("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
function waitForEvent(ws, eventName, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.off("message", handler);
      reject(new Error(`timeout waiting for ${eventName}`));
    }, timeoutMs);
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.method === eventName) {
        clearTimeout(timer);
        ws.off("message", handler);
        resolve(msg.params);
      }
    };
    ws.on("message", handler);
  });
}

async function main() {
  const [, , outPath, ...rest] = process.argv;
  const path = rest[0] || "/accueil";
  const evalJs = rest[1];

  const target = await newTab();
  const ws = await connect(target.webSocketDebuggerUrl);
  await send(ws, "Page.enable");
  await send(ws, "Runtime.enable");

  await send(ws, "Page.navigate", { url: `${BASE}${path}` });
  await waitForEvent(ws, "Page.loadEventFired").catch(() => {});
  await new Promise((r) => setTimeout(r, 900));

  if (evalJs) {
    const result = await send(ws, "Runtime.evaluate", { expression: evalJs, returnByValue: true });
    console.log("eval result:", JSON.stringify(result.result?.value ?? result.result));
    await new Promise((r) => setTimeout(r, 200));
  }

  const { data } = await send(ws, "Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(outPath, Buffer.from(data, "base64"));
  console.log("saved", outPath);

  await send(ws, "Page.close").catch(() => {});
  ws.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
