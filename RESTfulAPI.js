const express = require("express");
const app = express();
const mongoose = require("mongoose");
const studentModel = require("/models/schema");
const port = 3000;
mongoose
  .connect("mongodb://127.0.0.1/shcool")
  .then(() => {
    console.log("已成功連接到school DB！！");
  })
  .catch((e) => {
    console.log(e);
  });
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
//當Client傳送Post res並帶有資料，加入express.urlencoded才可以透過req取得post res的資料
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Home Page!!!");
});
//發出請求至少有兩種情況
//第一種是找到資料，第二種事查無資料，所以要用if else來確認狀態
app.get("/student/:_id", (req, res) => {
  const _id = req.params;
});
app.listen(3000, () => {
  console.log(`Server is listening Port ${port}...`);
});
