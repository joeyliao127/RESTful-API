const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: [True, "年齡不能為空！！！"],
  },
  major: {
    type: String,
    required: true,
  },
  scholarship: {
    merit: {
      type: Number,
      default: 0,
    },
    other: {
      type: Number,
      required: function () {
        if (this.scholarship.merit == 0) {
          return true;
        } else {
          return false;
        }
      },
    },
  },
});

const StudentModel = mongoose.model("Student", studentSchema, "studentList"); //第三個參數是optional，當第一個參數Student轉換為複數型態時，若沒有找到DB裡面有名稱叫做複數型態Students的collection，將需要使用第三個參數來指定連接到哪一個collection
module.exports = StudentModel;
