import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const CourseCard = ({ course }) => {
  const { currencySymbol, calculateRating } = useContext(AppContext);
  const [rating, setRating] = useState(4.8);

  useEffect(() => {
    const fetchRating = async () => {
      if (calculateRating) {
        let result = await calculateRating(course);
        result = isNaN(result) || result === 0 ? 4.8 : result;
        setRating(result);
      }
    };
    fetchRating();
  }, [course, calculateRating]);

  const finalPrice = Math.max(course.coursePrice - (course.discount || 0), 0);
  const hasDiscount = (course.discount || 0) > 0;
  const ratingCount = course.courseRatings?.length || (course._id ? 12 : 5);

  return (
    <Link
      to={'/course/' + course._id}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
    >
      {/* ── Card Thumbnail & Badges ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={course.courseThumbnail || assets.course_1_thumbnail}
          alt={course.courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Mode Badge (Top Right) */}
        <div className="absolute top-3 right-3">
          {course.courseMode === 'Physical' && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm flex items-center gap-1">
              🏢 In-Person
            </span>
          )}
          {course.courseMode === 'Virtual' && (
            <span className="bg-sky-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm flex items-center gap-1">
              💻 Virtual
            </span>
          )}
          {(course.courseMode === 'Both' || !course.courseMode) && (
            <span className="bg-purple-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm flex items-center gap-1">
              🔄 Hybrid
            </span>
          )}
        </div>

        {/* Discount Badge (Top Left) */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500/95 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm">
            Save {currencySymbol || '₦'}{course.discount.toLocaleString()}
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3 text-left">
        <div>
          {/* Educator / Faculty */}
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>{course.educator?.name || 'Dr. Medical Specialist'}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {course.courseTitle}
          </h3>

          {/* Short description */}
          {course.courseDescription && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {course.courseDescription}
            </p>
          )}
        </div>

        {/* Rating & Schedule */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-500">{Number(rating).toFixed(1)}</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-slate-400 text-[11px]">({ratingCount})</span>
            </div>

            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              CME Accredited
            </span>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-extrabold text-slate-900 leading-none">
                {currencySymbol || '₦'} {finalPrice.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </p>
              {hasDiscount && (
                <p className="text-xs text-slate-400 line-through mt-0.5">
                  {currencySymbol || '₦'} {course.coursePrice?.toLocaleString()}
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all">
              View Course
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
