const express = require("express");
const fetch = require("node-fetch");

const app = express();

const PORT = process.env.PORT || 3000;


app.get("/inventory", async (req, res) => {

    const userId = req.query.userid;
    const cursor = req.query.cursor || "";


    if (!userId) {
        return res.status(400).json({
            error: "no userid"
        });
    }


    let url =
        "https://www.pekora.zip/apisite/inventory/v1/users/"
        + userId
        + "/assets/collectibles?limit=100";


    if (cursor !== "") {
        url += "&cursor=" + encodeURIComponent(cursor);
    }


    try {

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Referer": "https://www.pekora.zip/"
            }
        });


        const text = await response.text();


        res.setHeader(
            "Content-Type",
            "application/json"
        );


        res.send(text);


    } catch (err) {

        res.status(500).json({
            error: "fetch failed",
            detail: err.message
        });

    }

});


app.listen(PORT, () => {
    console.log("Proxy running on port " + PORT);
});
