const moongose = require("mongoose");

const DB = process.env.DATABASE; //.env to DB variable
 //moongose wants promises 
moongose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("Database Successfully Connected !"))
.catch((err)=>console.log(err,"Database not Connected !!"));