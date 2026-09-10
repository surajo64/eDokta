import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  const stats = [
    { value: '10K+', label: 'Patients Served' },
    { value: '200+', label: 'Expert Doctors' },
    { value: '15+', label: 'Specialties' },
    { value: '6', label: 'Digital Services' },
  ]

  const services = [
    { icon: '💻', title: 'Teleconsultation', desc: 'See a doctor from your screen, anytime.' },
    { icon: '🏠', title: 'Home Healthcare', desc: 'Bring quality care to your doorstep.' },
    { icon: '🏥', title: 'Wellness Checkup', desc: 'Comprehensive medical checkup packages.' },
    { icon: '✈️', title: 'Medical Tourism', desc: 'World-class treatment, expertly arranged.' },
    { icon: '💊', title: 'e-Pharmacy', desc: 'Order medicines safely and quickly online.' },
    { icon: '🛡️', title: 'Takaful Insurance', desc: 'Ethical, risk-sharing health insurance.' },
  ]

  const whyUs = [
    {
      icon: '⚡',
      title: 'Efficiency',
      desc: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: '🤝',
      title: 'Convenience',
      desc: 'Access a network of trusted healthcare professionals wherever you are.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: '🎯',
      title: 'Personalization',
      desc: 'Tailored recommendations and reminders to keep you on top of your health.',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -mx-4 sm:-mx-[5%]">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 py-20 px-6 text-center">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-white/30">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            About <span className="text-blue-200">eDokta</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Democratizing access to quality healthcare across Nigeria and West Africa through the power of digital technology.
          </p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-lg border border-white hover:shadow-xl transition-shadow">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-gray-500 text-xs font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Our Story ── */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Image */}
          <div className="md:w-2/5 relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl opacity-20 blur-xl"></div>
            <img
              src={assets.about_image}
              alt="eDokta healthcare"
              className="relative w-full rounded-3xl shadow-2xl object-cover"
            />
          </div>

          {/* Text */}
          <div className="md:w-3/5 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Our Story</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 leading-snug">
                Healthcare at the<br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Speed of Technology</span>
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              eDokta is a private digital health organization that democratizes access to standard healthcare through the use of digital technology across socio-economic divides in Nigeria and other West African countries. We provide quality and unique medical services at the comfort of your home, or your digital screen.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Our portfolio cuts across digital Clinic (Teleconsultation, Home Healthcare, Wellness Clinic &amp; Medical Checkup, Medical Tourism &amp; Booking, Travel Health), e-Pharmacy, Rural Digital Health, Takaful Health Insurance, Education &amp; Training, and Digital Health Research.
            </p>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm mb-3">🎯</div>
                <h3 className="font-bold text-gray-800 mb-1">Our Vision</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  To be among the top providers of basic and advanced digital healthcare in Nigeria and West Africa.
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm mb-3">🚀</div>
                <h3 className="font-bold text-gray-800 mb-1">Our Mission</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  To provide quality healthcare using digital technology in a customer-friendly environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Our Services ── */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">What We Offer</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Our Digital Services</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              A complete ecosystem of healthcare solutions designed for the modern patient.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {services.map((s, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-gradient-to-b from-white to-blue-50/30 cursor-pointer"
              >
                <div className="text-4xl mb-3">{s.icon}</div>
                <p className="font-semibold text-gray-800 text-sm">{s.title}</p>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Our Advantage</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Why Choose eDokta</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            We combine technology, compassion, and convenience to deliver healthcare you can trust.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyUs.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient accent top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`}></div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              {/* Decorative blob */}
              <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl pointer-events-none`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 py-16 px-6 text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to experience better healthcare?</h2>
          <p className="text-blue-200 mb-8">Join thousands of patients already using eDokta for smarter health decisions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/doctors')}
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all"
            >
              Find a Doctor
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 bg-white/15 text-white font-semibold rounded-full border border-white/30 hover:bg-white/25 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default About
