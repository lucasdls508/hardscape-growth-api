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
const port = parseInt(process.env.PORT || "3000", 10);

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

// Load the compiled NestJS app — crash is captured here if any require() fails
try {
  require("./dist/src/main");
} catch (err) {
  console.error("[FATAL] Module load error in dist/src/main:", err.message);
  console.error(err.stack);
  process.exit(1);
}
