const graph = require("../../graph/graph");
const axios = require("axios");

const agentController = async (req, res) => {
  try {
   const { inputvalue, agent, conversationId } = req.body;

   // Validate input
    if (!inputvalue) {
      return res.status(400).json({
        success: false,
        message: "Input is required",
      });
    }

    if (!agent) {
      return res.status(400).json({
        success: false,
        message: "Agent is required",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const response = await graph.invoke({
      prompt: inputvalue,
      agent: agent,
    });

   const aiResponse = response.aiResponce;

   await axios.post(`${process.env.CHAT_SERVICE_URL}/create-message`,{
    conversationId:conversationId,
    role:"assistant",
    content:aiResponse
   },
   {
    headers:{
      Cookie: req.headers.cookie,
    }
   }
  
  )

   const decode=req.user;
  

    res.status(200).json({
      success: true,
      content:aiResponse
    });
  } catch (error) {
    console.error("ai responce error", error);
  }
};

module.exports = { agentController };
