const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await userModel.findOne({
    email: email,
  });

  if (userExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User created successfully",
    user: {
      name: user.name,
      email: user.email,
    },
  });
};






const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const isUserExist = await userModel.findOne({ email: email });

  if (!isUserExist) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordMatch = await bcrypt.compare(password, isUserExist.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      userId: isUserExist._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    
    user: {
        name:isUserExist.name,
    }
  });
};




const logoutUser = async (req,res)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"User not logged in"
        })
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const user=await userModel.findById(decoded.userId);
    res.clearCookie("token");
   

    res.status(200).json({
        message:"User logged out successfully",
       
        user:{
            name:user.name,
            email:user.email
        }

    })
}



module.exports = { registerUser ,loginUser ,logoutUser}; 
