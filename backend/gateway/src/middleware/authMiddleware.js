const jwt=require('jsonwebtoken')


const protect=async(req,res,next)=>{

   try {
    //  const authHeader=req.headers.authorization;
     
    

    // if(!authHeader){
    //     return res.status(401).json({
    //         message:"Authorization token is missing"
    //     })
    // }

   // const token=authHeader.split(" ")[1];

   const token=req.cookies.token

   if(!token){
     return res.status(401).json({
            message:" token is missing"
        })
   }

   const decode=jwt.verify(token,process.env.JWT_SECRET)

   req.user=decode;
   



    next()
   } catch (error) {
    console.error(error)
   }

}

module.exports=protect;