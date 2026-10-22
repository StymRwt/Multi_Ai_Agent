const getModel = require("../config/llmModel");


const router=async(state)=>{
    const llm=await getModel('router')

    const prompt=`
You are an AI agent router.

Your job is to classify the user's request into exactly ONE of these categories:

- chat
- search
- code
- image

Rules:

chat:
- Normal conversation
- General questions
- Explanations that don't require web search

search:
- User asks for current/latest information
- Web search
- News
- Current events
- Real-time information

code:
- Programming questions
- Debugging
- Writing code
- Explaining code
- Algorithms and data structures

image:
- User wants to generate, create, edit, or analyze an image

IMPORTANT:
Return ONLY one word.
Do not explain your decision.
Do not use punctuation.

User request:
${state.prompt}
`

    const responce=await llm.invoke(prompt);

    

    return{
        ...state,
        agent:responce.content.trim().toLowerCase(),
        
    }
}

module.exports=router;