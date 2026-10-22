const mongoose=require('mongoose')


const messageSchema=new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"conversation"
    },
    role:{
        enum:["human","assistant"],
        type:String
    },
    content:String
})

const messageModel=mongoose.model('message',messageSchema)

module.exports=messageModel;