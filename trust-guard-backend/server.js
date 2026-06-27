const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "trustguard",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

pool.connect((err) => {
  if (err) { console.error("DB connection failed:", err.message); process.exit(1); }
  console.log("PostgreSQL connected");
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET || "secret"); next(); }
  catch { res.status(401).json({ error: "Invalid token" }); }
};

app.post("/api/auth/register", async (req, res) => {
  const { email, password, full_name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, role, created_date",
      [email, hash, full_name || ""]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already exists" });
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/auth/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email, full_name, role, created_date FROM users WHERE id = $1", [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function crudRouter(table, allowedFields) {
  const router = express.Router();
  router.get("/", authenticate, async (req, res) => {
    try {
      const { limit = 100, offset = 0, ...filters } = req.query;
      let query = "SELECT * FROM " + table;
      const values = [];
      const conditions = [];
      Object.entries(filters).forEach(([k, v], i) => {
        if (allowedFields.includes(k)) { conditions.push(k + " = $" + (i + 1)); values.push(v); }
      });
      if (conditions.length) query += " WHERE " + conditions.join(" AND ");
      query += " ORDER BY created_date DESC LIMIT $" + (values.length + 1) + " OFFSET $" + (values.length + 2);
      values.push(limit, offset);
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.get("/:id", authenticate, async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM " + table + " WHERE id = $1", [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.post("/", authenticate, async (req, res) => {
    try {
      const fields = Object.keys(req.body).filter((k) => allowedFields.includes(k));
      const values = fields.map((f) => req.body[f]);
      const cols = fields.join(", ");
      const placeholders = fields.map((_, i) => "$" + (i + 1)).join(", ");
      const result = await pool.query("INSERT INTO " + table + " (" + cols + ") VALUES (" + placeholders + ") RETURNING *", values);
      res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.put("/:id", authenticate, async (req, res) => {
    try {
      const fields = Object.keys(req.body).filter((k) => allowedFields.includes(k));
      const setClauses = fields.map((f, i) => f + " = $" + (i + 1)).join(", ");
      const values = fields.map((f) => req.body[f]);
      values.push(req.params.id);
      const result = await pool.query("UPDATE " + table + " SET " + setClauses + ", updated_date = NOW() WHERE id = $" + values.length + " RETURNING *", values);
      if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.delete("/:id", authenticate, async (req, res) => {
    try {
      await pool.query("DELETE FROM " + table + " WHERE id = $1", [req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  return router;
}

app.use("/api/users",          crudRouter("users",          ["email","full_name","role","status","wallet_balance","kyc_status","kyc_bvn","kyc_nin"]));
app.use("/api/transactions",   crudRouter("transactions",   ["user_id","amount","currency","type","status","reference","description","metadata","trade_id","trade_reference","user_name","fee_collected","direction"]));
app.use("/api/disputes",       crudRouter("disputes",       ["transaction_id","user_id","reason","status","evidence","resolution","amount"]));
app.use("/api/payouts",        crudRouter("payouts",        ["user_id","amount","currency","status","bank_account","reference","scheduled_date"]));
app.use("/api/trades",         crudRouter("trades",         ["user_id","buyer_id","seller_id","buyer_email","buyer_name","seller_email","seller_name","item_name","item_description","amount","calculated_fee","fee_payer","status","reference","virtual_bank_name","virtual_account_number","virtual_account_expires_at","delivery_deadline","shipped_at","confirmed_at","auto_release_at","dispatch_company","rider_name","rider_phone","tracking_code","asset","type","quantity","price","settled_at","release_days"]));
app.use("/api/webhook-events", crudRouter("webhook_events", ["event_type","payload","status","source","retries"]));

app.get("/api/health", (_, res) => res.json({ status: "ok", db: "postgresql" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));

// ─── Forgot / Reset Password ──────────────────────────────────────────────────
const crypto = require("crypto");

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour
    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3",
      [token, expires, email]
    );
    // In production send an email — for now return the token directly
    console.log(`Reset token for ${email}: ${token}`);
    res.json({ message: "If that email exists, a reset link was sent.", token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [token]
    );
    if (!result.rows[0]) return res.status(400).json({ error: "Invalid or expired token" });
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [hash, result.rows[0].id]
    );
    res.json({ message: "Password reset successful" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Trade Lifecycle Actions ──────────────────────────────────────────────────
app.post("/api/trades/:id/ship", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trades WHERE id = $1", [req.params.id]);
    const trade = result.rows[0];
    if (!trade) return res.status(404).json({ error: "Trade not found" });

    const { dispatch_company, rider_name, rider_phone, tracking_code } = req.body;
    const releaseDays = parseInt(trade.release_days) || 2;
    const shippedAt = new Date();
    const autoRelease = new Date(shippedAt.getTime() + releaseDays * 24 * 60 * 60 * 1000);

    const updated = await pool.query(
      `UPDATE trades SET 
        status = 'Shipped',
        shipped_at = $1,
        auto_release_at = $2,
        dispatch_company = $3,
        rider_name = $4,
        rider_phone = $5,
        tracking_code = $6,
        updated_date = NOW()
       WHERE id = $7 RETURNING *`,
      [shippedAt, autoRelease, dispatch_company || null, rider_name || null, rider_phone || null, tracking_code || null, req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/trades/:id/ship", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trades WHERE id = $1", [req.params.id]);
    const trade = result.rows[0];
    if (!trade) return res.status(404).json({ error: "Trade not found" });

    const { dispatch_company, rider_name, rider_phone, tracking_code } = req.body;
    const releaseDays = parseInt(trade.release_days) || 2;
    const shippedAt = new Date();
    const autoRelease = new Date(shippedAt.getTime() + releaseDays * 24 * 60 * 60 * 1000);

    const updated = await pool.query(
      `UPDATE trades SET 
        status = 'Shipped',
        shipped_at = $1,
        auto_release_at = $2,
        dispatch_company = $3,
        rider_name = $4,
        rider_phone = $5,
        tracking_code = $6,
        updated_date = NOW()
       WHERE id = $7 RETURNING *`,
      [shippedAt, autoRelease, dispatch_company || null, rider_name || null, rider_phone || null, tracking_code || null, req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/trades/:id/confirm-payment", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trades WHERE id = $1", [req.params.id]);
    const trade = result.rows[0];
    if (!trade) return res.status(404).json({ error: "Trade not found" });
    if (trade.status !== "Awaiting_Payment") return res.status(400).json({ error: "Trade is not awaiting payment" });

    const updated = await pool.query(
      "UPDATE trades SET status = 'Funded', updated_date = NOW() WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    await pool.query(
      "UPDATE transactions SET status = 'completed', updated_date = NOW() WHERE trade_id = $1 AND type = 'Escrow_Inflow'",
      [req.params.id]
    );

    res.json(updated.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/trades/:id/release-funds", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trades WHERE id = $1", [req.params.id]);
    const trade = result.rows[0];
    if (!trade) return res.status(404).json({ error: "Trade not found" });

    const fee = parseFloat(trade.calculated_fee) || 0;
    const amount = parseFloat(trade.amount) || 0;
    let sellerReceives = amount;
    if (trade.fee_payer === "SELLER") sellerReceives = amount - fee;
    if (trade.fee_payer === "SPLIT_50_50") sellerReceives = amount - fee / 2;

    if (trade.seller_id) {
      await pool.query(
        "UPDATE users SET wallet_balance = COALESCE(wallet_balance, 0) + $1, updated_date = NOW() WHERE id = $2",
        [sellerReceives, trade.seller_id]
      );
    }

    const updated = await pool.query(
      "UPDATE trades SET status = 'Confirmed', confirmed_at = NOW(), updated_date = NOW() WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    res.json(updated.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/disputes/:id/resolve", authenticate, async (req, res) => {
  const { ruling, resolution } = req.body; // ruling: 'refund' | 'release' | 'split'
  try {
    const dResult = await pool.query("SELECT * FROM disputes WHERE id = $1", [req.params.id]);
    const dispute = dResult.rows[0];
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });

    const tResult = await pool.query("SELECT * FROM trades WHERE id = $1", [dispute.transaction_id]);
    const trade = tResult.rows[0];
    if (!trade) return res.status(404).json({ error: "Linked trade not found" });

    const amount = parseFloat(trade.amount) || 0;
    const fee = parseFloat(trade.calculated_fee) || 0;

    if (ruling === "refund" && trade.buyer_id) {
      await pool.query(
        "UPDATE users SET wallet_balance = COALESCE(wallet_balance, 0) + $1, updated_date = NOW() WHERE id = $2",
        [amount, trade.buyer_id]
      );
    } else if (ruling === "release" && trade.seller_id) {
      const sellerReceives = trade.fee_payer === "SELLER" ? amount - fee : trade.fee_payer === "SPLIT_50_50" ? amount - fee / 2 : amount;
      await pool.query(
        "UPDATE users SET wallet_balance = COALESCE(wallet_balance, 0) + $1, updated_date = NOW() WHERE id = $2",
        [sellerReceives, trade.seller_id]
      );
    } else if (ruling === "split") {
      const half = amount / 2;
      if (trade.buyer_id) await pool.query("UPDATE users SET wallet_balance = COALESCE(wallet_balance, 0) + $1, updated_date = NOW() WHERE id = $2", [half, trade.buyer_id]);
      if (trade.seller_id) await pool.query("UPDATE users SET wallet_balance = COALESCE(wallet_balance, 0) + $1, updated_date = NOW() WHERE id = $2", [half, trade.seller_id]);
    }

    await pool.query(
      "UPDATE disputes SET status = 'RESOLVED', resolution = $1, updated_date = NOW() WHERE id = $2",
      [resolution || ruling, req.params.id]
    );
    const updatedTrade = await pool.query(
      "UPDATE trades SET status = 'Resolved', updated_date = NOW() WHERE id = $1 RETURNING *",
      [dispute.transaction_id]
    );

    res.json({ dispute: { ...dispute, status: "RESOLVED", resolution: resolution || ruling }, trade: updatedTrade.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Lookup user by email (for assigning seller_id on trade creation) ────────
app.get("/api/users/lookup/:email", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, full_name FROM users WHERE email = $1",
      [req.params.email]
    );
    res.json(result.rows[0] || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── My Trades (buyer or seller) ──────────────────────────────────────────────
app.get("/api/my-trades", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM trades WHERE buyer_id = $1 OR seller_id = $1 ORDER BY created_date DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Platform Settings ────────────────────────────────────────────────────────
app.get("/api/settings/fee-rate", async (req, res) => {
  try {
    const result = await pool.query("SELECT value FROM platform_settings WHERE key = 'fee_rate'");
    const rate = result.rows[0] ? parseFloat(result.rows[0].value) : 0.015;
    res.json({ fee_rate: rate });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/settings/fee-rate", authenticate, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin access required" });
  const { fee_rate } = req.body;
  const rate = parseFloat(fee_rate);
  if (isNaN(rate) || rate < 0 || rate > 1) return res.status(400).json({ error: "Fee rate must be a decimal between 0 and 1 (e.g. 0.015 for 1.5%)" });
  try {
    await pool.query(
      "INSERT INTO platform_settings (key, value, updated_date) VALUES ('fee_rate', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_date = NOW()",
      [String(rate)]
    );
    res.json({ fee_rate: rate });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── 48-Hour Auto-Release Job ─────────────────────────────────────────────────
async function runAutoRelease() {
  try {
    const result = await pool.query(
      `SELECT * FROM trades 
       WHERE status = 'Shipped' 
       AND auto_release_at IS NOT NULL 
       AND auto_release_at < NOW()`
    );

    if (result.rows.length === 0) return;

    console.log(`Auto-release: found ${result.rows.length} trade(s) to release`);

    for (const trade of result.rows) {
      try {
        const fee = parseFloat(trade.calculated_fee) || 0;
        const amount = parseFloat(trade.amount) || 0;
        let sellerReceives = amount;
        if (trade.fee_payer === "SELLER") sellerReceives = amount - fee;
        if (trade.fee_payer === "SPLIT_50_50") sellerReceives = amount - fee / 2;

        // Credit seller wallet
        if (trade.seller_id) {
          await pool.query(
            "UPDATE users SET wallet_balance = COALESCE(wallet_balance, 0) + $1, updated_date = NOW() WHERE id = $2",
            [sellerReceives, trade.seller_id]
          );
        }

        // Update trade status
        await pool.query(
          "UPDATE trades SET status = 'Confirmed', confirmed_at = NOW(), updated_date = NOW() WHERE id = $1",
          [trade.id]
        );

        // Create transaction record
        await pool.query(
          `INSERT INTO transactions 
           (user_id, trade_id, amount, fee_collected, type, direction, description, status) 
           VALUES ($1, $2, $3, $4, 'Auto_Release_Payout', 'credit', $5, 'completed')`,
          [
            trade.seller_id,
            trade.id,
            sellerReceives,
            fee,
            `Auto-released funds for: ${trade.item_name}`
          ]
        );

        console.log(`Auto-released trade ${trade.reference} — ₦${sellerReceives} to seller`);
      } catch (tradeErr) {
        console.error(`Failed to auto-release trade ${trade.id}:`, tradeErr.message);
      }
    }
  } catch (err) {
    console.error("Auto-release job error:", err.message);
  }
}

// Run immediately on startup, then every 5 minutes
runAutoRelease();
setInterval(runAutoRelease, 5 * 60 * 1000);
