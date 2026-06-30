import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'






export const AdminContext = createContext();

const AdminContextProvider = (props) =>{
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '' )

  const [doctors, setDoctors] = useState([])
  const [appointments, setappointments] = useState([])
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [specialityData, setSpecialityData] = useState([])
  const [dashboardData, setDashboardData] = useState(false)
  const [docData, setDocData] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  

const currencySymbol = '₦'
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
  
      try {
        const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers: {aToken}})
        if (data.success) {
          setDoctors(data.doctors.reverse())
          console.log(data.doctors)

        }else{
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.message)
      }
      
    }

    const changeAvailability = async (docId, setLoading) => {
      setLoading(true); 
      try {
        const {data} = await axios.post(backendUrl + '/api/admin/change-availability', {docId}, {headers: {aToken}})
        if (data.success) {
          toast.success(data.message)
          getAllDoctors()
        }else{
          toast.error(error.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }finally {
        setLoading(false);}
    }
 
    // get allDoctorsAppoint
const  allDoctorsAppointments = async () => {
  
  try {
  
    const {data} = await axios.get(backendUrl + '/api/admin/appointments', {headers:{aToken}})

    if (data.success) { 
      setappointments(data.appointments.reverse())
      console.log(data.appointments)
    }else{
      toast.error(error.message)
    }
    
    } catch (error) {
      toast.error(error.message)
    }

}

// cancel appointment function
const cancelAppointment = async (appointmentId) => {
  try {
    const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })
    if (data.success) {
      toast.success(data.message)
      allDoctorsAppointments()

    } else {
      toast.error(data.message) 
    }

  } catch (error) {

  }
}


// Approve Appointment

  const approveAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/approve-appointment', { appointmentId }, { headers: { aToken } })

      if (data.success) {
        toast.success(data.message)
        allDoctorsAppointments() // Refresh the appointment list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
      toast.error("Something went wrong.");
    }
  };

  
// get all Patient list
const  getAllPatients = async () => {
  
  try {
  
const { data } = await axios.get(backendUrl + '/api/admin/patients-list',{ headers: { aToken } })
    
    if (data.success) {
      setUsers(data.users)
      console.log(data.users)
      
    }else{
      toast.error("Failed to fetch patients.")
    }
    
    } catch (error) {
      toast.error(error.message)
    }

}

// get Dashboard Data 

const getDashboardData = async () => {

  const { data } = await axios.get(backendUrl + '/api/admin/dashboard',{ headers: { aToken } })

if (data.success) {
  setDashboardData(data.dashboardData)
  console.log(data.dashboardData)
  
}else{ 
  toast.error("Failed to fetch dashboard Data.")
}
}

// get all Patient list
const  getAllAdmin = async () => {
  
    try {
    
  const { data } = await axios.get(backendUrl + '/api/admin/admin-list',{ headers: { aToken } })
      
      if (data.success) {
        setAdmins(data.admins)
        console.log(data.admins)
        
      }else{
        toast.error("Failed to fetch patients.")
      }
      
      } catch (error) {
        toast.error(error.message)
      }
  
  }


  // get all Patient list
const  getAllSpeciality = async () => {
  console.log("Full API Response:", specialityData);
  try {
  const { data } = await axios.get(backendUrl + '/api/admin/speciality-list',{ headers: { aToken } })
  console.log("Full API Response:", data.specialityData);
    if (data.success) {
      setSpecialityData(data.specialityData)
      console.log(data.specialityData)
      
    }else{
      toast.error("Failed to fetch patients.")
    }
    
   } catch (error) {
      toast.error(error.message)
    }

}

  // API to handle view note
  const handleViewNote = async (appointmentId) => {
      try {
    const { data } = await axios.get(
      `${backendUrl}/api/admin/appointment/${appointmentId}`,
      { headers: { aToken }, });

    if (data.success && data.appointment) {
      setSelectedAppointment(data.appointment);
      setShowNote(true);
    } else {
      alert("Failed to load clinical notes.");
    }
      } catch (error) {
        console.error("Error fetching clinical notes:", error);
        alert("An error occurred while fetching the clinical note.");
      }
  }


  



  const value = {
      aToken,setAToken,handleViewNote,
      backendUrl, doctors,getAllSpeciality,
      getAllDoctors,specialityData,setSpecialityData,
      changeAvailability,docData,
      allDoctorsAppointments,
    appointments,selectedAppointment, setSelectedAppointment,
    cancelAppointment,setDocData,
    approveAppointment,
    getAllPatients,setDoctors,
    users, setUsers,
    getDashboardData,
    dashboardData,setAdmins,
    admins,getAllAdmin,currencySymbol

    }
    return (

      <AdminContext.Provider value={value}>
        {props.children}
      </AdminContext.Provider>
  
    )
  }
  export default AdminContextProvider