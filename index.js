const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/inventory", async (req, res) => {
  const userId = req.query.userid;

  if (!userId) {
    return res.status(400).json({ error: "no userid" });
  }

  const url = `https://www.pekora.zip/apisite/inventory/v1/users/${userId}/assets/collectibles?limit=100`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.pekora.zip/",
        "Origin": "https://www.pekora.zip"
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
// v5
