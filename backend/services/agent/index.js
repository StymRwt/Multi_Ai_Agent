const express = require('express')
const dotenv= require('dotenv')
const cookieparser =require('cookie-parser')
const axios=require('axios')

const { SystemMessage } = require('@langchain/core/messages')
const { HumanMessage } = require('@langchain/core/messages')
const llm = require('./config/llmModel')
const graph = require('./graph/graph')
const router = require('./src/routes/agentRoutes')
const agentMiddleware = require('./src/middleware/agentMiddleware')


dotenv.config()




const app =express()

app.use(cookieparser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())





app.use('/',agentMiddleware,router)






const port=process.env.PORT

app.listen(port,()=>{
    console.log(`agent server is running on ${port}`)
})