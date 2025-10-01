require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
connectDB();
app.use(express.json());
app.use(require("morgan")("dev"));
app.get("/",(req,res) => res.send("TRAIN BHAAG RHI HAI"));
const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>console.log(`Server runnig on PORT ${PORT}`));

