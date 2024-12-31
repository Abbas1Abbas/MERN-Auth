const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;

const connectDB = async () =>{
    await mongoose.connect(mongoURI+"/mern-auth")
    .then(()=>{
        console.log("Connected");
    }).catch((err)=>{
        console.log("Error While Connnecting: "+err);
    });
}

module.exports = { connectDB };