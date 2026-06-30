import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CourseCard from '../components/Card';
import { AppContext } from '../context/AppContext';

const AllCourse = () => {
  const { allCourses } = useContext(AppContext);
  const location = useLocation();
  const incomingQuery = location.state?.searchQuery || '';

  const [searchTerm, setSearchTerm] = useState(incomingQuery);
  const [filteredCourses, setFilteredCourses] = useState(allCourses || []);
  const [searchPerformed, setSearchPerformed] = useState(!!incomingQuery);

  useEffect(() => {
    const courses = allCourses || [];
    if (incomingQuery) {
      const query = incomingQuery.toLowerCase();
      const filtered = courses.filter(course =>
        (course.courseTitle || '').toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [allCourses, incomingQuery]);

  const handleSearch = () => {
    const courses = allCourses || [];
    const query = searchTerm.toLowerCase();
    const filtered = courses.filter(course =>
      (course.courseTitle || '').toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
    setSearchPerformed(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredCourses(allCourses || []);
    setSearchPerformed(false);
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Header Section */}
      <section className="text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between py-12 md:px-40 px-6 border-b border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 sm:mb-0 sm:text-right w-full sm:w-auto">
            Courses List
          </h2>

          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all"
            >
              Search
            </button>
            {searchPerformed && (
              <button
                onClick={handleClearSearch}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Description and Course List */}
        <div className="py-14 md:px-40 px-6">
          {filteredCourses?.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No courses match your search criteria.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {filteredCourses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AllCourse;
