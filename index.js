const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/inventory", async (req, res) => {
  const userId = req.query.userid;

  if (!userId) {
    return res.status(400).json({ error: "no userid" });
  }

  const url = `https://inventory.roproxy.com/v1/users/${userId}/assets/collectibles?sortOrder=Asc&limit=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "fetch failed", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Proxy running on port " + PORT);
});
