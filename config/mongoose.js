const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/socio_devlopment").then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log("error in connecting db",err);
});