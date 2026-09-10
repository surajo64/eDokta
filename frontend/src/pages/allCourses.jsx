import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CourseCard from '../components/Card';
import { AppContext } from '../context/AppContext';

const CATEGORIES = [
  'All Courses',
  'Clinical Anatomy',
  'Emergency Medicine',
  'Pharmacology',
  'Maternal Care',
  'Diagnostics',
  'Digital Health',
];

const MODES = [
  { label: 'All Formats', value: 'all' },
  { label: '💻 Virtual / Online', value: 'Virtual' },
  { label: '🏢 In-Person Workshop', value: 'Physical' },
  { label: '🔄 Hybrid (Both)', value: 'Both' },
];

const AllCourse = () => {
  const { allCourses } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const incomingQuery = location.state?.searchQuery || '';

  const [searchTerm, setSearchTerm] = useState(incomingQuery);
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [selectedMode, setSelectedMode] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [filteredCourses, setFilteredCourses] = useState(allCourses || []);

  useEffect(() => {
    let courses = [...(allCourses || [])];

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      courses = courses.filter(c =>
        (c.courseTitle || '').toLowerCase().includes(q) ||
        (c.courseDescription || '').toLowerCase().includes(q) ||
        (c.educator?.name || '').toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Courses') {
      const cat = selectedCategory.toLowerCase();
      courses = courses.filter(c =>
        (c.courseTitle || '').toLowerCase().includes(cat) ||
        (c.courseDescription || '').toLowerCase().includes(cat)
      );
    }

    // Filter by mode
    if (selectedMode !== 'all') {
      courses = courses.filter(c => c.courseMode === selectedMode);
    }

    // Sort
    if (sortBy === 'price-low') {
      courses.sort((a, b) => (a.coursePrice - a.discount) - (b.coursePrice - b.discount));
    } else if (sortBy === 'price-high') {
      courses.sort((a, b) => (b.coursePrice - b.discount) - (a.coursePrice - a.discount));
    }

    setFilteredCourses(courses);
  }, [allCourses, searchTerm, selectedCategory, selectedMode, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Courses');
    setSelectedMode('all');
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen bg-slate-50 -mx-4 sm:-mx-[5%]">
      {/* ── Hero Banner (Compact & Sleek) ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white pt-10 pb-16 sm:pt-12 sm:pb-20 px-6 sm:px-12 text-center">
        {/* Ambient background glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto z-10">
          {/* Eyebrow badge */}
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white text-[11px] font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3 backdrop-blur-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Accredited Healthcare Education &amp; CME
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug mb-2.5">
            eDokta Academy &amp; <span className="text-sky-200">Clinical Training</span>
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed mb-4">
            Certified clinical workshops, continuing medical education (CME), and practical courses taught by verified healthcare specialists.
          </p>

          {/* Compact Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-blue-100/90 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-300 font-bold">✓</span> 6+ Accredited Courses
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-300 font-bold">✓</span> 5,000+ Enrolled Learners
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-300 font-bold">✓</span> CME Certified Credits
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-300 font-bold">✓</span> Practical &amp; Virtual
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        
        {/* ── Search & Filter Toolbar ── */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-8 -mt-10 relative z-20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search courses, instructors, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mode & Sort Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              {/* Format Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                {MODES.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMode(m.value)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      selectedMode === m.value
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
              Topic:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Header Summary Row ── */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Available Courses
            </h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'Program' : 'Programs'}
            </span>
          </div>

          {(searchTerm || selectedCategory !== 'All Courses' || selectedMode !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ── Courses Grid ── */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Courses Found</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              We couldn't find any courses matching your search or filters. Try adjusting your query or resetting all filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course._id || index} course={course} />
            ))}
          </div>
        )}

        {/* ── Bottom Callout Banner ── */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block bg-white/15 text-sky-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-4 border border-white/20">
              For Medical Educators &amp; Specialists
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Teach on eDokta Academy
            </h3>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              Are you a senior consultant, surgeon, or healthcare faculty member? Share your expertise, host accredited clinical workshops, and educate thousands of doctors and trainees across West Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-full text-xs shadow-lg hover:scale-105 transition-all"
              >
                Become an Educator
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-full text-xs border border-white/20 transition-all"
              >
                Learn About Our Standards
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllCourse;
