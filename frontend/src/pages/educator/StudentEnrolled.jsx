import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentEnrolled = () => {
  const [students, setStudents] = useState(null);
  const { backendUrl, atoken, } = useContext(AppContext);


  const fetchEducatorStudents = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', { headers: { atoken } })
      if (data.success) {
        setStudents(data.enrolledStudents)

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message);
    }
  };



  useEffect(() => {
    fetchEducatorStudents();
  }, [students]);


  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [modalCourseContent, setModalCourseContent] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingCourse, setUpdatingCourse] = useState(false);

  const openProgressModal = async (student) => {
    setSelectedEnrollment(student);
    setModalCourseContent(null);
    setShowModal(true);

    // Fetch Course Content to show lectures
    try {
      const { data } = await axios.get(`${backendUrl}/api/educator/course/${student.courseId}`, { headers: { atoken } });
      if (data.success) {
        setModalCourseContent(data.course.courseContent);
      } else {
        toast.error("Failed to load course details");
      }
    } catch (error) {
      toast.error("Error fetching course details");
    }
  };

  const handleProgressUpdate = async ({ lectureId, markAsCompleted, chapterId, isCourseCompleted }) => {
    if (!selectedEnrollment) return;
    setIsUpdating(true);
    if (isCourseCompleted !== undefined) setUpdatingCourse(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/educator/update-student-progress`, {
        userId: selectedEnrollment.student._id,
        courseId: selectedEnrollment.courseId,
        lectureId,
        chapterId,
        markAsCompleted,
        isCourseCompleted
      }, { headers: { atoken } });

      if (data.success) {
        // Update local state from response
        const updatedLectures = data.progress.lectureCompleted;
        const isFinished = data.progress.completed;
        const certificateUrl = data.certificateUrl || data.progress.certificateUrl;

        const updatedStudent = {
          ...selectedEnrollment,
          completedLectures: updatedLectures,
          progress: isFinished ? "Completed" : "On Going",
          quizPassed: data.progress.quizPassed,
          quizTaken: data.progress.quizTaken,
          quizScore: data.progress.quizScore,
          certificateUrl: certificateUrl,
          progressPercentage: data.progressPercentage,
          completedCount: data.completedCount,
          totalLectures: data.totalLectures
        };

        setSelectedEnrollment(updatedStudent);

        // Update main list
        setStudents(students.map(s =>
          s.student._id === selectedEnrollment.student._id && s.courseId === selectedEnrollment.courseId
            ? {
              ...s,
              completedLectures: updatedLectures,
              progress: isFinished ? "Completed" : "On Going",
              quizPassed: data.progress.quizPassed,
              quizTaken: data.progress.quizTaken,
              quizScore: data.progress.quizScore,
              certificateUrl: certificateUrl,
              progressPercentage: data.progressPercentage,
              completedCount: data.completedCount,
              totalLectures: data.totalLectures
            }
            : s
        ));

        toast.success(isCourseCompleted === true ? "Course Marked Completed (Certificate Generated)" : isCourseCompleted === false ? "Course Unmarked" : chapterId ? "Chapter Updated" : "Progress Updated");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
      setUpdatingCourse(false);
    }
  }

  // Handle Retake Quiz
  const handleRetakeQuiz = async (student) => {
    if (!window.confirm(`Are you sure you want to reset quiz progress for ${student.student.name}?`)) return;

    try {
      const { data } = await axios.post(`${backendUrl}/api/educator/reset-student-progress`, {
        userId: student.student._id,
        courseId: student.courseId
      }, { headers: { atoken } });

      if (data.success) {
        toast.success("Progress reset successfully");
        fetchEducatorStudents(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle Certificate Generation
  const handleGenerateCertificate = async (student) => {
    try {
      toast.loading("Generating Certificate...");
      const { data } = await axios.post(`${backendUrl}/api/educator/student-certificate`, {
        userId: student.student._id,
        courseId: student.courseId
      }, { headers: { atoken } });

      toast.dismiss();

      if (data.success) {
        window.open(data.certificateUrl, "_blank");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    }
  };


  // Toggle Course Completion
  const toggleCourseCompletion = async () => {
    // Logic to toggle "Completed" status if needed (backend supports isCourseCompleted)
    // For now, let's stick to lecture marking as per main requirement.
  };

  if (!students) {
    return <Loading />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="w-full h-full bg-white shadow-xl rounded-3xl p-8">
        <h1 className="pb-4 text-lg font-medium text-left"> Student Enrolled</h1>

        <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-300 shadow-sm">
          <table className="table-auto w-full text-sm text-gray-500">
            <thead className="text-gray-900 border-b border-gray-300 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">#</th>
                <th className="px-4 py-3 font-semibold truncate">Student Name</th>
                <th className="px-4 py-3 font-semibold truncate">Course Title</th>
                <th className="px-4 py-3 font-semibold truncate">Enrolled Date</th>
                <th className="px-4 py-3 font-semibold truncate">Progress</th>
                <th className="px-4 py-3 font-semibold truncate">Quiz Status</th>
                <th className="px-4 py-3 font-semibold truncate">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(students) && students.map((student, index) => (
                <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50 bg-white">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <img src={student.student.image} alt="" className="w-10 h-10 rounded-full border object-cover" />
                    <span className="truncate hidden md:inline font-medium text-gray-700">{student.student.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.courseTitle}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(student.purchaseDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${student.progressPercentage || (student.progress === 'Completed' ? 100 : 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-600">
                        {student.completedCount !== undefined && student.totalLectures !== undefined
                          ? `${student.completedCount}/${student.totalLectures} (${student.progressPercentage}%)`
                          : `${student.progressPercentage || (student.progress === 'Completed' ? 100 : 0)}%`
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 group relative cursor-help">
                    {!student.hasQuiz ? (
                      <span className="text-gray-400 text-xs italic">Non Quize Course</span>
                    ) : student.quizTaken ? (
                      <div className="relative inline-block">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.quizPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {student.quizPassed ? "Passed" : "Failed"}
                        </span>
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                          Score: {student.quizScore}%
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Not Taken</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openProgressModal(student)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-[10px] font-bold shadow-sm transition active:scale-95"
                      >
                        Manage
                      </button>

                      {student.certificateUrl && (
                        <a
                          href={student.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-[10px] font-semibold border border-blue-200"
                        >
                          PDF
                        </a>
                      )}

                      {student.quizPassed && !student.certificateUrl && (
                        <button
                          onClick={() => handleGenerateCertificate(student)}
                          className="px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 text-[10px] font-semibold border border-green-200"
                        >
                          Cert
                        </button>
                      )}

                      {(student.certificateUrl || (student.quizTaken && !student.quizPassed)) && (
                        <button
                          onClick={() => handleRetakeQuiz(student)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-[10px] font-semibold border border-red-200"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Modal */}
      {showModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Manage Progress</h2>
              <button onClick={() => { setShowModal(false); window.location.reload(); }} className="text-gray-500 hover:text-red-500">✕</button>
            </div>

            <div className="mb-4 flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-600">Student: <span className="font-semibold text-gray-800">{selectedEnrollment.student.name}</span></p>
                <p className="text-sm text-gray-600">Course: <span className="font-semibold text-gray-800">{selectedEnrollment.courseTitle}</span></p>
              </div>
              <button
                disabled={isUpdating}
                onClick={() => handleProgressUpdate({ isCourseCompleted: selectedEnrollment.progress !== "Completed" })}
                className={`px-3 py-1.5 text-xs font-bold flex items-center justify-center gap-2 rounded-lg transition shadow-sm ${selectedEnrollment.progress === "Completed"
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                  }`}
              >
                {updatingCourse && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>}
                {updatingCourse
                  ? "Updating..."
                  : selectedEnrollment.progress === "Completed"
                    ? "Unmark Course Completed"
                    : "Mark Full Course Completed"}
              </button>
            </div>

            <div className="space-y-4">
              {modalCourseContent ? (
                modalCourseContent.map((chapter, cIndex) => (
                  <div key={chapter.chapterId} className="border rounded-md p-3 bg-gray-50 group/chap transition hover:border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-700">{cIndex + 1}. {chapter.chapterTitle}</h3>
                      <button
                        disabled={isUpdating}
                        onClick={() => {
                          const allChapLecIds = chapter.chapterContent.map(l => l.lectureId);
                          const allDone = allChapLecIds.every(id => selectedEnrollment.completedLectures?.includes(id));
                          handleProgressUpdate({ chapterId: chapter.chapterId, markAsCompleted: !allDone });
                        }}
                        className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-600 hover:text-white transition"
                      >
                        {chapter.chapterContent.every(l => selectedEnrollment.completedLectures?.includes(l.lectureId))
                          ? "Unmark Chapter"
                          : "Mark Chapter Completed"}
                      </button>
                    </div>
                    <div className="space-y-2 ml-2">
                      {chapter.chapterContent.map((lecture, lIndex) => {
                        const isCompleted = selectedEnrollment.completedLectures?.includes(lecture.lectureId);
                        return (
                          <div key={lecture.lectureId} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              disabled={isUpdating}
                              onChange={(e) => handleProgressUpdate({ lectureId: lecture.lectureId, markAsCompleted: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className={`text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                              {lIndex + 1}. {lecture.lectureTitle}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <Loading />
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => { setShowModal(false); window.location.reload(); }} className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentEnrolled
