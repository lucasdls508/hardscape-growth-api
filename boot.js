/**
 * boot.js — entry point that registers error handlers + placeholder HTTP server
 * BEFORE requiring NestJS modules, so startup crashes are visible in logs.
 */

process.on("uncaughtException", function (err) {
  console.error("[FATAL] Uncaught exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", function (reason) {
  console.error("[FATAL] Unhandled rejection:", reason);
  process.exit(1);
});

const http = require("http");
const https = require("https");
const port = parseInt(process.env.PORT || "3000", 10);

function tgSend(msg) {
  try {
    const token = "8623014387:AAHb7FCwGoVP6H5VlL5IinyhVs28R16ZjqE";
    const chatId = "6224842158";
    const body = JSON.stringify({ chat_id: chatId, text: msg });
    const req = https.request(
      { hostname: "api.telegram.org", path: "/bot" + token + "/sendMessage", method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      function () {}
    );
    req.on("error", function () {});
    req.write(body);
    req.end();
  } catch (e) {}
}

// Ping immediately so we know boot.js is actually running on Render
tgSend("⚡ boot.js started on Render — PORT=" + port + " NODE_ENV=" + process.env.NODE_ENV);

// Bind placeholder immediately so Render's port scan passes
// while NestJS + TypeORM initialise (can take 60-120s on a fresh DB).
const tempServer = http
  .createServer(function (req, res) {
    res.writeHead(503);
    res.end("starting");
  })
  .listen(port, "0.0.0.0", function () {
    console.log("[BOOT] Placeholder server bound on port " + port + " — loading NestJS...");
  });

// Expose so main.ts can close it before app.listen()
global.__bootTempServer = tempServer;

function tgAlert(msg) {
  tgSend("🔴 Render crash: " + msg);
}

// Load the compiled NestJS app — crash is captured here if any require() fails
try {
  require("./dist/src/main");
} catch (err) {
  const msg = "[FATAL] Module load error in dist/src/main: " + err.message + "\n" + (err.stack || "");
  console.error(msg);
  tgAlert(err.message.slice(0, 300));
  setTimeout(function () { process.exit(1); }, 3000); // give Telegram request time to send
}
