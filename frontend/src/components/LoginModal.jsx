import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const LoginModal = ({ onClose }) => {
    const { backendUrl, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [nin, setNin] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [state, setState] = useState("Login"); // 'Login' or 'Sign Up'

    const resetForm = () => {
        setName(""); setNin(""); setPhone("");
        setEmail(""); setPassword(""); setAgreeToTerms(false);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (state === "Sign Up" && !agreeToTerms) {
            toast.error("You must agree to the Terms and Conditions to sign up.");
            return;
        }

        if (state === "Sign Up") {
            try {
                const { data } = await axios.post(backendUrl + "/api/user/register", {
                    name, password, phone, email, nin, isAccepted: agreeToTerms,
                });
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                    resetForm();
                    toast.success("Account created successfully!");
                    onClose();
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Registration failed!");
            }
        } else {
            try {
                const { data } = await axios.post(backendUrl + "/api/user/login", {
                    password, phone,
                });
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                    toast.success("Login successful!");
                    onClose();
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Login failed!");
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fadein">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none"
                    aria-label="Close"
                >
                    &times;
                </button>

                {/* Tabs */}
                <div className="flex rounded-t-2xl overflow-hidden">
                    <button
                        onClick={() => { setState("Login"); resetForm(); }}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${state === "Login"
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setState("Sign Up"); resetForm(); }}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${state === "Sign Up"
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmitHandler} className="p-6 flex flex-col gap-3">
                    <p className="text-sm text-gray-500 -mt-1 mb-1">
                        {state === "Sign Up"
                            ? "Create your account to get started."
                            : "Welcome back! Please login to continue."}
                    </p>

                    {state === "Sign Up" && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    )}

                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    {state === "Sign Up" && (
                        <input
                            type="text"
                            placeholder="NIN (National ID)"
                            value={nin}
                            onChange={(e) => setNin(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    )}

                    {state === "Sign Up" && (
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />

                    {state === "Sign Up" && (
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="modal-terms"
                                checked={agreeToTerms}
                                onChange={() => setAgreeToTerms(!agreeToTerms)}
                                className="mt-1"
                            />
                            <label htmlFor="modal-terms" className="text-sm text-gray-600">
                                I agree to the{" "}
                                <span
                                    className="text-primary cursor-pointer underline"
                                    onClick={() => setShowTerms(true)}
                                >
                                    Terms and Conditions
                                </span>
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition mt-1"
                    >
                        {state === "Sign Up" ? "Create Account" : "Login"}
                    </button>

                    {state === "Login" && (
                        <p className="text-center text-xs text-primary cursor-pointer hover:underline"
                            onClick={() => { onClose(); navigate('/forgot-password'); }}>
                            Forgot Password?
                        </p>
                    )}
                </form>
            </div>

            {/* Terms & Conditions Sub-Modal */}
            {showTerms && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
                        <div className="max-h-60 overflow-y-auto p-2 border border-gray-300 rounded text-sm text-gray-600">
                            <p>
                                Terms and Conditions for E-Doctor Telemedicine and Home Consultation Service.<br /><br />
                                1. <strong>Acceptance of Terms</strong>: By accessing or using E-Doctor, you agree to comply with these Terms.<br /><br />
                                2. <strong>Services Overview</strong>: E-Doctor provides telemedicine, home consultation, e-prescriptions, lab test referrals, and related services. Not for emergencies.<br /><br />
                                3. <strong>Eligibility</strong>: Users must be ≥18 years or have parental/guardian consent. Accurate information must be provided during registration.<br /><br />
                                4. <strong>Telemedicine</strong>: Virtual consultations are provided by licensed professionals. A stable internet connection and compatible device are required.<br /><br />
                                5. <strong>Privacy</strong>: We protect your data in accordance with applicable data protection laws.
                            </p>
                        </div>
                        <button
                            onClick={() => { setAgreeToTerms(true); setShowTerms(false); }}
                            className="mt-4 bg-primary text-white py-2 px-6 rounded-xl hover:opacity-90 transition"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginModal;
