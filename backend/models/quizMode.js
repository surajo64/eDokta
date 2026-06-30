import mongoose from "mongoose";

// Single Question Schema
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

// Quiz Schema (contains multiple questions)
const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [questionSchema],
});

const Quiz = mongoose.model("Quiz", quizSchema);

export { questionSchema };
export default Quiz;
