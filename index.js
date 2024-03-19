const express = require('express');

const port = 8000;
const router = require('./routes/index');

// creating an instance of express
const app = express();

// adding routes
app.use('/',router);

// setting up view engine as ejs
app.set('view engine', 'ejs');
app.set('views', './views')


app.listen(port,(err)=>{
    if(err){
        console.log(`Error in strating server: ${err}`);
        return;
    }
    console.log(`Server is up and running on port: ${port}`);
});