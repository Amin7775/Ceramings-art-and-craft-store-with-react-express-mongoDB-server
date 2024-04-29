const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000 ; 

app.get('/', (req,res)=>{
    res.send("Ceramings Server is running");
})

app.listen(port,()=>{
    console.log("Running Ceramings")
})