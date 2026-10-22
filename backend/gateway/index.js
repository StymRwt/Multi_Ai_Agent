const express=require('express');
const dotenv=require('dotenv');
dotenv.config();
const proxy=require('express-http-proxy');
const cors=require('cors');
const protect = require('./src/middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const app=express();


app.use(cookieParser());

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))


app.use('/api/auth',proxy(process.env.AUTH_SERVICE_URL));
app.use('/api/agent',proxy(process.env.AGENT_SERVICE_URL))
app.use('/api/chat/',protect,
proxy(process.env.CHAT_SERVICE_URL)
)



const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Gateway service is running on port ${port}`);
})
