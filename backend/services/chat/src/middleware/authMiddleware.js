const jwt=require('jsonwebtoken')

const protect=(req,res,next)=>{
    
     try {
    //     const header=req.headers.authorization;
    // if(!header){
    //     return res.status(401).json({
    //         message:"Authorization token is missing"
    //     })
    // }

    // const token=header.split(" ")[1];

   const token=req.cookies.token

    if(!token){
        return res.status(401).json({
            message:" token is missing"
        })
    }

    const decode=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decode;

    next()
    } catch (error) {
        console.log('auth chat middleware error',error)
    }

}

module.exports=protect;