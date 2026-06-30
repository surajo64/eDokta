import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const CourseCard = ({ course }) => {
  const { currencySymbol, calculateRating } = useContext(AppContext);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      let result = await calculateRating(course);
      result = isNaN(result) ? 0 : result;
      setRating(result);
    };

    fetchRating();
  }, [course, calculateRating]);

  return (
    <Link to={'/course/' + course._id} className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg relative">
      <img src={course.courseThumbnail} alt="title" className="w-full h-48 object-cover" />
      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold shadow-sm text-gray-700 space-x-1">
        {course.courseMode === 'Physical' && <span>🏢 Physical</span>}
        {course.courseMode === 'Virtual' && <span>💻 Virtual</span>}
        {(course.courseMode === 'Both' || !course.courseMode) && <span>🔄 Hybrid</span>}
      </div>
      <div className="p-6 text-left">
        <h3 className="text-base font-semibold">{course.courseTitle}</h3>
        <p className="text-gray-500">{course.educator?.name}</p>
        <div className="flex items-center space-x-2">
          <p>{rating}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                alt=""
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500">{course.courseRatings.length}</p>
        </div>
        <p className="text-base font-semibold text-gray-800">
          {currencySymbol} {(course.coursePrice - course.discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
