const express = require('express');
const cookieParser = require('cookie-parser');
const ejsLayouts = require('express-ejs-layouts');
const db = require("./config/mongoose"); //importing mongo db
const mongoStore = require("connect-mongo");
const sassMidlleware = require("node-sass-middleware");
const flash = require('connect-flash');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();
const cloudinary = require("./config/cloudinary");

const app = express();
const port = 8000;
const server = http.createServer(app)
const io = new Server(server);

//import chat-engine
require('./chatEngine/chatEngine')(io);

// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require("./config/passport-local-strategy");

const User = require("./models/users");
const ContactUs = require("./models/contactUs");
const Posts = require("./models/posts");

app.use(sassMidlleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    prefix: "/css",
    outputStyle: "expanded"
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./assets")); // defining the directory url for static files
app.use(ejsLayouts); // telling app to use ejslayouts

// setting individual styles and scripts into layouts.ejs
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// setting up view engine as ejs
app.set('view engine', 'ejs');
app.set('views', './views')

// Express session
app.use(session({
    name: "socio",
    secret: "temp-secretcode",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: mongoStore.create({
        mongoUrl: "mongodb://localhost:27017/socio_devlopment"
    })
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// adding routes
const router = require('./routes/index');
app.use('/', router);

server.listen(port, (err) => {
    if (err) {
        console.log(`Error in strating server: ${err}`);
        return;
    }
    console.log(`Server is up and running on port: ${port}`);
});
