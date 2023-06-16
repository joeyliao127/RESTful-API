const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  age: {
    type: Number,
    default: 18,
    max: [80, "太老了吧"],
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "學生merit有點太多了"],
      default: 0,
    },
    other: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});
const StudentModel = mongoose.model("Student", studentSchema, "studentList");
module.exports = StudentModel; //當其他js檔案require此文件，回傳一個物件，並將student.js內容全部執行一遍。
