import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";


 

const Quiz = ({ user }) => {
  const { token, backendUrl, userData, setUserData } = useContext(AppContext);
  const { id: courseId } = useParams();
 const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // ✅ Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/user/quiz/${courseId}`,
          { headers: { token } }
        );

        // If backend sends { success, quiz }, adjust here:
        setQuiz(res.data.quiz || res.data);
        console.log("Quize:", quiz)
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId, backendUrl, token]);

  // ✅ Handle option select
  const handleOptionChange = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  // Handle submit answer
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.keys(answers).map((qId) => ({
        questionId: qId,
        selectedOption: answers[qId],
      }));

      const { data } = await axios.post(
        `${backendUrl}/api/user/quiz/${courseId}/submit`,
        {
          userId: userData._id,
          answers: formattedAnswers,
        },
        { headers: { token } }
      );

      setResult(data);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / quiz?.questions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Quiz Available</h2>
          <p className="text-gray-600">There is no quiz available for this course yet.</p>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">Course Quiz</h1>
          <p className="opacity-90">Test your knowledge on {quiz.courseId.name}</p>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {!result ? (
          <>
            {/* Question */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {currentQuestion + 1}. {currentQ.questionText}
                </h3>

                <div className="space-y-3">
                  {currentQ.options.map((opt, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${answers[currentQ._id] === opt
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      onClick={() => handleOptionChange(currentQ._id, opt)}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${answers[currentQ._id] === opt
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                          }`}>
                          {answers[currentQ._id] === opt && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700">{opt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className={`px-5 py-2.5 rounded-lg font-medium ${currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Previous
                </button>

                {currentQuestion < quiz.questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!answers[currentQ._id]}
                    className={`px-5 py-2.5 rounded-lg font-medium text-white ${!answers[currentQ._id]
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
                    className={`px-5 py-2.5 rounded-lg font-medium text-white ${submitting || Object.keys(answers).length !== quiz.questions.length
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                      }`}
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : 'Submit Quiz'}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Results section */
          <div className="p-8 text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${result.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
              {result.passed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {result.passed ? 'Congratulations!' : 'Try Again'}
            </h2>

            <p className="text-gray-600 mb-6">
              {result.passed
                ? 'You have successfully passed the quiz.'
                : 'You need to improve your knowledge to pass.'}
            </p>

            <div className="bg-gray-50 rounded-xl p-6 max-w-xs mx-auto mb-6">
              <div className="text-5xl font-bold text-gray-800 mb-2">{result.score}%</div>
              <p className="text-gray-600">Your Score</p>
            </div>

            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${result.passed
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}>
              {result.passed ? 'Passed 🎉' : 'Failed ❌'}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => navigate('/player/' + courseId)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-light cursor-pointer mt-4"
              >
                Back to Course
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;