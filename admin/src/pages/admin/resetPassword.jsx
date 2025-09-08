import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminContext } from '../../context/adminContext';

const ResetPassword = () => {
  const {backendUrl} = useContext(AdminContext)
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Received Token:", token);
    console.log("New Password:", password);
  /* try {*/
  const { data } = await axios.post(`${backendUrl}/api/admin/reset-password/${token}`, { password });
  
      console.log("Received Token:", token);
      console.log("New Password:", password);
      toast.success( 'Password updated successfully');
        navigate("/admin"); 
  
      
      
    
    /*} catch (error) {
      toast.error('Error resetting password');
    }*/
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-5"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Reset Password
        </button>
      </form>
      
    </div>
  );
};

export default ResetPassword;
