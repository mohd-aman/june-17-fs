const express = require("express");
const itemRoutes = require('./routes/itemRoutes')

const app = express();

//Apply this middleware to every incoming request,
// express.json() is a built-in middleware that:
// Step 1: Checks if the request has a JSON body.
// Step 2: Reads the raw bytes.
// Step 3: Parses them into a JavaScript object.
// Step 4: Attaches the result to req.body.
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

//health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Healthy",
  });
});

//routes
app.use("/items",itemRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;