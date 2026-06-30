import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/adminContext";
import { DoctorContext } from "../context/doctorContext";
import { AppContext } from "../context/AppContext";
import { useLoading } from "../context/loadingContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  
  // Roles: "admin" | "doctor" | "educator"
  const [role, setRole] = useState("admin");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const { backendUrl, setAtoken, setAdminData } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "doctor") {
        // Doctor login endpoint expects { email, password }
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email: emailOrPhone,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor Login Successful!");
          navigate("/doctor-dashboard");
        } else {
          toast.error(data.message || "Invalid doctor credentials.");
        }
      } else {
        // Admin and Educator are stored in the Admin database collection
        // We call /api/educator/login which accepts email or phone
        const payload = emailOrPhone.includes("@")
          ? { email: emailOrPhone, password }
          : { phone: emailOrPhone, password };

        const { data } = await axios.post(`${backendUrl}/api/educator/login`, payload);

        if (data.success) {
          const userRole = data.admin.role;

          // Double check role alignment
          if (role === "admin" && userRole !== "admin") {
            toast.error("Access denied. This account is registered as an Educator.");
            setLoading(false);
            return;
          }
          if (role === "educator" && userRole !== "educator") {
            toast.error("Access denied. This account is registered as an Admin.");
            setLoading(false);
            return;
          }

          // Store atoken and adminData in AppContext (used by educator modules)
          localStorage.setItem("atoken", data.atoken);
          setAtoken(data.atoken);
          localStorage.setItem("adminData", JSON.stringify(data.admin));
          setAdminData(data.admin);

          if (userRole === "admin") {
            // Also store aToken for general Admin layout / dashboard rendering
            localStorage.setItem("aToken", data.atoken);
            setAToken(data.atoken);
            toast.success("Admin Login Successful!");
            navigate("/admin-dashboard");
          } else if (userRole === "educator") {
            toast.success("Educator Login Successful!");
            navigate("/educator-dashboard");
          }
        } else {
          toast.error(data.message || "Invalid credentials.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getForgotLink = () => {
    if (role === "doctor") return "/doctor-forgot-password";
    return "/admin-forgot-password";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 relative z-10 transition-all duration-300 hover:border-white/15">
        
        {/* Header / Logo placeholder */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-2xl mb-4 border border-blue-500/20">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Portal Login</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage appointments & courses</p>
        </div>

        {/* Tab Role Selector */}
        <div className="flex p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 mb-8">
          <button
            type="button"
            onClick={() => { setRole("admin"); setEmailOrPhone(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
              role === "admin"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {/* Admin Shield SVG */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin
          </button>
          
          <button
            type="button"
            onClick={() => { setRole("doctor"); setEmailOrPhone(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
              role === "doctor"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {/* Stethoscope SVG */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Doctor
          </button>

          <button
            type="button"
            onClick={() => { setRole("educator"); setEmailOrPhone(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
              role === "educator"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {/* Book Open SVG */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Educator
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Identity input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">
              {role === "doctor" ? "Email Address" : "Email or Phone Number"}
            </label>
            <div className="relative">
              <input
                type={role === "doctor" ? "email" : "text"}
                placeholder={role === "doctor" ? "doctor@edokta.com" : "email@edokta.com or phone"}
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => navigate(getForgotLink())}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/25"
          >
            Sign In to Dashboard
          </button>
        </form>

        {/* Back to main portal link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Patient Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
