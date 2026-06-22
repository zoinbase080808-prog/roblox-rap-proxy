const express = require("express");
const fetch = require("node-fetch");

const app = express();

const PORT = process.env.PORT || 3000;


app.get("/inventory", async (req,res)=>{

    const userId = req.query.userid;
    const cursor = req.query.cursor || "";


    if(!userId){
        return res.status(400).json({
            error:"no userid"
        });
    }



    let url =
    "https://www.pekora.zip/apisite/inventory/v1/users/"
    + userId
    + "/assets/collectibles?limit=100";



    if(cursor !== ""){

        url += "&cursor=" + cursor;

    }



    console.log("REQUEST:",url);



    try{


        const response = await fetch(url);


        const json = await response.json();


        console.log(
            "ITEMS:",
            json.data ? json.data.length : 0,
            "CURSOR:",
            json.nextPageCursor
        );



        res.json(json);


    }
    catch(e){

        console.log(e);

        res.status(500).json({
            error:e.message
        });

    }


});



app.listen(PORT,()=>{

    console.log(
        "Proxy running on "+PORT
    );

});
