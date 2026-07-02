import React, { useEffect, useContext, useState } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Appointment from './pages/Appointment'
import MyAppointment from './pages/MyAppointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MyProfile from './pages/MyProfile.jsx'
import ResetPassword from './pages/resetPassword'
import ForgotPassword from './pages/ForgotPassword '
import TelehealthRoom from './pages/telehealthRoom.jsx'
import Test from './pages/test'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from "./context/loadingContext";
import RuralHealth from './pages/ruralHealth'
import Insurance from './pages/insurance'
import AllCourses from './pages/allCourses'
import RegisterCourse from './pages/registerCourse'
import CourseDetails from './pages/courseDetails.jsx'
import Player from './pages/player.jsx'
import Quiz from './pages/quize.jsx'
import StudentMyCourses from './pages/myCourses.jsx'
import PaymentCallback from './pages/payment-callback.jsx'

// Admin/Doctor Contexts
import { AdminContext } from './context/adminContext'
import { DoctorContext } from './context/doctorContext'
import { AppContext } from './context/AppContext'

// Admin/Doctor Layout Components
import AdminNavbar from './components/admin/Navbar'
import AdminSidebar from './components/admin/Sidebar'

// Admin Pages
import AdminLogin from './pages/admin.jsx'
import AdminForgotPassword from './pages/admin/ForgotPassword.jsx'
import AdminResetPassword from './pages/admin/resetPassword.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AddDoctor from './pages/admin/AddDoctor.jsx'
import AllAppointment from './pages/admin/AllAppointment.jsx'
import DoctorsList from './pages/admin/DoctorList.jsx'
import AllPatient from './pages/admin/allPatient.jsx'
import AddAdmin from './pages/admin/addAdmin.jsx'
import AdminList from './pages/admin/allAdmin.jsx'
import EducatorList from './pages/admin/allEducators.jsx'
import AddSpeciality from './pages/admin/addSpeciality.jsx'

// Doctor Pages
import DoctorLogin from './pages/doctor.jsx'
import DoctorForgotPassword from './pages/doctor/ForgotPassword.jsx'
import DoctorResetPassword from './pages/doctor/resetPassword.jsx'
import DoctorDashboard from './pages/doctor/Dashboard.jsx'
import DoctorMyAppointment from './pages/doctor/myAppointment.jsx'
import DoctorProfile from './pages/doctor/doctorProfile.jsx'
import DoctorChangePassword from './pages/doctor/changePassword.jsx'
import DoctorTelehealthRoom from './pages/doctor/telehealth.jsx'

// Educator Pages
import EducatorDashboard from './pages/educator/educator-dashboard.jsx'
import MyCourses from './pages/educator/MyCourses.jsx'
import AddCourse from './pages/educator/AddCourse.jsx'
import UpdateCourse from './pages/educator/updateCourse.jsx'
import StudentEnrolled from './pages/educator/StudentEnrolled.jsx'
import AllStudentEnrolled from './pages/educator/allEnrolledStudent.jsx'
import AddQuiz from './pages/educator/addQuiz.jsx'
import QuizList from './pages/educator/QuizList.jsx'
import AllUsers from './pages/educator/users.jsx'
import AddEducator from './pages/educator/addEducator.jsx'
import EducatorAllCourses from './pages/educator/allCourses.jsx'
import EducatorAdminDashboard from './pages/educator/admin-dashboard.jsx'
import EducatorProfile from './pages/educator/EducatorProfile.jsx'
import EducatorSettings from './pages/educator/Settings.jsx'

