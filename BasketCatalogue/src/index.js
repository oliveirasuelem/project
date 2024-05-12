const express = require("express");
const morgan=require("morgan");
const database=require("./database");
const cors= require("cors")

//initial config
const app = express();
app.set("port", 3000);
app.listen(app.get("port"));
console.log ("listeneing on port "+app.get("port"));

//middlewares

app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://127.0.0.1:5501"]
}))
app.use(morgan("dev"))
app.use(express.json())


//create API - service to receive queries and give responses- type rest- 
// A RESTful API service is a web service that adheres to the principles of REST 
// (Representational State Transfer), a set of guidelines for creating stateless communications between 
// client and server. It uses HTTP methods (GET, POST, PUT, DELETE) as operations for CRUD 
// (Create, Read, Update, Delete) functionalities on resources, which are represented by URLs. 

//routes
app.get("/products", async (req,res)=>{
    const connection=await database.getConnection();
    const result = await connection.query("select *from project.products");
    console.log(result)

    res.json(result)
})
app.post ("/basket/buy", async (req,res)=>{
    console.log (req.body)
    if (req.body && req.body.length>0){
        res.sendStatus(200);
    }
    res.sendStatus(400);
    
})

