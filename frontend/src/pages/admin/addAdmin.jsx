import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/adminContext";

const addAdmin = () => {
const { backendUrl, aToken } = useContext(AdminContext);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);


  const onSubmitHandler = async (event) => {
    event.preventDefault();

    
    setLoading(true); 
    
    try {
      const formData = { name, email, password };
      
      // API Request
      const { data } = await axios.post(backendUrl + '/api/admin/add-admin',formData,
        {headers: { aToken } });

      if (data.success) {
        toast.success(data.message);

        // Reset form
        setName("");
        setEmail("");
        setPassword("");
      } 
    } catch (error) {
      console.error("Error adding admin:", error);
   toast.error(error.response?.data?.message || "An error occurred while adding the admin.");
    }finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex flex-col items-center mt-10 w-full">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Add New Admin</h2>
  
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* Email Field */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* Password Field */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            {/* Submit Button */} 
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
            >
              {loading ? "Adding..." : "Add Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  };
export default addAdmin
