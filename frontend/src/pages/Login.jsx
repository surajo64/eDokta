import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken, acceptTerms } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nin, setNin] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [state, setState] = useState("Login"); // Toggle between Sign Up & Login

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (state === "Sign Up" && !agreeToTerms) {
      toast.error("You must agree to the Terms and Conditions to sign up.");
      return;
    }

  if (state === "Sign Up") {
   try {
    const { data } = await axios.post(backendUrl + "/api/user/register", {
      name,
      password,
      phone,
      email,
      nin,
      isAccepted: agreeToTerms,  
    });
  
      if (data.success) {
        localStorage.setItem("token", data.token); 
        setToken(data.token);

        setName("");
        setEmail("");
        toast.success("Account created successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    }
  } else {
    try {
      const { data } = await axios.post(backendUrl +'/api/user/login' , {
        password,
        phone,
      });
  
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Login Success!");
    
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  }
  
    
  };

  useEffect(() => {
    if (token) {
    navigate('/')  
    }
  })

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        <p className="text-sm text-gray-600">
          Please {state === "Sign Up" ? "Create an Account" : "Login"} to book
          an appointment.
        </p>

        {/* Name Field (Only for Sign Up) */}
        {state === "Sign Up" && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded-md mb-5"
          />
        )}

        {/* Phone Number Field */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-5"
        />

        {/* nin Field (Only for Sign Up) */}
        {state === "Sign Up" && (
          <input
            type="text"
            name="nin"
            placeholder="NIN"
            value={nin}
            onChange={(e) => setNin(e.target.value)}
            required
            className="w-full p-2 border rounded-md mb-5"
          />
        )}

        {/* Email Field (Only for Sign Up) */}
        {state === "Sign Up" && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md mb-5"
          />
        )}

        {/* Password Field */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-5" />

{state === "Sign Up" && (
          <div className="mb-5 flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the
              <span className="text-blue-500 cursor-pointer" onClick={() => setShowTerms(true)}> Terms and Conditions</span>
            </label>
          </div>
        )}


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {state}
        </button>

        {/* Toggle Sign Up / Login */}
        <p className="text-center mt-3 text-sm">
          {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
          >
            {state === "Sign Up" ? "Login" : "Sign Up"}
          </span><br/>
          <button onClick={() => navigate('/forgot-password')} className=" text-primary">  Forget Password?</button>
        </p>
      
      </form>


      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            <div className="max-h-60 overflow-y-auto p-2 border border-gray-300 rounded">
              <p className="text-sm text-gray-600">
                Terms and Conditions for E-Doctor Telemedicine and Home Consultation Service
                Last Updated: [Insert Date]

                1. Acceptance of Terms
                By accessing or using E-Doctor Telemedicine and Home Consultation Service (“E-Doctor,” “Platform,” “we,” “us”), you agree to comply with these Terms and Conditions (“Terms”). If you disagree, do not use our services. Continued use after updates constitutes acceptance of revised Terms.

                2. Services Overview
                E-Doctor provides:
                - Telemedicine: Virtual consultations with licensed healthcare providers via video, audio, or chat.
                - Home Consultation: In-person medical visits by qualified professionals at your designated location (subject to availability and geographic scope).
                - Related services: e-prescriptions, lab test referrals, and medical advice.
                - Not for Emergencies: Do not use E-Doctor for life-threatening conditions. In emergencies, contact local emergency services (e.g., 911).

                3. Eligibility and Registration
                - Age Requirement: Users must be ≥18 years or have consent from a parent/legal guardian.
                - Accurate Information: Provide truthful personal/medical details (e.g., name, address, health history) during registration.
                - Account Security: Protect your login credentials. Notify us immediately of unauthorized access.

                4. Telemedicine Services
                - Scope: Virtual consultations are provided by licensed professionals in your jurisdiction.
                - Technology Requirements: Stable internet connection and compatible device.
                - Prescriptions: E-Doctor may issue e-prescriptions at the provider’s discretion, subject to local laws.

                ... (Add remaining terms here) ...
              </p>
            </div>
            <button onClick={() => setShowTerms(false)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Accept</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
