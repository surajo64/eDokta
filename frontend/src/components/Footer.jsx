import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const Footer = () => {
  const navigate = useNavigate()

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Research & Evidence', path: '/research' },
    { label: 'All Doctors', path: '/doctors' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy & Policy', path: '#' },
  ]

  const services = [
    { label: 'Teleconsultation', path: '/digital-clinic/teleconsultation' },
    { label: 'Home Healthcare', path: '/digital-clinic/home-healthcare' },
    { label: 'Wellness Checkup', path: '/digital-clinic/wellness-checkup' },
    { label: 'Medical Tourism', path: '/digital-clinic/medical-tourism' },
    { label: 'e-Pharmacy', path: '/digital-clinic/e-pharmacy' },
    { label: 'Takaful Insurance', path: '/insurance' },
  ]

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white mt-20">

      {/* ── Top wave divider ── */}
      <div className="overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-12">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <img src={logo} alt="eDokta logo" className="w-36 mb-4 brightness-0 invert" />
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              Democratizing access to quality healthcare through digital technology across Nigeria and West Africa.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { label: 'Facebook', icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                )},
                { label: 'Twitter', icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                )},
                { label: 'Instagram', icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                )},
                { label: 'LinkedIn', icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                )},
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-indigo-400 rounded-full inline-block"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-blue-200 hover:text-white text-sm transition-colors duration-150 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-white transition-colors"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-indigo-400 rounded-full inline-block"></span>
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.label}>
                  <button
                    onClick={() => navigate(s.path)}
                    className="text-blue-200 hover:text-white text-sm transition-colors duration-150 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-white transition-colors"></span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-indigo-400 rounded-full inline-block"></span>
              Get In Touch
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-blue-200 text-sm">
                <span className="text-indigo-400 text-base">📞</span>
                +234-803-445-9339
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-sm">
                <span className="text-indigo-400 text-base">✉️</span>
                edokta@gmail.com
              </li>
              <li className="flex items-start gap-3 text-blue-200 text-sm">
                <span className="text-indigo-400 text-base mt-0.5">📍</span>
                Nigeria &amp; West Africa
              </li>
            </ul>

            {/* Newsletter */}
            <p className="text-blue-200 text-xs mb-2 font-medium uppercase tracking-wide">Newsletter</p>
            <div className="flex overflow-hidden rounded-xl border border-white/20">
              <input
                type="email"
                placeholder="Your email…"
                className="flex-1 bg-white/10 text-white text-sm px-3 py-2.5 placeholder-blue-300 focus:outline-none"
              />
              <button className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 text-white text-xs font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-300 text-xs text-center">
            &copy; {new Date().getFullYear()} <span className="text-white font-semibold">eDokta Healthcare</span>. All rights reserved.
          </p>
          <div className="flex gap-4 text-blue-300 text-xs">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
