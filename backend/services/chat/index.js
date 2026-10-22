const express=require('express')
const dotenv=require('dotenv');
const connectDB = require('./src/config/db');
dotenv.config();
const dns=require('dns');
const { router } = require('./src/routes/chatRoute');
const protect = require('./src/middleware/authMiddleware');
const cookieParser = require('cookie-parser');



dns.setServers([
    '8.8.8.8','8.8.4.4'
])


const app=express();

app.use(express.json());
app.use(cookieParser())


app.use('/',protect,router)








const port=process.env.PORT
app.listen(port,()=>{
    console.log(`chat server is running on ${port}`)
    connectDB()
})