require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/router");
require("./db/conn");
const PORT = process.env.PORT || 4002;



//middleware
app.use(express.json());
app.use(cors());
app.use(router);
app.get("/",(req,res)=>{
    res.status(200).json("server started")
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})


