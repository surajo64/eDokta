import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';
import { Users, BookOpen, DollarSign, List } from 'lucide-react';

const EducatorDashboard = () => {
  // get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const [dashboardData, setDashboardData] = useState(null);
  const { backendUrl, adminData, atoken } = useContext(AppContext)

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', { headers: { atoken } })
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <Loading />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back, <span className="text-blue-600">{adminData?.name?.split(' ')[0] || "Educator"}</span> 👋
          </h1>
          <p className="text-gray-500 mt-2">Track your courses, students, and earnings here.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<Users size={24} className="text-blue-600" />}
            value={dashboardData.totalStudents}
            label="Enrolled Students"
            bgIcon="bg-blue-100"
          />

          <StatCard
            icon={<BookOpen size={24} className="text-purple-600" />}
            value={dashboardData.totalCourses}
            label="Total Courses"
            bgIcon="bg-purple-100"
          />

          <StatCard
            icon={<DollarSign size={24} className="text-green-600" />}
            value={`$${dashboardData.totalEarnings.toLocaleString()}`}
            label="Total Earnings"
            bgIcon="bg-green-100"
          />
        </div>

        {/* Latest Enrollments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="p-2 bg-blue-100 rounded-lg">
              <List size={20} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Latest Enrollments</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">#</th>
                  <th className="px-6 py-4 text-left font-semibold">Student Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboardData.enrolledStudentsData?.length > 0 ? (
                  dashboardData.enrolledStudentsData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            src={item.student.image}
                            alt="User"
                          />
                          <span className="font-medium text-gray-900">{item.student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.courseTitle}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No enrollments found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern StatCard Component
const StatCard = ({ icon, value, label, bgIcon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${bgIcon}`}>
      {icon}
    </div>
    <div>
      <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  </div>
);

export default EducatorDashboard;
