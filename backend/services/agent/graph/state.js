const { Annotation } = require("@langchain/langgraph");

const agentState=Annotation.Root({
    
    prompt:Annotation(),
    aiResponce:Annotation(),
    agent:Annotation(),
    conversation:Annotation()
})


module.exports=agentState;