const App = () => {
  const { setLoading } = useLoading();
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { atoken } = useContext(AppContext);

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMobileMenuOpen(false);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location]);

  const isManagementRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname === '/doctor' ||
    location.pathname.startsWith('/doctor-') ||
    location.pathname.startsWith('/doctor/') ||
    location.pathname.startsWith('/add-doctor') ||
    location.pathname.startsWith('/all-appointment') ||
    location.pathname.startsWith('/doctors-list') ||
    location.pathname.startsWith('/patient-list') ||
    location.pathname.startsWith('/add-admin') ||
    location.pathname.startsWith('/admin-list') ||
    location.pathname.startsWith('/fee-speciality') ||
    location.pathname.startsWith('/change-password') ||
    location.pathname.startsWith('/telehealthRoom') ||
    location.pathname.startsWith('/educator') ||
    location.pathname.startsWith('/add-course') ||
    location.pathname.startsWith('/update-course') ||
    location.pathname.startsWith('/educator-my-courses') ||
    location.pathname.startsWith('/students-enrolled') ||
    location.pathname.startsWith('/all-enrolled-students') ||
    location.pathname.startsWith('/add-quiz') ||
    location.pathname.startsWith('/quiz-list') ||
    location.pathname.startsWith('/all-users') ||
    location.pathname.startsWith('/add-educator') ||
    location.pathname.startsWith('/educator-courses-all') ||
    location.pathname.startsWith('/educator-admin-dashboard') ||
    location.pathname.startsWith('/educator-profile') ||
    location.pathname.startsWith('/educator-settings') ||
    location.pathname.startsWith('/educator-list');

  if (isManagementRoute) {
    return (
      <>
        <ToastContainer />
        {aToken || dToken || atoken ? (
          <div className='bg-slate-50 min-h-screen flex overflow-hidden'>
            <AdminSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <div className='flex-1 flex flex-col min-w-0 overflow-hidden relative'>
              <AdminNavbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
              <div className='flex-1 overflow-y-auto bg-slate-50'>
                <Routes>
                  {/* Admin Routes */}
                  <Route path='/admin-dashboard' element={<Dashboard />} />
                  <Route path='/add-doctor' element={<AddDoctor />} />
                  <Route path='/all-appointment' element={<AllAppointment />} />
                  <Route path='/doctors-list' element={<DoctorsList />} />
                  <Route path='/patient-list' element={<AllPatient />} />
                  <Route path='/add-admin' element={<AddAdmin />} />
                  <Route path='/admin-list' element={<AdminList />} />
                  <Route path='/educator-list' element={<EducatorList />} />
                  <Route path='/fee-speciality' element={<AddSpeciality />} />

                  {/* Doctor Routes */}
                  <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                  <Route path='/doctor-appointment' element={<DoctorMyAppointment />} />
                  <Route path='/doctor-profile' element={<DoctorProfile />} />
                  <Route path='/change-password' element={<DoctorChangePassword />} />
                  <Route path='/telehealthRoom/:appointmentId' element={<DoctorTelehealthRoom />} />

                  {/* Educator Routes */}
                  <Route path='/educator-dashboard' element={<EducatorDashboard />} />
                  <Route path='/educator-my-courses' element={<MyCourses />} />
                  <Route path='/add-course' element={<AddCourse />} />
                  <Route path='/update-course/:id' element={<UpdateCourse />} />
                  <Route path='/students-enrolled' element={<StudentEnrolled />} />
                  <Route path='/all-enrolled-students' element={<AllStudentEnrolled />} />
                  <Route path='/add-quiz' element={<AddQuiz />} />
                  <Route path='/quiz-list' element={<QuizList />} />
                  <Route path='/all-users' element={<AllUsers />} />
                  <Route path='/add-educator' element={<AddEducator />} />
                  <Route path='/educator-courses-all' element={<EducatorAllCourses />} />
                  <Route path='/educator-profile' element={<EducatorProfile />} />
                  <Route path='/educator-settings' element={<EducatorSettings />} />
                  <Route path='/educator-admin-dashboard' element={<EducatorAdminDashboard />} />

                  {/* Redirect unknown paths */}
                  <Route path="*" element={<Navigate to={aToken ? '/admin-dashboard' : dToken ? '/doctor-dashboard' : '/educator-dashboard'} />} />
                </Routes>
              </div>
            </div>
          </div>
        ) : (
          <Routes>
            {/* Login & Reset Pages */}
            <Route path="/admin" element={<Navigate to="/login" />} />
            <Route path="/doctor" element={<Navigate to="/login" />} />
            <Route path='/admin-reset-password/:token' element={<AdminResetPassword />} />
            <Route path='/admin-forgot-password' element={<AdminForgotPassword />} />
            <Route path='/doctor-reset-password/:token' element={<DoctorResetPassword />} />
            <Route path='/doctor-forgot-password' element={<DoctorForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </>
    );
  }

  return (
    <div className='mx-4 sm:mx-[5%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/ruralhealth' element={<RuralHealth />} />
        <Route path='/insurance' element={<Insurance />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointment' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/telehealth/:appointmentId' element={<TelehealthRoom />} />
        <Route path='/education-training' element={<AllCourses />} />
        <Route path='/registercourse' element={<RegisterCourse />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/quiz/:id' element={<Quiz />} />
        <Route path='/my-courses' element={<StudentMyCourses />} />
        <Route path='/payment-callback' element={<PaymentCallback />} />
        <Route path='/test' element={<Test />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
