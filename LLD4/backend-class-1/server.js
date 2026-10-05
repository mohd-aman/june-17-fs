const express = require('express');

const app = express();

const PORT = 3000;

//in-memory data store
let items = [
  {id:1,name:"Item One"},
  {id:2, name:"Item Two"}
]

//Apply this middleware to every incoming request,
// express.json() is a built-in middleware that:
// Step 1: Checks if the request has a JSON body.
// Step 2: Reads the raw bytes.
// Step 3: Parses them into a JavaScript object.
// Step 4: Attaches the result to req.body.
app.use(express.json());

app.get('/health',(req,res)=>{
  res.status(200).json({
    success:true,
    message:"Server is Health"
  });
})

app.get('/items',(req,res)=>{
  res.json({
    success:true,
    data:items,
    message:"Data Retrieved success"
  })
})

app.post('/items/add',(req,res)=>{
  console.log(req.body);
  const newItem = req.body;
  if(!newItem || !newItem.name){
    return res.status(400).json({
      success:false,
      message:"Item name is missing"
    })
  }
  items.push(newItem);
  res.status(201).json({
    success:true,
    data:newItem,
    message:"Item added"
  });
})

app.use((req,res)=>{
  res.status(404).json({
    success:false,
    message:"Route not found"
  })
})

app.listen(PORT,()=>{
  console.log("SERVER is running on PORT : ", PORT);
})