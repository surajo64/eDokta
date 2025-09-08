import { createContext } from "react";
import { useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const currencySymbol = '₦'
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
const navigate = useNavigate();
  const [appointments, setAppointments] = useState([])
  const [dashboardData, setDashboardData] = useState(false)
  const [docData, setDocData] = useState(false)





  const getAppointments = async () => {

  /*  try {*/

      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })
      if (data.success) {
        setAppointments(data.appointments.reverse())

      } else {
        toast.error(data.message)
      }

  /*  } catch (error) {
      toast.error(error.message)
    }*/
  }



  // cancel appointment function
  const cancelAppointment = async (appointmentId, setLoading) => {
    setLoading(true);
  
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })
      if (data.success) {
        toast.success(data.message)
        getAppointments()

      } else {
        toast.error(data.message)
      }

    } catch (error) {

    }finally {
      setLoading(false);}
  }


  // Approve Appointment

  const approveAppointment = async (appointmentId, setLoading) => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/approve-appointment', { appointmentId }, { headers: { dToken } })

      if (data.success) {
        toast.success(data.message)
        getAppointments() // Refresh the appointment list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
    }finally {
      setLoading(false);}
  };
  // cancel appointment function
  const completeAppointment = async (appointmentId, setLoading) => {
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })

      console.log("appointment Data:", dToken)
      if (data.success) {
        toast.success(data.message)
        getAppointments()

      } else {
        toast.error(data.message)
      }

    } catch (error) {

    }finally {
      setLoading(false);}
  }


  // get Dashboard Data 

  const getDashboardData = async () => {

    const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })

    if (data.success) {
      setDashboardData(data.dashboardData)
      console.log("API Response", data.dashboardData)

    } else {
      toast.error("Failed to fetch dashboard Data.")
    }
  }

  const getProfileData = async () => {
    try {


      const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })

      if (data.success) {
        setDocData(data.docData)

      } else {
        console.log(data.message || "Failed to load profile.");
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // clinical note 
  const ClinicalNote = async () => {


    const formData = new FormData();
    formData.append("clinicalNote", appointments.clinicalNote);
    formData.append("diagnosis", appointments.diagnosis);
    formData.append("prescription", appointments.prescription);
    
    const { data } = await axios.post(backendUrl + "/api/doctor/clinical-note", FormData, {headers:{dToken}});

      if (data.success) {
        completeAppointment(selectedAppointment._id);
        alert("Note recorded successfully!");
      } else {
        alert("Failed to record note.");
      }
    
  }

  

  

  const value = {
    dToken, setDToken,
    backendUrl,getAppointments,
    setAppointments, appointments,
    getDashboardData, setDashboardData,
    dashboardData, approveAppointment,
    cancelAppointment, completeAppointment,
    currencySymbol, getProfileData,
    docData, setDocData,ClinicalNote
  }
  return (

    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}
export default DoctorContextProvider