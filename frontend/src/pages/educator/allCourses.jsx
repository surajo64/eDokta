import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/loading';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AllCourses = () => {
  const [courses, setCourses] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, course: null });
  const { currencySymbol, allCourses, backendUrl, atoken } = useContext(AppContext);
  const navigate = useNavigate();

  const fetchEducatorCourse = async () => {
    setCourses(allCourses);
    setFilteredCourses(allCourses);
  };

  useEffect(() => {
    fetchEducatorCourse();
  }, [allCourses]);

  useEffect(() => {
    if (!courses) return;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = courses.filter(course =>
        course.courseTitle?.toLowerCase().includes(searchLower)
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  const handleDeleteCourse = async () => {
    try {
      const { course } = deleteDialog;
      const { data } = await axios.delete(
        `${backendUrl}/api/educator/delete-course/${course._id}`,
        { headers: { atoken } }
      );

      if (data.success) {
        toast.success(data.message);
        // Refresh courses list
        const updatedCourses = courses.filter(c => c._id !== course._id);
        setCourses(updatedCourses);
        setFilteredCourses(updatedCourses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Delete course error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleteDialog({ isOpen: false, course: null });
    }
  };

  const handleEditCourse = (course) => {
    navigate(`/update-course/${course._id}`, { state: { educatorCourses: course } });
  };

  return courses ? (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="w-full h-full bg-white shadow-xl rounded-3xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">All Courses</h1>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search courses by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
          />
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">Total Courses</p>
          <p className="text-2xl font-bold text-blue-700">{courses.length}</p>
        </div>

        <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-300 shadow-sm">
          <table className="table-auto w-full text-sm text-gray-500">
            <thead className="text-gray-900 border-b border-gray-300 text-left bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Earnings</th>
                <th className="px-4 py-3 font-semibold">Students</th>
                <th className="px-4 py-3 font-semibold">Published On</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No courses found matching your search
                  </td>
                </tr>
              ) : (
                Array.isArray(filteredCourses) && filteredCourses.map((course) => (
                  <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={course.courseThumbnail}
                          alt="Course"
                          className="w-16 h-12 rounded-sm object-cover"
                        />
                        <span className="font-medium text-gray-800 max-w-xs truncate">
                          {course.courseTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-700">
                      {currencySymbol} {Math.floor((course.enrolledStudents?.length || 0) * (course.coursePrice - (course.discount * course.coursePrice / 100)))}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {course.enrolledStudents?.length || 0} Students
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium shadow hover:bg-blue-100 focus:ring-2 focus:ring-blue-300 transition text-xs"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, course })}
                          className="px-3 py-1 rounded-lg bg-red-50 text-red-600 font-medium shadow hover:bg-red-100 focus:ring-2 focus:ring-red-300 transition text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, course: null })}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteDialog.course?.courseTitle}"? ${deleteDialog.course?.enrolledStudents?.length > 0
          ? `This course has ${deleteDialog.course.enrolledStudents.length} enrolled student(s).`
          : ''
          }`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  ) : (
    <Loading />
  );
};

export default AllCourses;
