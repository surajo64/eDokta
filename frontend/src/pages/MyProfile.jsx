import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from '../assets/assets.js'
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyProfile = () => {
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [image, setImage] = useState(false)
  const { userData, setUserData, loadUserProfileData, backendUrl, token } = useContext(AppContext);

  //update profile

  const updateProfile = async () => {

     try {
    const formData = new FormData();

    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("dob", userData.dob);
    formData.append("nin", userData.nin);
    formData.append("gender", userData.gender);
    formData.append("address", userData.address);

    image && formData.append("image", image);

    const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
    if (data.success) {
      toast.success(data.message)
      await loadUserProfileData()
      setEditMode(false)
      setImage(false)
    } else {
      toast.error(data.message)
    }

        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 ">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center mt-4">
        {/* Profile Image */}
        {/* Profile Fields */}
        <div className="mt-4 text-gray-700 text-sm space-y-2">


          {
            editMode ?
              <label htmlFor="image">
                <div className="w-32 h-32 mx-auto relative">
                  {/* Show new image if selected, otherwise show existing image */}
                  <img
                    src={image ? URL.createObjectURL(image) : userData.image} alt="Profile Preview"
                    className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover" />

                </div>
                <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
              </label>
              : <img src={userData.image} alt="Profile" className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500 object-cover" />

          }

          {
            editMode
              ?
              <input
                type="text" name="name" value={userData.name} placeholder="Full Name"
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="border p-2 w-full rounded" />
              : <h2 className="text-2xl font-bold">{userData.name}</h2>
          }

          {
            editMode
              ?
              <input
                type="email"
                name="email" placeholder="Enter Email Address"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className="border p-2 w-full rounded" />
              : <p><strong>Email:</strong>{userData.email}</p>
          }


{
            editMode
              ?
              <input
                type="text" name="nin" value={userData.nin} placeholder="NIN"
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="border p-2 w-full rounded" />
              : <p><strong>NIN: </strong>{userData.nin}</p>
          }

          {
            editMode
              ?
              <input
                type="tel"
                name="phone" placeholder="Enter Phone Number"
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                className="border p-2 w-full rounded" />
              : <p><strong>Phone:</strong> {userData.phone}</p>
          }

          {
            editMode ? (
              <input
                type="date"
                name="dob"
                value={userData.dob ? new Date(userData.dob).toISOString().split("T")[0] : ""}
                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                className="border p-2 w-full rounded"
              />
            ) : (
              <p><strong>DOB:</strong> {userData.dob ? new Date(userData.dob).toDateString() : "N/A"}</p>
            )
          }



          {
            editMode ? (
              <select
                name="gender"
                value={userData.gender}
                onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                className="border p-2 w-full rounded"
              >
                <option value="">{userData.gender}</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p><strong>Gender:</strong> {userData.gender}</p>
            )
          }

          {
            editMode ? (
              <textarea
                name="address"
                value={userData.address}
                onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                className="border p-2 w-full rounded"
                rows="3" // Adjust height as needed
                placeholder="Enter your address"
              />
            ) : (
              <p><strong>Address:</strong> {userData.address}</p>
            )
          }



        </div>

        {/* Buttons */}
        <div className="mt-4">
          {editMode ? (
            <button onClick={updateProfile} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Save
            </button>
          ) : (
            <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
