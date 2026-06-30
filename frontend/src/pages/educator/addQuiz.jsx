import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { useLocation } from "react-router-dom";

const AddQuiz = () => {
  const { atoken, educatorCourses, backendUrl, fetchEducatorCourses } =
    useContext(AppContext);

  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const location = useLocation();

  // ✅ Fetch educator's courses once
  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  // ✅ Set selected course from location state if passed
  useEffect(() => {
    if (location.state?.courseId) {
      setSelectedCourse(location.state.courseId);
    }
  }, [location.state]);

  // ✅ Fetch quiz questions when course changes
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!selectedCourse) {
        setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/educator/get-quiz/${selectedCourse}`,
          { headers: { atoken } }
        );
        if (data.success && data.questions && data.questions.length > 0) {
          setQuestions(data.questions.map(q => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer
          })));
        } else {
          setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
      }
    };
    fetchQuiz();
  }, [selectedCourse]);

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  // Update a question field
  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "questionText" || field === "correctAnswer") {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  // Update option
  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  // Save quiz to backend
  const saveQuiz = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course!");
      return;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.questionText.trim()) {
        toast.error(`Question is required`);
        return;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast.error(`Option ${j + 1} is required`);
          return;
        }
      }

      if (!q.correctAnswer.trim()) {
        toast.error(`Question ${i + 1}: Correct answer is required`);
        return;
      }
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/educator/add-quiz`, {
        courseId: selectedCourse,
        questions,
      }, { headers: { atoken } });

      toast.success("Quiz saved successfully!");
      if (data.quiz && data.quiz.questions) {
        setQuestions(data.quiz.questions);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Add Quiz</h2>

      {/* ✅ Course selection dropdown */}
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="border p-2 w-44 rounded "
      >
        <option value="">-- Select Course --</option>
        {educatorCourses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.courseTitle}
          </option>
        ))}
      </select>

      {/* ✅ Grid of questions: 3 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border p-3 rounded-md shadow space-y-2 bg-white"
          >
            <input
              type="text"
              placeholder="Question text"
              value={q.questionText}
              onChange={(e) =>
                updateQuestion(qIndex, "questionText", e.target.value)
              }
              className="border p-2 w-full"
            />

            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className="border p-2"
                />
              ))}
            </div>

            <input
              type="text"
              placeholder="Correct answer"
              value={q.correctAnswer}
              onChange={(e) =>
                updateQuestion(qIndex, "correctAnswer", e.target.value)
              }
              className="border p-2 w-full"
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-4">
        <button
          onClick={addQuestion}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          + Add Question
        </button>

        <button
          onClick={saveQuiz}
          className="bg-green-600 text-white px-3 py-2 rounded ml-2"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
};

export default AddQuiz;
