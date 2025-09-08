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

    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12 '>

        <div className='py-8 sm:py-16 flex flex-col gap-5 text-[15px]'>
          <p className="flex items-center gap-2 font-medium text-gray-500"><img className="w-5" src={mail_icon} alt="" /> info@kirctkilimanjarohospital.com </p>
          <p className="flex items-center gap-2 font-medium text-gray-500"> <img className="w-5" src={phone_icon} alt="" />+234–90-36264188</p>
          <p className="flex items-center gap-2 font-medium text-gray-500"><img className="w-5" src={location_icon} alt="" /> Km 1 Kwanar Dawaki, Off Kano-Kaduna Express Way, Kano</p>
        </div>


        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-400 mb-4">Contact Us</h2>

          {success && <p className="text-green-600">Message sent successfully!</p>}
          {error && <p className="text-red-600">{error}</p>}

          <form onSubmit={sendEmail} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
