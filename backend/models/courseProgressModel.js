
import mongoose from "mongoose";



const courseProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  certificateUrl: { type: String, default: "" }, // certificate URL
  completed: { type: Boolean,default: false},
  lectureCompleted:[],
  // ✅ Quiz result tracking
  quizTaken: { type: Boolean, default: false },
  quizScore: { type: Number, default: 0 }, // percentage score
  quizPassed: { type: Boolean, default: false }, // true if score >= passMark
  quizAnswers: [
    {
      questionId: String,
      selectedOption: String,
      isCorrect: Boolean,
    },
  ],
},{ timestamps: true } // Auto-add createdAt & updatedAt
)

const  CourseProgress = mongoose.model('CourseProgress', courseProgressSchema)

export default  CourseProgress;