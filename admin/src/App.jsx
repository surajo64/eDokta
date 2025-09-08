import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingOverlay from './components/loadingOverlay.jsx';


// Context
import { AdminContext } from './context/adminContext.jsx';
import { DoctorContext } from './context/doctorContext.jsx';

// Components & Pages
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import AdminLogin from './pages/admin.jsx';
import DoctorLogin from './pages/doctor.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AddDoctor from './pages/admin/AddDoctor.jsx';
import AllAppointment from './pages/admin/AllAppointment.jsx';
import DoctorsList from './pages/admin/DoctorList.jsx';
import AllPatient from './pages/admin/allPatient.jsx';
import AddAdmin from './pages/admin/addAdmin.jsx';
import AdminList from './pages/admin/allAdmin.jsx';
import DoctorDashboard from './pages/doctor/Dashboard.jsx';
import MyAppointment from './pages/doctor/myAppointment.jsx';
import DoctorProfile from './pages/doctor/doctorProfile.jsx';
import ChangePassword from './pages/doctor/changePassword.jsx';
import ForgotPassword from './pages/admin/ForgotPassword.jsx'
import ResetPassword from './pages/admin/resetPassword.jsx'
import DoctorResetPassword from './pages/doctor/resetPassword.jsx'
import DoctorForgotPassword from './pages/doctor/ForgotPassword.jsx'
import AddSpeciality from './pages/admin/addSpeciality.jsx'
import TelehealthRoom from './pages/doctor/telehealth.jsx'

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // Delay to simulate loading
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <ToastContainer />
      {loading && <LoadingOverlay />}

      {aToken || dToken ? (
        <div className='bg-gray-200 min-h-[50px] max-h-full p-4 overflow-auto'>
          <Navbar />
          <div className='flex items-start'>
            <Sidebar />
            <Routes>
              {/* Admin Routes */}
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/all-appointment' element={<AllAppointment />} />
              <Route path='/doctors-list' element={<DoctorsList />} />
              <Route path='/patient-list' element={<AllPatient />} />
              <Route path='/add-admin' element={<AddAdmin />} />
              <Route path='/admin-list' element={<AdminList />} />
              <Route path='/fee-speciality' element={<AddSpeciality />} />

              {/* Doctor Routes */}
              <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
              <Route path='/doctor-appointment' element={<MyAppointment />} />
              <Route path='/doctor-profile' element={<DoctorProfile />} />
              <Route path='/change-password' element={<ChangePassword />} />
              <Route path='/telehealth/:appointmentId' element={<TelehealthRoom/>} />

              {/* Redirect unknown paths */}
              <Route path="*" element={<Navigate to={aToken ? '/admin-dashboard' : '/doctor-dashboard'} />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Login & Reset Pages */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/doctor" element={<DoctorLogin />} />
          <Route path='/admin-reset-password/:token' element={<ResetPassword />} />
          <Route path='/admin-forgot-password' element={<ForgotPassword />} />
          <Route path='/doctor-reset-password/:token' element={<DoctorResetPassword />} />
          <Route path='/doctor-forgot-password' element={<DoctorForgotPassword />} />
          <Route path="*" element={<Navigate to="/doctor" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
