import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import hero_teleconsultation from '../assets/hero_teleconsultation.jpg'
import hero_pharmacy from '../assets/hero_pharmacy.jpg'
import hero_homehealth from '../assets/hero_homehealth.jpg'
import hero_checkup from '../assets/hero_checkup.jpg'

const slides = [
  {
    id: 1,
    badge: 'Trusted by 10,000+ Patients',
    titleLine1: 'Book Appointment',
    titleLine2: 'With Trusted Doctors',
    description: 'Browse our extensive list of verified specialists and schedule your appointment hassle-free.',
    primaryCta: { label: 'Book Appointment', href: '#speciality' },
    secondaryCta: { label: 'Browse All Doctors', action: '/doctors' },
    stats: [
      { value: '200+', label: 'Doctors' },
      { value: '15+', label: 'Specialties' },
      { value: '10K+', label: 'Patients' },
    ],
    image: assets.header_img,
    imageType: 'cutout',
    bgGradient: 'from-blue-700 via-indigo-700 to-purple-700',
    blobColor1: 'bg-blue-400',
    blobColor2: 'bg-purple-400',
  },
  {
    id: 2,
    badge: 'Instant Virtual Care',
    titleLine1: 'Online Teleconsultation',
    titleLine2: 'With Top Specialists',
    description: 'Connect instantly with board-certified physicians via HD video and chat from anywhere in Nigeria.',
    primaryCta: { label: 'Start Teleconsultation', action: '/digital-clinic/teleconsultation' },
    secondaryCta: { label: 'Find Specialist', action: '/doctors' },
    stats: [
      { value: '24/7', label: 'Availability' },
      { value: '100%', label: 'Confidential' },
      { value: '5 Min', label: 'Response Time' },
    ],
    image: hero_teleconsultation,
    imageType: 'card',
    bgGradient: 'from-sky-700 via-blue-800 to-indigo-900',
    blobColor1: 'bg-sky-400',
    blobColor2: 'bg-indigo-400',
  },
  {
    id: 3,
    badge: 'Certified e-Pharmacy',
    titleLine1: 'Order Genuine Medicines',
    titleLine2: 'Delivered To Your Door',
    description: 'Fast, discreet doorstep delivery of authentic pharmaceuticals and wellness essentials across Nigeria.',
    primaryCta: { label: 'Explore Pharmacy', action: '/digital-clinic/e-pharmacy' },
    secondaryCta: { label: 'Browse Medicines', action: '/pharmacy' },
    stats: [
      { value: '1,500+', label: 'Medicines' },
      { value: '100%', label: 'Authentic' },
      { value: 'Same-Day', label: 'Dispatch' },
    ],
    image: hero_pharmacy,
    imageType: 'card',
    bgGradient: 'from-emerald-800 via-teal-800 to-blue-900',
    blobColor1: 'bg-emerald-400',
    blobColor2: 'bg-teal-400',
  },
  {
    id: 4,
    badge: 'Compassionate Home Care',
    titleLine1: 'Professional Nursing Care',
    titleLine2: 'Right At Your Home',
    description: 'Qualified nurses and physiotherapists providing post-surgery, elderly, and maternal care in comfortable surroundings.',
    primaryCta: { label: 'Book Home Care Team', action: '/digital-clinic/home-healthcare' },
    secondaryCta: { label: 'Our Medical Teams', action: '/digital-clinic/home-healthcare' },
    stats: [
      { value: '50+', label: 'Home Teams' },
      { value: 'Licensed', label: 'Caregivers' },
      { value: 'Full Coverage', label: 'Kano & Beyond' },
    ],
    image: hero_homehealth,
    imageType: 'card',
    bgGradient: 'from-indigo-800 via-purple-800 to-slate-900',
    blobColor1: 'bg-indigo-400',
    blobColor2: 'bg-purple-400',
  },
  {
    id: 5,
    badge: 'Preventive Health Diagnostics',
    titleLine1: 'Full Body Wellness Checkups',
    titleLine2: '& Diagnostic Packages',
    description: 'Early detection saves lives. Schedule comprehensive health screenings and advanced laboratory packages today.',
    primaryCta: { label: 'Book Checkup', action: '/digital-clinic/wellness-checkup' },
    secondaryCta: { label: 'View Health Packages', action: '/digital-clinic/wellness-checkup' },
    stats: [
      { value: '25+', label: 'Checkup Packages' },
      { value: 'Modern', label: 'Diagnostics' },
      { value: 'Same-Day', label: 'Test Results' },
    ],
    image: hero_checkup,
    imageType: 'card',
    bgGradient: 'from-blue-900 via-slate-900 to-indigo-950',
    blobColor1: 'bg-blue-400',
    blobColor2: 'bg-cyan-400',
  },
]

