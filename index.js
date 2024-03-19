const express = require('express');

const port = 8000;
const router = require('./routes/index');

const app = express();

app.use('/',router);

app.listen(port,(err)=>{
    if(err){
        console.log(`Error in strating server: ${err}`);
        return;
    }
    console.log(`Server is up and running on port: ${port}`);
});