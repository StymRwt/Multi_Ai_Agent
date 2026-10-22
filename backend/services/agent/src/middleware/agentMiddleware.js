const jwt=require('jsonwebtoken')

const agentMiddleware=(req,res,next)=>{

    const token=req.cookies.token



    if(!token){
         return res.status(401).json({
            message:" token is missing"
        })
    }
    const decode=jwt.verify(token,process.env.JWT_SECRET)

    req.user=decode;

    next()
}

module.exports=agentMiddleware;