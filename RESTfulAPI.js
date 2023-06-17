const express = require("express");
const app = express();
const mongoose = require("mongoose");
const studentModel = require("./models/schema");
const cors = require("cors");
const port = 3000;
console.log(`MongoDB連線狀態為：${mongoose.connection.readyState}`);
mongoose
  .connect("mongodb://127.0.0.1:27017/school")
  .then(() => {
    console.log("MongoDB連線狀態為：", mongoose.connection.readyState); //確認連接狀態，1代表連線成功
    console.log("已成功連接到school DB！！");
  })
  .catch((e) => {
    console.log(e);
  });
console.log(`MongoDB連線狀態為：${mongoose.connection.readyState}`);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
//當Client傳送Post res並帶有資料，加入express.urlencoded才可以透過req取得post res的資料
app.use(express.json());
app.use(express.static("public"));
app.use(cors()); //接受同一台電腦任何地方來的請求
app.get("/", (req, res) => {
  res.render("index");
});
//發出請求至少有兩種情況
//第一種是找到資料，第二種事查無資料，所以要用if else來確認狀態
app.get("/student", async (req, res) => {
  try {
    let foundStudent = await studentModel.find().exec();
    console.log(foundStudent[0]._id);
    res.render("student", { foundStudent });
  } catch (e) {
    res.send(e);
  }
  //   const _id = req.params;
});
app.get("/student/:_id", (req, res) => {
  res.send("測試成功！");
});
app.listen(3000, () => {
  console.log(`Server is listening Port ${port}...`);
});
