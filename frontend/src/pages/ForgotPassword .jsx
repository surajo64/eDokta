import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { backendUrl } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
      if (data.success) {
        setEmailSent(true);
        toast.success('Password reset email sent. Check your inbox.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending reset email');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      {!emailSent ? (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-md mb-5"
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
              Send Reset Link
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <p className="text-green-600 font-medium">Password reset link sent successfully! Check your email.</p>
          <button
            onClick={() => setEmailSent(false)}
            className="mt-4 text-blue-500 hover:underline"
          >
            Resend Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
