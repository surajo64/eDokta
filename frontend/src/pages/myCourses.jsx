import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { data, useNavigate } from 'react-router-dom';
import { Line, Circle } from 'rc-progress';
import axios from 'axios';
import { toast } from 'react-toastify';

const myCourses = () => {
  const navigate = useNavigate();
  const { enrolledCourses, fetchUserEnrolledCourse, token, courseDuration, userData, currencySymbol, calculateRating, courseChapterTime, numberOfLecture, backendUrl, } = useContext(AppContext)
  const [progressArray, setProgressArray] = useState([])

  // update getCourseProgress to accept courses param
const getCourseProgress = async (courses = []) => {
  if (!courses.length) return; // nothing to do
  try {
    const tempProgressArray = await Promise.all(
      courses.map(async (course) => {
        const { data } = await axios.post(
          backendUrl + '/api/user/get-course-progress',
          { courseId: course._id },
          { headers: { token: localStorage.getItem("token") } }
        );

        const totalLecture = numberOfLecture(course);
        const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
        return { totalLecture, lectureCompleted };
      })
    );
    setProgressArray(tempProgressArray);
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch course progress");
  }
};

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourse()
    }
  }, [userData,]);

   useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress(enrolledCourses)
    }
  }, [enrolledCourses,]);


  return (
    <>

      {/* My courses Table */}


      <div className="bg-white rounded border text-sm pt-10 pb-36 px-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-blue-800 mb-6">My Enrollments</h1>

        {/* Table headers (hidden on mobile) */}
        <div className="hidden sm:grid grid-cols-[0.5fr_5fr_3fr_3fr_2fr] py-3 px-2 sm:px-6 border-b text-gray-600 font-medium">
          <p>#</p>
          <p>Courses</p>
          <p>Duration</p>
          <p>Completed</p>
          <p>Status</p>
        </div>

        {/* Course list */}
        {enrolledCourses.map((course, index) => (
          <div
            key={index}
            className="flex flex-col sm:grid sm:grid-cols-[0.5fr_5fr_3fr_3fr_2fr] gap-y-2 items-start sm:items-center text-gray-500 py-4 px-2 sm:px-6 border-b hover:bg-blue-50 transition-colors"
          >
            {/* Index */}
            <p className="hidden sm:block">{index + 1}</p>

            {/* Course Info */}
            <div className="flex items-center gap-3 space-x-3 pl-2 md:px-4 md:pl-4">
              <img
                className="w-16 sm:w-24 md:w-28 rounded object-cover"
                src={course.courseThumbnail}
                alt={course.courseTitle} />
              <div className='flex-1'>
                <p className="text-sm font-medium ">{course.courseTitle}</p>
                <Line strokeWidth={2} percent={progressArray[index] ? progressArray[index].lectureCompleted * 100 / progressArray[index].totalLecture : 0} className='bg-gray-300 rounded-full' />
              </div>
            </div>

            {/* Duration */}
            <p className="max-sm:hidden py-4">{courseDuration(course)}</p>

            {/* Completed Lectures */}
            <p>{progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLecture} `} <span className="text-xs">Lectures</span></p>

            {/* Status */}
            <p>
              <button onClick={() => navigate('/player/' + course._id)} className="text-white bg-primary font-medium px-3 py-2">
                {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLecture === 1 ? "Completed!" : "On Going..."}
              </button>
            </p>

            {/* Mobile-only details */}
            <div className="sm:hidden flex flex-col gap-1 text-xs text-gray-400 pl-1">
              <p>Duration: {courseDuration(course)}</p>
              <p>Completed: 4 / 10 Lectures</p>
              <p>Status: On Going..</p>
            </div>
          </div>
        ))}
      </div>





    </>
  )
}

export default myCourses
