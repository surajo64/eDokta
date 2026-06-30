import React, { useContext, useState } from "react";
import { DoctorContext } from "../../context/doctorContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoading } from '../../context/loadingContext';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { dToken, backendUrl,setDToken, docData } = useContext(DoctorContext); // ✅ Make sure docData exists
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setLoading } = useLoading();


  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
  
    setLoading(true); 
  
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/change-password",
        {
          docId: docData._id, 
          oldPassword,
          newPassword,
          confirmPassword,
        },
        { headers: { dToken } }
      );
   
      if (data.success) {
        toast.success(data.message);
        logout();
    
      } else {
        console.log("data response:", data.message)
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    if (dToken) {
      navigate('/')
      dToken && setDToken ('')
      dToken && localStorage.removeItem('dToken')
      setTimeout(() => {
        setLoading(false);  
        navigate('/'); 
      }, 400);
    }
  }
  return (
    <div className="flex flex-col items-center mt-10 w-full">
      <form
        onSubmit={handleChangePassword}
        className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Change Password</h2>

        {/* Old Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit" 
        
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
