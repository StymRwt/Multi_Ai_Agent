const conversatonModel = require("../models/conversationModel");
const messageModel = require("../models/messgaeModel");

const conversationController = async (req, res) => {
  try {
    const { title } = req.body;

    const user = req.user.userId;
   

    const conversation = await conversatonModel.create({
      title,
      userId: user,
    });

    res.status(200).json({
      message: "Conversation create successfully",
      conversation
    });
  } catch (error) {
    console.error("conversation error", error);
  }
};

const messageController = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;

    const user=req.user
    const conversation=await conversatonModel.find({
        conversationId,
        userId:user.userId
    })

    if(!conversation){
          return res.status(404).json({
                message: "Conversation not found"
            });
    }

    const message = await messageModel.create({
      conversationId,
      role,
      content,
    });

    res.status(200).json({
      message: "message create successfully",
    });
  } catch (error) {
    console.error("message error", error);
  }
};



const getConversation=async(req,res)=>{

    try {
        const user=req.user.userId
       
        
    const getCon=await conversatonModel.find({
        userId:user
    })

    res.status(200).json({
        conversation:getCon
    })
    } catch (error) {
        console.error('get conversation error',error)
    }
    
}

const getMessage=async(req,res)=>{

    try {


        
        const getMes=await messageModel.find({
            conversationId:req.params.conversationId
        })

        res.status(200).json({
            message:getMes
        })

        
    } catch (error) {
        console.error(' get messsage error',error)
    }

}

module.exports = { conversationController,messageController,getConversation,getMessage};
