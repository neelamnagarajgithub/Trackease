const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const employeerouter = require("./routes/employee.route");
const app = express();

dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(morgan('dev'))

app.use(cors({
  origin:"https://employee-tracker-eight.vercel.app/",
  methods:['GET','POST'],
  credentials:true,
}))


const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((err) => {
    console.log("DB Disconnected");
  });


app.use('/api',employeerouter);


const port = process.env.PORT || 11000;

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});