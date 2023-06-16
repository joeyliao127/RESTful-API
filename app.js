const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student.js");
app.set("view engin", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/school")
  .then(() => {
    console.log("Connected！");
  })
  .catch((e) => {
    console.log(e);
  });
app.get("/students", async (req, res) => {
  try {
    let studentList = await Student.find({}).exec();
    res.send(studentList);
  } catch (e) {
    res.status(500).send("Server site error...");
    console.log(e);
  }
});

app.get("/students/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id: _id }).exec();
    res.send("找到的學生為：" + foundStudent.name);
  } catch (e) {
    res.status(500).send("Server site error...");
  }
});
app.get("/", (req, res) => {
  res.send("Hi! Here is Web Server");
});
app.listen(3000, () => {
  console.log("Server is running....");
});
app.post("/students", async (req, res) => {
  let { name, age, major, merit, other } = req.body;
  try {
    let newStudent = new Student({
      name,
      age,
      major,
      scholarship: {
        merit,
        other,
      },
    });
    let saveStudent = await newStudent.save();
    return res.send({
      msg: "儲存成功",
      saveObj: saveStudent,
    });
  } catch (e) {
    res.status(500).send("Server site error...");
  }
});

app.put("/students/:_id", async (req, res) => {
  try {
    let newData = await Student.findOneAndUpdate(
      { _id: _id },
      {
        name,
        age,
        major,
        merit,
        other,
      },
      {
        new: true,
        runValidators: true,
        overwrite: true,
        //因為HTTP put request定義上客戶端所有數據，所以
        //需要根據客戶端提供的數據來更新資料庫內的資料
        //Put就是全改，Patch才是改部分。
      }
    );
    res.status(400).send("更新失敗..." + e);
  } catch (e) {}
  let { _id } = req.params;
  let { name, age, major, merit, other } = req.body;

  res.send({ msg: "成功更新資料！", updateDate: newData });
});

class NewData {
  constructor() {}
  setProperty(key, value) {
    if (key !== "merit" && "other") {
      this[key] = value;
    } else {
      the[`scholarship.${key}`] = value;
    }
  }
}
app.patch("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.body;
    let newObject = new NewData();
    for (let property in req.body) {
      newObject.setProperty(property, req.body[property]);
    }
    console.log(req.body);
    console.log(newObject);
  } catch (e) {
    res.status(400).send("更新失敗..." + e);
  }
});
