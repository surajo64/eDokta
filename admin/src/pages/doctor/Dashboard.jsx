import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { DoctorContext } from '../../context/doctorContext';



const Dashboard = () => {

  const { dToken, currencySymbol, dashboardData, getDashboardData } = useContext(DoctorContext)




  useEffect(() => {
    if (dToken) {
      getDashboardData()
    }
  }, [dToken])


  return dashboardData && assets && (
    <div className="m-5">
       <p className='items-center text-xl font-medium text-semibold mb-6'>
            Welcome Back  {dashboardData.latestAppointment.length > 0 ? dashboardData.latestAppointment[0].docData.name : 'Doctor'}
        </p>

      {/* Top Stats Cards */}
      <div className="flex flex-wrap gap-6">

        {/* Appointments Card */}
        <div className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all">
          <img className="w-14 mr-3" src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className="text-2xl font-bold text-yellow-800">{dashboardData.appointments}</p>
            <p className="text-gray-600">Appointments</p>
          </div>
        </div>

        {/* Completed Appointment Card */}
        <div className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all">
          <img className="w-14 mr-3" src={assets.appointments_icon} alt="Patients" />
          <div>
            <p className="text-2xl font-bold text-green-800">{dashboardData.completed}</p>
            <p className="text-gray-600">Completed</p>
          </div>
        </div>
        {/* Patients Card */}
        <div className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all">
          <img className="w-14 mr-3" src={assets.appointments_icon} alt="Patients" />
          <div>
            <p className="text-2xl font-bold text-green-800">{dashboardData.pending}</p>
            <p className="text-gray-600">Pending...</p>
          </div>
        </div>


        {/* Cancelled Appointment Card */}
        <div className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all">
          <img className="w-14 mr-3" src={assets.appointments_icon} alt="Patients" />
          <div>
            <p className="text-2xl font-bold text-green-800">{dashboardData.cancel}</p>
            <p className="text-gray-600">Cancelled</p>
          </div>
        </div>
        {/* Earnings Card */}
        <div className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all">
          <img className="w-14 mr-3" src={assets.earning_icon} alt="Doctors" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{currencySymbol} {dashboardData.earning}</p>
            <p className="text-gray-600">Total Earning</p>
          </div>
        </div>


      </div>

      {/* Latest appointment */}

<div className="flex flex-col items-center mt-10 w-full">
  {/* Header */}
  <div className="flex items-center gap-2.5 px-6 py-4 rounded-t-md border w-full max-w-3xl bg-white shadow-md">
    <img src={assets.list_icon} alt="List Icon" className="w-6 h-6" />
    <p className="font-semibold text-lg text-gray-700">Latest Appointments</p>
  </div>

  {/* Appointments List */}
  <div className="py-4 w-full max-w-3xl border border-t-0 bg-white shadow-md rounded-b-md">
    {dashboardData.latestAppointment.map((item, index) => (
      <div key={index} className="flex flex-wrap items-center gap-6 justify-between text-gray-600 py-3 px-6 border-b hover:bg-blue-50">
      
        
        {/* User Info */}
        <div className="flex items-center gap-3">
            {/* Serial Number */}
        <p className="hidden sm:block font-medium text-gray-700">{index + 1}</p>
          <img className="w-10 h-10 rounded-full border" src={item.userData.image} alt="User" />
        </div>

        <div className='flex-1 '>
        <p className="font-medium text-gray-800">{item.userData.name}</p>
        <p>{item.slotDate}</p>
        </div>
        
        {/* Status Buttons */}
        {item.cancelled && (
          <button className="sm:min-w-40 py-1 px-3 border border-red-600 rounded text-red-600 bg-red-50 cursor-not-allowed">
            Cancelled!
          </button>
        )}

        {item.approve && item.payment && item.isCompleted && !item.cancelled && (
          <button className="text-sm text-white text-center sm:min-w-40 px-3 py-1 border rounded bg-green-500 cursor-not-allowed">
            Completed!
          </button>
        )}
        
        {!item.cancelled && !item.payment && !item.approve &&<button className='text-sm text-sm text-white text-center sm:min-w-40 px-3 py-1 border rounded bg-blue-300 cursor-not-allowed'>Pending....</button>}

        {!item.cancelled && item.payment && !item.isCompleted && <button className='text-sm text-sm text-white text-center sm:min-w-40 px-3 py-1 border rounded bg-green-300 cursor-not-allowed'>Processing....</button>}

        {item.approve && !item.payment && (
          <button className="text-sm cursor-not-allowed text-white text-center sm:min-w-40 px-3 py-1 border rounded bg-blue-500">
            Approved!
          </button>
        )}
      </div>

    
      ))}
      </div>
    </div>

  </div>  
  );
}
export default Dashboard
