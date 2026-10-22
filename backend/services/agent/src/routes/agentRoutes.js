const express=require('express');
const { agentController } = require('../controllers/agentcontrollers');
const agentMiddleware = require('../middleware/agentMiddleware');

const router=express.Router()





router.post('/ai',agentController)

router.get('/test',agentMiddleware,(req,res)=>{
    console.log("COOKIE:", req.headers.cookie);
    
    return res.status(200).json({
        message:"AI service route is working"
        
    })
    
})



module.exports=router;