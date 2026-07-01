import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/adminContext'
import { useEffect } from 'react'
import { assets } from '../../assets/admin_assets/assets'
import Calendar from "react-calendar";
import { useLoading } from '../../context/loadingContext';
import "react-calendar/dist/Calendar.css";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useState } from 'react'
import axios from 'axios'
import { Users, BookOpen, TrendingUp, DollarSign, List } from 'lucide-react'


const Dashboard = () => {
  const { aToken, cancelAppointment, currencySymbol, dashboardData, getDashboardData, backendUrl } = useContext(AdminContext)
  // State for calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showRecord, setShowRecord] = useState(false);
  const [recordType, setRecordType] = useState("");
  const { setLoading } = useLoading();
  const [eduDashboardData, setEduDashboardData] = useState(null);

  // Data for the chart
  const data = dashboardData ? [
    { name: "Doctors", count: dashboardData.doctors || 0, color: "#6366F1" },
    { name: "Patients", count: dashboardData.users || 0, color: "#22C55E" },
    { name: "Appointments", count: dashboardData.appointments || 0, color: "#EAB308" },
  ] : [];

  const handleShowRecord = (type) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    setRecordType(type);
    setShowRecord(true);
  }

  const fetchEduDashboardData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/educator/admin-dashboard', { headers: { atoken: aToken } });
      if (data.success) {
        setEduDashboardData(data.dashboardData);
      }
    } catch (error) {
      console.error("Error fetching educator dashboard data:", error);
    }
  };

  useEffect(() => {
    if (aToken) {
      getDashboardData()
      fetchEduDashboardData()
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

      {/* Education Portal Overview */}
      {eduDashboardData && (
        <div className="mt-10 mb-8">
          <div className="border-t border-slate-200 pt-8 mb-6">
            <h2 className="text-xl font-bold text-slate-800">Education Portal Overview</h2>
            <p className="text-slate-500 text-sm mt-1">Key metrics and enrollments for your online learning platform</p>
          </div>

          {/* Educator Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Students */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                <Users size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-800">{eduDashboardData.totalStudents}</h4>
                <p className="text-sm font-semibold text-slate-400">Total Students</p>
              </div>
            </div>

            {/* Total Courses */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-xl bg-purple-100 text-purple-600">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-800">{eduDashboardData.totalCourses}</h4>
                <p className="text-sm font-semibold text-slate-400">Total Courses</p>
              </div>
            </div>

            {/* Active Enrollments */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-xl bg-green-100 text-green-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-800">{eduDashboardData.enrolledStudentsData?.length || 0}</h4>
                <p className="text-sm font-semibold text-slate-400">Active Enrollments</p>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4 hover:shadow-lg transition-all duration-300">
              <div className="p-4 rounded-xl bg-amber-100 text-amber-600">
                <DollarSign size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-800">
                  {currencySymbol} {eduDashboardData.totalEarnings.toLocaleString()}
                </h4>
                <p className="text-sm font-semibold text-slate-400">Total Earnings (Edu)</p>
              </div>
            </div>
          </div>

          {/* Latest Enrollments Table */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <List size={20} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Latest Enrollments</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">#</th>
                    <th className="px-6 py-4 text-left font-semibold">Student Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Course Title</th>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eduDashboardData.enrolledStudentsData?.length > 0 ? (
                    eduDashboardData.enrolledStudentsData.map((item, index) => (
                      <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                              src={item.student?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'}
                              alt="Student"
                            />
                            <span className="font-semibold text-slate-800">{item.student?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.courseTitle}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400 font-semibold">
                        No enrollments found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}



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
