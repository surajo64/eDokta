import React, { useState, useContext } from "react";
import { AdminContext } from "../context/adminContext";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify'
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);



  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {


        const { data } = await axios.post(backendUrl + "/api/admin/login", { email, password });

        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token);
          return navigate('/admin-dashboard')

        } else {
          toast.error(data.message)
        }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending reset email');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-lg w-96">
    
    {/* Login Form */}
    <form onSubmit={onSubmitHandler} className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-center">Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />

      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Login
      </button>
    </form>

    <button 
      onClick={() => navigate('/forgot-password')} 
      className="text-blue-500 text-sm mt-3 flex justify-center w-full hover:underline"
    >
      Forgot Password?
    </button>

  </div>
</div>

  );
};

export default Login;
