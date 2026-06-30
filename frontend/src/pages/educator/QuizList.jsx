import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/loading";
import { assets } from "../../assets/assets";

const QuizList = () => {
  const { atoken, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/educator/quiz-list`, {
        headers: { atoken },
      });
      if (data.success) {
        setQuizzes(data.quizzes || []);
      } else {
        toast.error(data.message || "Failed to fetch quizzes");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/educator/delete-quiz/${quizId}`,
        { headers: { atoken } }
      );
      if (data.success) {
        toast.success(data.message || "Quiz deleted successfully!");
        fetchQuizzes();
      } else {
        toast.error(data.message || "Failed to delete quiz");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-xl rounded-3xl min-h-[400px]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          📝 Quiz List
        </h2>
        <button
          onClick={() => navigate("/add-quiz")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow transition duration-200"
        >
          + Add New Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4 font-medium">No quizzes have been created yet.</p>
          <button
            onClick={() => navigate("/add-quiz")}
            className="text-blue-600 hover:underline font-semibold"
          >
            Create your first quiz now &rarr;
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Course Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Total Questions
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {quizzes.map((quiz) => (
                <tr key={quiz._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-800">
                      {quiz.courseId?.courseTitle || "Deleted Course"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600">
                    {quiz.questions?.length || 0} Questions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() =>
                        navigate("/add-quiz", {
                          state: { courseId: quiz.courseId?._id },
                        })
                      }
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg transition duration-150 inline-flex items-center gap-1.5 font-semibold"
                    >
                      <img src={assets.edit_icon} alt="Edit" className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3.5 py-1.5 rounded-lg transition duration-150 inline-flex items-center gap-1.5 font-semibold"
                    >
                      <img src={assets.cross_icon} alt="Delete" className="w-3 h-3" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizList;
