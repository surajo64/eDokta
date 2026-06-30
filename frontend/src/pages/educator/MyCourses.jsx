import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/loading';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';


const MyCourses = () => {
  const { currencySymbol, atoken, educatorCourses, cost, setCourse,backendUrl, fetchEducatorCourses } = useContext(AppContext);
  const navigate = useNavigate();
  const [publishedData, setPublishedData] = useState([])


  const handleUpdateCourse = (educatorCourses) => {
    // Example: navigate to UpdateCourse page with course data
    navigate(`/update-course/${educatorCourses._id}`, { state: { educatorCourses } });
  };


  const handleTogglePublish = async (courseId, newStatus) => {
    try {
      const { data } = await axios.post(backendUrl+
        `/api/educator/toggle-publish/${courseId}`,
        { isPublished: newStatus }, { headers: { atoken }}
      );

      if (data.success) {
        // Update local state
        setPublishedData(prev =>
          prev.map(c =>
            c._id === courseId ? { ...c, isPublished: newStatus } : c
          )
        );
        fetchEducatorCourses();
        toast.success(`Course is now ${newStatus ? "Active" : "Inactive"}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
      fetchEducatorCourses();
  }, [educatorCourses]);



  if (!educatorCourses) {
    return <Loading />;
  }

  return educatorCourses ? (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="w-full h-full bg-white shadow-xl rounded-3xl p-8">
        <h1 className="pb-4 text-lg font-medium text-left">My Courses</h1>

        <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-300 shadow-sm">
          <table className="table-auto w-full text-sm text-gray-500">
            <thead className="text-gray-900 border-b border-gray-300 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                <th className="px-4 py-3 font-semibold truncate">Course Price</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
                <th className="px-4 py-3 font-semibold truncate">Course Status</th>
                <th className="px-4 py-3 font-semibold truncate">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(educatorCourses) &&
                educatorCourses.map((course) => (
                  <tr key={course._id} className="border-b border-gray-200">
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <img
                        src={course.courseThumbnail}
                        alt="Course"
                        className="w-16 h-auto rounded-sm"
                      />
                      <span className="truncate hidden md:inline">
                        {course.courseTitle}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      {currencySymbol} {course.purchasePrice || 0}
                    </td>
                    <td className="px-4 py-3">
                      {currencySymbol}{" "}
                      {(cost?.[course._id]?.earnings || 0).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      {course.enrolledStudents?.length || 0}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={course.isPublished ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                          {course.isPublished ? "Live" : "InActive"}
                        </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      {/* Status Checkbox */}
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={course.isPublished} // assumes course schema has `isPublished: Boolean`
                          onChange={() => handleTogglePublish(course._id, !course.isPublished)}
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className={course.isPublished ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                          {course.isPublished ? "Active" : "InActive"}
                        </span>
                      </label>

                      {/* Update Button */}
                      <button
                        onClick={() => handleUpdateCourse(course)}
                        className="ml-3 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md shadow-sm"
                      >
                        Update
                      </button>
                    </td>

                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
};

export default MyCourses;
