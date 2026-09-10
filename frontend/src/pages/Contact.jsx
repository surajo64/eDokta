import React, { useState } from "react";
import emailjs from "emailjs-com";
import mail_icon from '../assets/mail-icon.png'
import phone_icon from '../assets/phone-icon.png'
import location_icon from '../assets/location-icon.png'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_gk5ott2", // Replace with your EmailJS Service ID
        "template_ixbsblv", // Replace with your EmailJS Template ID
        formData,
        "BEGA6m161dK0rZEj1" // Replace with your EmailJS Public Key
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSuccess(true);
          setError("");
          setFormData({ name: "", email: "", subject: "", message: "" });
        },
        (err) => {
          console.log("FAILED...", err);
          setError("Failed to send message. Try again later.");
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -mx-4 sm:-mx-[5%]">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 py-20 px-6 text-center">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-white/30">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Contact <span className="text-blue-200">Us</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Have a question or need assistance? Our team is ready to help you with anything you need.
          </p>
        </div>
      </div>

      {/* ── Quick Info Cards ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 mb-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '✉️', label: 'Email Us', value: 'info@kirctkilimanjarohospital.com', color: 'from-blue-500 to-indigo-500' },
            { icon: '📞', label: 'Call Us', value: '+234–90-36264188', color: 'from-indigo-500 to-purple-500' },
            { icon: '📍', label: 'Visit Us', value: 'Km 1 Kwanar Dawaki, Off Kano-Kaduna Express Way, Kano', color: 'from-purple-500 to-pink-500' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-white hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl mb-4 shadow-md`}>
                {card.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{card.label}</p>
              <p className="text-gray-700 text-sm font-medium leading-relaxed">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main: Sidebar + Form ── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left: Office hours + Social ── */}
          <div className="lg:w-2/5 space-y-6">
            {/* Office hours */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm">🕐</span>
                Office Hours
              </h3>
              <ul className="space-y-3">
                {[
                  { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
                  { day: 'Saturday', time: '9:00 AM – 3:00 PM' },
                  { day: 'Sunday', time: 'Emergency Only' },
                ].map((h, i) => (
                  <li key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500">{h.day}</span>
                    <span className={`font-semibold ${h.time === 'Emergency Only' ? 'text-red-500' : 'text-indigo-600'}`}>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social links */}
            <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white">
              <h3 className="font-bold text-lg mb-2">Connect With Us</h3>
              <p className="text-blue-200 text-sm mb-5">Follow us for health tips, news and updates.</p>
              <div className="flex gap-3">
                {[
                  { label: 'Facebook', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg> },
                  { label: 'Twitter', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label: 'Instagram', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                  { label: 'LinkedIn', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                ].map((s) => (
                  <a key={s.label} href="#" aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 border border-white/20">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Contact Form ── */}
          <div className="lg:w-3/5 w-full">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h2 className="text-white text-2xl font-bold">Send Us a Message</h2>
                <p className="text-blue-200 text-sm mt-1">We'll get back to you within 24 hours.</p>
              </div>

              <div className="px-8 py-8">
                {success && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">
                    <span className="text-lg">✅</span>
                    Message sent successfully! We'll be in touch soon.
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
                    <span className="text-lg">⚠️</span>
                    {error}
                  </div>
                )}

                <form onSubmit={sendEmail} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Your Name</label>
                      <input
                        type="text" name="name" placeholder="John Doe"
                        value={formData.name} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email" name="email" placeholder="you@example.com"
                        value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                    <input
                      type="text" name="subject" placeholder="How can we help?"
                      value={formData.subject} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea
                      name="message" placeholder="Write your message here…" rows="5"
                      value={formData.message} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-300 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactForm;
