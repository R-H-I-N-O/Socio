const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')

const port = 8000;
const router = require('./routes/index'); 
const User = require("./models/users");
const db = require("./config/mongoose"); //importing mongo db

// creating an instance of express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./assets")); // defining the directory url for static files
app.use(ejsLayouts); // telling app to use ejslayouts

// setting individual styles and scripts into layouts.ejs
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
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
