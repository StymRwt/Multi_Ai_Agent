const graph = require("../../graph/graph")

const testGraph=async()=>{

    const result=await graph.invoke({
        prompt:"what is computer"
    })

    console.log(result)
}

testGraph()