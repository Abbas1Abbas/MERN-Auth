const express = require('express');
const authRouter = require('./Routers/authRouter.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();
const { connectDB } = require('./MongoDB/connectDB.js');

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

connectDB();

app.use('/auth', authRouter);

app.get('/',(req,res)=>{res.send("Hello World")});
app.listen(PORT, ()=>{console.log(`Server Is Running At http://localhost:${PORT}/`)});