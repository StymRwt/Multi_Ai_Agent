const { StateGraph } = require("@langchain/langgraph");
const agentState = require("./state");

const chatAgent = require("../agents/chatAgent");
const searchAgent = require("../agents/searchAgent");
const codeAgent = require("../agents/codeAgent");
const imageAgent = require("../agents/imageAgent");

const workflow = new StateGraph(agentState);


workflow.addNode("chatAgent", chatAgent);
workflow.addNode("searchAgent", searchAgent);
workflow.addNode("codeAgent", codeAgent);
workflow.addNode("imageAgent", imageAgent);


workflow.addConditionalEdges("__start__", (state) => state.agent, {
  chat: "chatAgent",
  search: "searchAgent",
  code: "codeAgent",
  image: "imageAgent",
});
workflow.addEdge("chatAgent","__end__")

// later 


const graph=workflow.compile();

module.exports=graph;