import { createContext, useEffect } from "react";
import { doctors } from "../assets/assets";
import axios from 'axios'
import { useState } from "react";
import { toast } from 'react-toastify'


export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = '₦'

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)

  const [userData, setUserData] = useState(false)
  
  
  const [doctors, setDotors] = useState([]);

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

  const loadUserProfileData = async () => {
     try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
      if (data.success) {
        setUserData(data.userData)
      }else{
        toast.error(error.message)
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
    userData,setUserData,
    loadUserProfileData
  }

  useEffect(() => {
    getDoctorsData();
  }, [])

  useEffect(() =>{
if (token) {
  loadUserProfileData()
}else{
  setUserData(false)
}
  },[token])

  return (

    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
export default AppContextProvider