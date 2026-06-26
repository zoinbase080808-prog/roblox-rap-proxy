const express = require("express");
const fetch   = require("node-fetch");
const fs      = require("fs");
const path    = require("path");
const app     = express();
const PORT    = process.env.PORT || 3000;

app.use(express.json());

// ── DataStore: храним всё в data.json рядом с index.js ──────────
const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        }
    } catch (e) {
        console.error("loadData error:", e.message);
    }
    return {};
}

function saveData(db) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
    } catch (e) {
        console.error("saveData error:", e.message);
    }
}

// GET /datastore?key=inv_145772
// Возвращает { value: <любой JSON> } или { value: null } если ключа нет
app.get("/datastore", (req, res) => {
    const key = req.query.key;
    if (!key) return res.status(400).json({ error: "no key" });
    const db  = loadData();
    res.json({ value: db[key] !== undefined ? db[key] : null });
});

// POST /datastore
// Body: { "key": "inv_145772", "value": { ... } }
app.post("/datastore", (req, res) => {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: "no key" });
    const db = loadData();
    db[key]  = value;
    saveData(db);
    res.json({ ok: true });
});

// ── Inventory proxy (без изменений) ─────────────────────────────
app.get("/inventory", async (req, res) => {
    const userId = req.query.userid;
    const cursor = req.query.cursor || "";
    if (!userId) return res.status(400).json({ error: "no userid" });

    let url = "https://www.pekora.zip/apisite/inventory/v1/users/"
        + userId + "/assets/collectibles?limit=100";
    if (cursor !== "") url += "&cursor=" + encodeURIComponent(cursor);

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept":     "application/json",
                "Referer":    "https://www.pekora.zip/"
            }
        });
        const text = await response.text();
        res.setHeader("Content-Type", "application/json");
        res.send(text);
    } catch (err) {
        res.status(500).json({ error: "fetch failed", detail: err.message });
    }
});

app.listen(PORT, () => {
    console.log("Proxy running on port " + PORT);
});
