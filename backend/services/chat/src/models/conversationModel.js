const mongoose=require('mongoose')

const conversationSchema=new mongoose.Schema({

    title:{
        type:String
    },
    userId:{
        type:String
    }


})

const conversatonModel=mongoose.model('conversation',conversationSchema)

module.exports=conversatonModel;