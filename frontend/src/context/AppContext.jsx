import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration';


export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = '₦'

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
  const [atoken, setAtoken] = useState(localStorage.getItem('atoken') ? localStorage.getItem('atoken') : false)
  const [adminData, setAdminData] = useState(localStorage.getItem('adminData') ? JSON.parse(localStorage.getItem('adminData')) : false)
  const [showLogin, setShowLogin] = useState(false)

  const [userData, setUserData] = useState(false)
  const [allCourses, setAllCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [educatorCourses, setEducatorCourses] = useState([])
  const [course, setCourse] = useState(null)
  const [allStudents, setAllStudents] = useState([])
  const [doctors, setDotors] = useState([]);

  useEffect(() => {
    if (atoken) {
      localStorage.setItem('atoken', atoken)
    } else {
      localStorage.removeItem('atoken')
    }
  }, [atoken])

  useEffect(() => {
    if (adminData) {
      localStorage.setItem('adminData', JSON.stringify(adminData))
    } else {
      localStorage.removeItem('adminData')
    }
  }, [adminData])

  const getDoctorsData = async () => {

    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/list')
      if (data.success) {
        setDotors(data.doctors)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Fetch all Students
  const fetchAllStudents = async () => {
    setAllStudents(dummyStudentEnrolled)

  }

  // Fetch all course
  const fetchAllCourse = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/all', { headers: { token } })

      if (data.success) {
        setAllCourses(data.courses)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  // function to calculate average rating
  const calculateRating = (course) => {
    if (!course || !course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating
    });
    return Math.floor(totalRating / course.courseRatings.length)
  }

  // function to Calculate  Course Chapter time

  const courseChapterTime = (chapter) => {
    let time = 0
    chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)

    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'], round: true });
  }

  const numberOfLecture = (course) => {
    let totalLectures = 0;
    course?.courseContent?.forEach(chapter => {
      if (Array.isArray(chapter?.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };


  const courseDuration = (course) => {
    let time = 0;
    course?.courseContent?.forEach((chapter) => {
      chapter?.chapterContent?.forEach((lecture) => {
        time += lecture?.lectureDuration || 0;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'], round: true });
  };


  // function to fetch user enlolled course
  const fetchUserEnrolledCourse = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/enrolled-course', { headers: { token } });
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };




  const adminProfile = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/educator/profile', { headers: { atoken } })

      if (data.success) {
        setAdminData(data.adminData)

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // function to fetch user enlolled course
  const fetchEducatorCourses = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/educator/my-courses",
        { headers: { atoken } }
      );

      if (data.success) {
        setEducatorCourses(data.educatorCourses.reverse());
        setCourse(data.stats); // 🔹 store stats map
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
      if (data.success) {
        let user = data.userData;
        if (user && typeof user.address === 'object' && user.address !== null) {
          user.address = `${user.address.line1 || ''}${user.address.line1 && user.address.city ? ', ' : ''}${user.address.city || ''}`;
        }
        setUserData(user)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const calculateAge = (dob) => {
    const toDay = new Date();
    const birthDate = new Date(dob);
    let age = toDay.getFullYear() - birthDate.getFullYear();
    return age;
  }

  const getAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/all-courses')
      if (data.success) {
        setAllCourses(data.courses)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const value = {
    doctors,
    currencySymbol,
    getDoctorsData,
    token, setToken,
    backendUrl,
    userData, setUserData,
    loadUserProfileData,
    calculateAge,
    atoken, setAtoken,
    adminData, setAdminData,
    showLogin, setShowLogin,
    allCourses, setAllCourses,
    getAllCourses,
    enrolledCourses, setEnrolledCourses,
    educatorCourses, setEducatorCourses,
    course, setCourse,
    allStudents, setAllStudents,
    calculateRating,
    courseChapterTime,
    numberOfLecture,
    courseDuration,
    fetchUserEnrolledCourse,
    fetchAllStudents,
    fetchAllCourse,
    adminProfile,
    fetchEducatorCourses
  }

  useEffect(() => {
    getDoctorsData();
    getAllCourses();
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData();
      fetchUserEnrolledCourse();
    } else {
      setUserData(false);
      setEnrolledCourses([]);
    }
  }, [token])

  useEffect(() => {
    if (atoken) {
      adminProfile();
      fetchEducatorCourses();
    } else {
      setAdminData(false);
      setEducatorCourses([]);
      setCourse(null);
    }
  }, [atoken])

  return (

    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
export default AppContextProvider