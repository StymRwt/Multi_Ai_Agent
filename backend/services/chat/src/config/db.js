const mongoose=require('mongoose')

const connectDB=async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log('Database is connected')
    } catch (error) {
        console.log('Database error',error)
        process.exit(1);
    }
}


module.exports=connectDB;