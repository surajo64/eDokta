import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const AddEducator = () => {
  const { atoken, backendUrl } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const checkPasswordStrength = (pass) => {
    if (pass.length === 0) {
      setPasswordStrength("");
      return;
    }

    if (pass.length < 6) {
      setPasswordStrength("weak");
    } else if (pass.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Please enter a valid phone number (10-15 digits)");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (role === "educator" && !about.trim()) {
      toast.error("Please provide information about the educator");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(backendUrl + "/api/educator/register", {
        name,
        email,
        phone,
        role,
        about,
        password,
      });

      if (data.success) {
        toast.success(data.message || "Registration successful!");

        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setRole("");
        setAbout("");
        setPassword("");
        setPasswordStrength("");

        // Show success options
        setTimeout(() => {
          const addAnother = window.confirm("User added successfully! Would you like to add another?");
          if (!addAnother) {
            navigate("/educators");
          }
        }, 500);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Admin/Educator</h2>
          <p className="text-gray-600 mt-1">Create a new admin or educator account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="1234567890"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="educator">Educator</option>
              </select>
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter password (min. 6 characters)"
                required
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getPasswordStrengthColor()}`}
                        style={{
                          width: passwordStrength === 'weak' ? '33%' :
                            passwordStrength === 'medium' ? '66%' :
                              passwordStrength === 'strong' ? '100%' : '0%'
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 capitalize">
                      {passwordStrength || 'Too short'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About Educator - Only shows if Educator */}
          {role === "educator" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                About Educator <span className="text-red-500">*</span>
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter information about the educator (qualifications, experience, etc.)"
                rows="4"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-3 rounded-lg font-medium text-white transition ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/educators")}
              className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            >
              View All
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducator;
