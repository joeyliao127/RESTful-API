const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const StudentModel = require("./models/student");
const methodOverride = require("method-override");
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
app.use(methodOverride("_method"));
app.get("/", (req, res) => {
  res.render("index");
});
//發出請求至少有兩種情況
//第一種是找到資料，第二種事查無資料，所以要用if else來確認狀態
app.get("/student", async (req, res) => {
  try {
    let foundStudent = await StudentModel.find().exec();
    res.render("student", { foundStudent });
  } catch (e) {
    res.send(e);
  }
  //   const _id = req.params;
});
app.get("/student/search", async (req, res) => {
  let { student } = req.query;
  console.log("req.query為：", req.query);
  try {
    let result = await StudentModel.find({ name: student }).exec();
    let data = result[0];
    if (data) {
      res.render("personal", { data });
    } else {
      res.status(400).render("404", { student });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(`沒有找到${student}的資訊`);
  }
});

app.get("/student/createData", (req, res) => {
  res.render("create");
});
app.post("/student/createData-submit", (req, res) => {
  let postData = req.body;
  console.log(postData.name);
  const newStudent = new StudentModel({
    name: postData.name,
    age: postData.age,
    major: postData.major,
    scholarship: {
      merit: postData.merit,
      other: postData.other,
    },
  });
  newStudent
    .save()
    .then((message) => {
      console.log(`已經儲存${message}`);
    })
    .catch((err) => {
      console.log(err);
      res.send("新增失敗");
    });
  let data = newStudent;
  res.render("personal", { data });
});
app.get("/student/:_id/edit", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await StudentModel.findOne({ _id });
    res.render("edit", { foundStudent });
  } catch (err) {
    console.log(err);
  }
});

app.put("/student/:_id", async (req, res) => {
  let { _id } = req.params;
  let { name, age, major, merit, other } = req.body;
  console.log(`put request的更新資料為：${name}`);
  try {
    let data = await StudentModel.findOneAndUpdate(
      { _id },
      { name, age, major, scholarship: { merit, other } },
      { new: true, runValidators: true }
    );
    console.log(`updateOne的return：${data}`);
    console.log("更新成功");
    res.render("update-success", { data });
  } catch (err) {
    console.log("更新失敗");
    console.log(err);
    res.send("更新失敗");
  }
});
app.get("/student/delete/:_id", async (req, res) => {
  let _id = req.params;
  let message = await StudentModel.findOneAndDelete({ _id }).then();
  console.log("已經刪除");
  let deleteMessage = `已經刪除${message.name}的資訊`;
  res.render("deleted", { deleteMessage });
});

app.listen(3000, () => {
  console.log(`Server is listening Port ${port}...`);
});
