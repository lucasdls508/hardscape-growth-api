// Minimal test endpoint to verify Vercel function environment
console.log("[TEST] Function module loading...");

module.exports = async (req, res) => {
  console.log("[TEST] Request received:", req.url);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ status: "ok", node: process.version, env: process.env.VERCEL }));
};

console.log("[TEST] Module loaded successfully");
