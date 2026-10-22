const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const dns=require('dns');
dotenv.config();
const {router} = require('./src/routes/authRoutes.js');
const cookieParser = require('cookie-parser');

dns.setServers([
    '8.8.8.8','8.8.4.4'
])

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/',router);





const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Auth service is running on port ${port}`);
    connectDB();
});
