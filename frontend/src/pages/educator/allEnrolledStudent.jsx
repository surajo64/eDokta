import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const AllStudentEnrolled = () => {
  const [students, setStudents] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [courses, setCourses] = useState([]);
  const { currencySymbol, backendUrl, atoken } = useContext(AppContext);

  const fetchEnrolledStudents = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/educator/enrolled-students-filtered',
        {
          headers: { atoken },
          params: {
            searchTerm: searchTerm || undefined,
            courseId: courseFilter !== 'all' ? courseFilter : undefined
          }
        }
      );

      if (data.success) {
        setStudents(data.enrolledStudents);
        setFilteredStudents(data.enrolledStudents);

        // Extract unique courses for filter
        const uniqueCourses = [...new Map(
          data.enrolledStudents.map(item => [item.courseId, { id: item.courseId, title: item.courseTitle }])
        ).values()];
        setCourses(uniqueCourses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch enrolled students error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch enrolled students');
    }
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  useEffect(() => {
    if (!students) return;

    let filtered = [...students];

    // Filter by course
    if (courseFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.courseId === courseFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(enrollment =>
        enrollment.student.name?.toLowerCase().includes(searchLower) ||
        enrollment.courseTitle?.toLowerCase().includes(searchLower) ||
        enrollment.student.email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredStudents(filtered);
  }, [searchTerm, courseFilter, students]);

  const getProgressColor = (progress) => {
    if (progress === 'Completed') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const calculateStats = () => {
    if (!students) return { total: 0, completed: 0, ongoing: 0, revenue: 0 };

    return {
      total: students.length,
      completed: students.filter(s => s.progress === 'Completed').length,
      ongoing: students.filter(s => s.progress === 'On Going').length,
      revenue: students.reduce((sum, s) => sum + (s.amount || 0), 0)
    };
  };

  const stats = calculateStats();

  return students ? (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="w-full h-full bg-white shadow-xl rounded-3xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Student Enrollments</h1>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by student or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
            />

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Enrollments</p>
            <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Ongoing</p>
            <p className="text-2xl font-bold text-amber-700">{stats.ongoing}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-700">
              {currencySymbol}{stats.revenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-300 shadow-sm">
          <table className="table-auto w-full text-sm text-gray-500">
            <thead className="text-gray-900 border-b border-gray-300 text-left bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Enrolled Date</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No enrollments found matching your criteria
                  </td>
                </tr>
              ) : (
                Array.isArray(filteredStudents) && filteredStudents.map((student, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.student.image || student.student.imageUrl || '/default-avatar.png'}
                          alt="Student"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{student.student.name}</p>
                          <p className="text-xs text-gray-500">{student.student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-700">{student.courseTitle}</span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(student.purchaseDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${student.progressPercentage || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {student.progressPercentage || 0}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProgressColor(student.progress)}`}>
                        {student.progress}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} enrollments
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default AllStudentEnrolled;