const Header = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, currentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const current = slides[currentSlide]

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${current.bgGradient} transition-colors duration-700 select-none`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative blobs */}
      <div className={`absolute -top-20 -left-20 w-72 h-72 ${current.blobColor1} opacity-20 rounded-full blur-3xl pointer-events-none transition-colors duration-700`}></div>
      <div className={`absolute top-10 right-10 w-64 h-64 ${current.blobColor2} opacity-20 rounded-full blur-3xl pointer-events-none transition-colors duration-700`}></div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20 transition-all hover:scale-110 focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20 transition-all hover:scale-110 focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Main Slide Content */}
      <div className="flex flex-col md:flex-row items-end justify-between px-6 sm:px-[5%] md:px-[6%] pt-12 md:pt-16 pb-12 md:pb-0 gap-8 min-h-[500px] lg:min-h-[540px]">
        
        {/* ── Left Content ── */}
        <div className="md:w-1/2 flex flex-col gap-6 z-10 pb-4 md:pb-16 transition-all duration-500">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 self-start bg-white/15 border border-white/30 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {current.badge}
          </span>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight drop-shadow-sm">
            {current.titleLine1}<br />
            <span className="text-sky-200">{current.titleLine2}</span>
          </h1>

          {/* Subtitle / Description */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-white/90 text-sm">
            <img src={assets.group_profiles} alt="patients" className="h-10 shrink-0" />
            <p className="leading-relaxed text-blue-100 max-w-lg">
              {current.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            {current.primaryCta.href ? (
              <a
                href={current.primaryCta.href}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
              >
                {current.primaryCta.label}
                <img className="w-3" src={assets.arrow_icon} alt="" />
              </a>
            ) : (
              <button
                onClick={() => navigate(current.primaryCta.action)}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
              >
                {current.primaryCta.label}
                <img className="w-3" src={assets.arrow_icon} alt="" />
              </button>
            )}

            <button
              onClick={() => navigate(current.secondaryCta.action)}
              className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/25 transition-all duration-300 text-sm backdrop-blur-sm"
            >
              {current.secondaryCta.label}
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex gap-6 pt-2">
            {current.stats.map((s, i) => (
              <div key={i}>
                <p className="text-white font-bold text-xl drop-shadow">{s.value}</p>
                <p className="text-sky-200 text-xs font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Content: Image Showcase ── */}
        <div className="w-full md:w-1/2 relative flex justify-center md:justify-end items-end self-stretch min-h-[300px] md:min-h-[440px]">
          {current.imageType === 'cutout' ? (
            /* Cutout image (Slide 1): rests directly at bottom base */
            <img
              key={`slide-img-${current.id}`}
              className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-[620px] md:absolute md:bottom-0 md:right-0 object-contain drop-shadow-2xl animate-fade-in"
              src={current.image}
              alt={current.titleLine1}
            />
          ) : (
            /* Photo card image (Slides 2-5): framed in a modern rounded card with glass glow */
            <div
              key={`slide-card-${current.id}`}
              className="relative w-full max-w-md md:max-w-lg lg:max-w-xl aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 mb-6 md:mb-10 backdrop-blur-sm group transition-all duration-500 hover:scale-[1.02]"
            >
              <img
                src={current.image}
                alt={current.titleLine1}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Floating pill badge on photo */}
              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md border border-white/30 text-white text-xs px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Verified eDokta Healthcare</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Slide Indicators & Counter */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/25 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-7 bg-white shadow' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-[11px] text-white/80 font-mono pl-1 border-l border-white/20">
          0{currentSlide + 1} / 0{slides.length}
        </span>
      </div>

    </div>
  )
}

export default Header
