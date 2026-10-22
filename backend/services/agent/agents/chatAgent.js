const getModel = require("../config/llmModel");


const chatAgent=async(state)=>{

    const llm =await getModel('chat');
    const systemPrompt=`you are an intelligent Ai chat bot
    Answer the user's question clearly and helpfully.`

    const responce=await llm.invoke([
        {
            role:'system',
            content:systemPrompt
        },
         {
            role:'human',
            content:state.prompt
        },
    ])


    console.log(responce)
    return{
        ...state,
        aiResponce:responce.content
    }
    
    
}



module.exports=chatAgent;