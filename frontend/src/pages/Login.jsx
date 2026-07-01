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
  
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const { backendUrl, setAtoken, setAdminData } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = emailOrPhone.includes("@")
      ? { email: emailOrPhone, password }
      : { phone: emailOrPhone, password };

    try {
      // 1. Try Admin/Educator Login first (since it is the most common role path)
      const { data } = await axios.post(`${backendUrl}/api/educator/login`, payload);

      if (data.success) {
        const userRole = data.admin.role;

        // Store general tokens in AppContext & localStorage
        localStorage.setItem("atoken", data.atoken);
        setAtoken(data.atoken);
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        setAdminData(data.admin);

        if (userRole === "admin") {
          localStorage.setItem("aToken", data.atoken);
          setAToken(data.atoken);
          toast.success("Admin Login Successful!");
          navigate("/admin-dashboard");
        } else if (userRole === "educator") {
          toast.success("Educator Login Successful!");
          navigate("/educator-dashboard");
        }
        return;
      }
    } catch (adminError) {
      // Admin/Educator login failed, log trace and fall back to Doctor login
      console.log("Admin/Educator auth path failed, attempting Doctor authentication...");
    }

    // 2. Try Doctor Login if Admin/Educator fails
    try {
      // Doctor login route expects { email, password }
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
        toast.error(data.message || "Invalid credentials.");
      }
    } catch (doctorError) {
      console.error("Doctor authentication failed:", doctorError);
      toast.error("Invalid email/phone or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden font-sans select-none">
      {/* Background Decorative Blue Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* Login Card (Pure blue, white, and black theme) */}
      <div className="w-full max-w-md bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 relative z-10">
        
        {/* Header / Logo placeholder */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Portal Login</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage appointments & courses</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Identity input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">
              Email or Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter email or phone number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-600">Password</label>
              <button
                type="button"
                onClick={() => navigate("/admin-forgot-password")}
                className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-4 px-6 rounded-2xl transition-all transform active:scale-[0.98] shadow-md shadow-primary/20"
          >
            Sign In to Dashboard
          </button>
        </form>

        {/* Back to main portal link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
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
