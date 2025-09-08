import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/adminContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import Calendar from "react-calendar";
import { useLoading } from '../../context/loadingContext';
import "react-calendar/dist/Calendar.css"; 
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useState } from 'react'


const Dashboard = () => {


  const { aToken, cancelAppointment, currencySymbol, dashboardData, getDashboardData } = useContext(AdminContext)
  // State for calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showRecord, setShowRecord] = useState(false);
  const [recordType, setRecordType] = useState("");
  const { setLoading } = useLoading();

  // Data for the chart
  const data = [
    { name: "Doctors", count: dashboardData.doctors, color: "#6366F1" },
    { name: "Patients", count: dashboardData.users, color: "#22C55E" },
    { name: "Appointments", count: dashboardData.appointments, color: "#EAB308" },
  ];
  const handleShowRecord = (type) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    setRecordType(type);
    setShowRecord(true);
  
  }



  useEffect(() => {
    if (aToken) {
      getDashboardData()
    }

  }, [aToken])




  return dashboardData && assets && (
    <div className="m-5">
      {/* Top Stats Cards */}
      <div className="flex flex-wrap gap-6">
        {/* Doctors Card */}
        <div className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all">
          <img className="w-14 mr-3" src={assets.doctor_icon} alt="Doctors" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{dashboardData.doctors}</p>
            <p className="text-gray-600">Doctors</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all">
          <img className="w-14 mr-3" src={assets.patients_icon} alt="Patients" />
          <div>
            <p className="text-2xl font-bold text-green-800">{dashboardData.users}</p>
            <p className="text-gray-600">Patients</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div
          className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all"
          onClick={() => handleShowRecord("appointments")}
        >
          <img className="w-14 mr-3" src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className="text-2xl font-bold text-yellow-800">
              {dashboardData.appointments}
            </p>
            <p className="text-gray-600">Total Appointments</p>
          </div>
        </div>

        {/* Earnings Card */}
        <div
          className="flex items-center bg-white p-4 min-w-52 rounded-lg shadow-md border border-gray-200 cursor-pointer transform hover:scale-105 transition-all"
          onClick={() => handleShowRecord("earnings")}
        >
          <img className="w-14 mr-3" src={assets.earning_icon} alt="Earnings" />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {currencySymbol} {dashboardData.earning}
            </p>
            <p className="text-gray-600">Total Earnings</p>
          </div>
        </div>

      </div>

      {/* Chart & Calendar Section */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Charts Container */}
        <div className="lg:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Dashboard Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="p-4 shadow-md bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Statistics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#4F46E5" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="p-4 shadow-md bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Trends Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Schedule</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="w-full border border-gray-300 rounded-lg shadow-sm"
          />
          <p className="text-center text-gray-600 mt-3">
            Selected Date: <span className="font-medium">{selectedDate.toDateString()}</span>
          </p>
        </div>
      </div>



      {showRecord && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">
        {recordType === "earnings" ? "Earnings by Month" : "Completed Appointments by Month"}
      </h2>
      <div className="max-h-60 overflow-y-auto p-2 border border-gray-300 rounded">
        {(() => {
          const now = new Date();
          const currentMonthName = now.toLocaleString("default", { month: "long" });
          const currentYear = now.getFullYear();

          const previousMonthDate = new Date(now.setMonth(now.getMonth() - 1));
          const previousMonthName = previousMonthDate.toLocaleString("default", { month: "long" });
          const previousYear = previousMonthDate.getFullYear();

          return (
            <>
              <h3 className="text-lg font-semibold mb-2">{`${previousMonthName} ${previousYear}`}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {recordType === "earnings"
                  ? `${currencySymbol} ${dashboardData.monthlyEarnings.previousMonth}`
                  : `${dashboardData.completedAppointments.previousMonth} Completed Appointments`}
              </p>

              <h3 className="text-lg font-semibold mb-2">{`${currentMonthName} ${currentYear}`}</h3>
              <p className="text-sm text-gray-600">
                {recordType === "earnings"
                  ? `${currencySymbol} ${dashboardData.monthlyEarnings.currentMonth}`
                  : `${dashboardData.completedAppointments.currentMonth} Completed Appointments`}
              </p>
            </>
          );
        })()}
      </div>

      <button
        onClick={() => setShowRecord(false)}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
      >
        Close
      </button>
    </div>
  </div>
)}



    </div>
  );
};


export default Dashboard
