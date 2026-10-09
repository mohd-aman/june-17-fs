const app = require('./app')
const connectDB = require("./config/db");

const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("SERVER is running on PORT : ", PORT);
  });
});
