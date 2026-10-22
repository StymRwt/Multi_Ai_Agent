const dotenv=require('dotenv')
const {ChatGroq} =require('@langchain/groq')
dotenv.config()
const { ChatGoogleGenerativeAI } =require('@langchain/google-genai')

// const llm = new ChatGoogleGenerativeAI({
//     model: "gemini-3.5-flash",
  
    
// })


const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})






const getModel=(agent)=>{

    switch (agent) {
        case "chat":
            
         return   llm;
    
        default:
        return    llm;
    }

}


module.exports=getModel;


