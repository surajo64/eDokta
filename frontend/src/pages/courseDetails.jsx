import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loading from '../components/loading';
import { assets } from '../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube'
import axios from 'axios'
import { toast } from 'react-toastify'

const courseDetails = () => {

  const { currencySymbol, calculateRating, courseChapterTime, numberOfLecture, courseDuration, backendUrl, token, setToken, userData, setUserData, } = useContext(AppContext);
  const { id } = useParams();
  const [openSection, setOpenSection] = useState({})
  const [courseData, setCourseData] = useState(null)
  const [isAlreadEnrolled, setIsAlreadEnrolled] = useState(true)
  const [playerData, setPlayerData] = useState(null)
  const [attendanceType, setAttendanceType] = useState('Physical'); // Default to Physical
  const { courseId } = useParams();

  // Set default attendance type based on mode when data loads
  useEffect(() => {
    if (courseData) {
      if (courseData.courseMode === 'Virtual') {
        setAttendanceType('Virtual');
      } else {
        setAttendanceType('Physical');
      }
    }
  }, [courseData]);

  const fetchCourseData = async () => {
    try {

      const { data } = await axios.get(`${backendUrl}/api/user/course/${id}`);

      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const toggleSection = (index) => {
    setOpenSection((prev) => (
      {
        ...prev, [index]: !prev[index],
      }
    ))
  }

  const enrollCourse = async () => {
    if (!userData) return toast.warning("Please Login To Enroll!");
    if (isAlreadEnrolled) return toast.warning("Already Enrolled!");

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id, attendanceType },
        { headers: { token: localStorage.getItem("token") } }
      );

      if (data.success) {
        // 🔹 Save courseId before redirect
        localStorage.setItem("pendingCourseId", courseData._id);

        // 🔹 Redirect to Paystack checkout page
        window.location.href = data.authorization_url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with enrollment!");
    }
  };






  useEffect(() => {
    if (userData && courseData && Array.isArray(userData.enrolledCourses)) {
      setIsAlreadEnrolled(userData.enrolledCourses.includes(courseData._id));
    } else {
      setIsAlreadEnrolled(false);
    }
  }, [userData, courseData]);



  useEffect(() => {
    fetchCourseData();
  }, []);




  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-revers gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">

        <div className='absolute top-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyn-100/70'>

        </div>

        {/* left column */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className="text-3xl font-bold text-gray-800">{courseData.courseTitle}</h1>
          <p className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) || "No description available.", }} />
          {/* review rating */}
          <div className='flex items-center space-x-2 pt-3 pb-2 text-sm'>
            <p>{calculateRating(courseData)}</p>

            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-blue-600">({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? "ratings" : "rating"})</p>
            <p>{courseData.enrollStudents?.length} {courseData.enrollStudents?.length > 1 ? "Students" : "Students"}</p>
          </div>

          <p className="text-sm">
            Course by:{" "}
            <span className="relative group text-blue-600 underline cursor-pointer">
              {courseData.educator.name}

              {/* Popup on hover */}
              <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <p className="text-gray-700 text-xs">{courseData.educator.about}</p>
              </div>
            </span>
          </p>


          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <div className='pt-5'>
              {courseData.courseContent?.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                    <div className='flex items-center gap-2'>
                      <img className={`transfor transition-transform ${openSection[index] ? 'rotate-180' : ''}`}
                        src={assets.down_arrow_icon} alt="arrow icon" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>{chapter.chapterContent?.length} lectures - {courseChapterTime(chapter)}</p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'} `}>
                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600  border-t border-gray-300'>
                      {chapter.chapterContent.map((lecture, i) =>
                        <li key={i} className='flex items-start gap-2 py-1'>
                          <img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1' />
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree && <p
                                onClick={() => setPlayerData({
                                  videoId: lecture.lectureUrl.split('/').pop()
                                })}
                                className='text-blue-500 cursor-pointer'>Preview</p>}
                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className='py-10 text-sm md:text-default'>
            <h3 className='text-lx font-semibold text-gray-800'>Course Description</h3>
            <p className="pt-3 rich-text"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription || "No description available.", }} />
          </div>

        </div>

        {/* right colunm */}
        < div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w[300px] sm:min-w-[420px]'>
          {
            playerData ?
              <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />

              : <img src={courseData.courseThumbnail} alt="" />
          }

          <div className='p-5'>
            <div className='flex items-center gap-2'>


              <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock" />
              <p className='text-red-600'> <span className='font-medium'>5 Days</span> Left at this Price</p>
            </div>
            <div className='flex gap-3 items--center pt-2'>
              {/* Dynamic Price Display */}
              <p className='text-gray-800 md:text-3xl text-2xl font-semibold'>
                {currencySymbol}
                {((attendanceType === 'Physical' && courseData.coursePricePhysical > 0 ? courseData.coursePricePhysical :
                  attendanceType === 'Virtual' && courseData.coursePriceVirtual > 0 ? courseData.coursePriceVirtual :
                    courseData.coursePrice) - courseData.discount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className='md:text-lg text-gray-500 line-through'>
                {currencySymbol}
                {((attendanceType === 'Physical' && courseData.coursePricePhysical > 0 ? courseData.coursePricePhysical :
                  attendanceType === 'Virtual' && courseData.coursePriceVirtual > 0 ? courseData.coursePriceVirtual :
                    courseData.coursePrice)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className='md:text-lg text-gray-500'>{Math.round(courseData.discount / (attendanceType === 'Physical' && courseData.coursePricePhysical > 0 ? courseData.coursePricePhysical : courseData.coursePrice) * 100)}% off</p>
            </div>

            {/* Attendance Toggle */}
            {/* Attendance Toggle */}
            <div className='flex gap-4 pt-4'>
              {(courseData.courseMode === 'Virtual' || courseData.courseMode === 'Both') && (
                <button
                  onClick={() => setAttendanceType('Virtual')}
                  className={`px-4 py-2 rounded border ${attendanceType === 'Virtual' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  Virtual Class
                </button>
              )}

              {(courseData.courseMode === 'Physical' || courseData.courseMode === 'Both') && (
                <button
                  onClick={() => setAttendanceType('Physical')}
                  className={`px-4 py-2 rounded border ${attendanceType === 'Physical' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  Physical Class
                </button>
              )}
            </div>


            <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
              <div className='flex items-center gap-1'>
                <img className='' src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>

              <div className='h-6 w-px gray-500/30'>|</div>

              <div className='flex items-center gap-1'>
                <img className='' src={assets.time_clock_icon} alt="clock icon" />
                <p>{courseDuration(courseData)}</p>
              </div>

              <div className='h-6 w-px gray-500/30'>|</div>

              <div className='flex items-center gap-1'>
                <img className='' src={assets.lesson_icon} alt="clock icon" />
                <p>{numberOfLecture(courseData)} Lessons</p>
              </div>

            </div>

            <button onClick={enrollCourse} className=" md:mt-6 mt-4 py-3 bg-blue-600 text-white w-full font-medium rounded ">
              {isAlreadEnrolled ? 'Alread Enrolled' : 'Enroll Now'}</button>

            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'> What's in the Course?</p>
              <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
                <li>Course Retake when Failed.</li>
              </ul>
            </div>

          </div>
        </div>



      </div>
    </>
  ) : <Loading />
};

export default courseDetails;
