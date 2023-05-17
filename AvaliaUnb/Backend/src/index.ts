import express from 'express';

var app = express();

app.listen(3000, () =>{
    console.log("running on port 3000");
});

app.get("/url", (req, res, next) => {
    res.json(["isso", "eh", "um", "teste"]);
})