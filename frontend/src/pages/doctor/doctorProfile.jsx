import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/doctorContext'
import axios from "axios";
import { toast } from "react-toastify";
import { useLoading } from '../../context/loadingContext';

const doctorProfile = () => {

  const { getProfileData, currencySymbol, docData, backendUrl, setDocData, dToken } = useContext(DoctorContext)
  const [image, setImage] = useState(false)
  const { setLoading } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const states = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe"
  ];
  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); 

    const formData = new FormData();
    formData.append("docId", docData._id);
    formData.append("name", docData.name);
    formData.append("speciality", docData.speciality);
    formData.append("email", docData.email);
    formData.append("degree", docData.degree);
    formData.append("address", docData.address);
    formData.append("experience", docData.experience);
    formData.append("about", docData.about);
    formData.append("available", docData.available ? "true" : "false");
    formData.append("state", docData.state);

    image && formData.append("image", image);
    setLoading(true);

    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', formData, { headers: { dToken } })


      if (data.success) {
        toast.success(data.message)
        await getProfileData()
        setIsEditing(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])


  return docData && (
    <div className="flex flex-col items-center mt-10 w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Doctor Profile</h2>

        {/* Profile Image */}


        {
          isEditing ?
            <label htmlFor="image">
              <div className="w-32 h-32 mx-auto relative">
                {/* Show new image if selected, otherwise show existing image */}
                <img
                  src={image ? URL.createObjectURL(image) : docData.image} alt="Profile Preview"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover" />

              </div>
              <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
            </label>
            : <img src={docData.image} alt="Profile" className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500 object-cover" />

        }

        {/* Profile Form - Two Columns */}
        <form className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <label className="text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={docData.name}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Speciality</label>
            {isEditing ? (
              <select
                name="speciality"
                onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                value={docData.speciality}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Speciality</option>
                <option value="General physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Psychiatrists">Psychiatrists</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Cardiologists">Cardiologists</option>
                <option value="Anesthesiologists">Anesthesiologists</option>
                <option value="Family Physicians">Family Physicians</option>
              </select>
            ) : (
              <input
                type="text"
                name="speciality"
                value={docData.speciality}
                disabled
                className="w-full p-2 border rounded-md"
              />
            )}
          </div>

          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={docData.email}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>

          <label className="text-gray-700 font-medium">Degree</label>
            <input
              type="text"
              name="degree"
              value={docData.degree}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md"
            />

          </div>
          <div>

            <label className="text-gray-700 font-medium">State</label>
            {isEditing ? (
              <select
                name="state"
                onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                value={docData.state}
                className="w-full p-2 border border-blue-200 rounded"
                required
              >
                <option value="" disabled>State</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="state"
                value={docData.state}
                disabled
                className="w-full p-2 border rounded-md"
              />
            )}

          </div>
          {/* Right Column */}

          {/* Availability Checkbox */}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={docData.available || false} // Ensure it's checked when true in the database
              onChange={(e) =>
                setDocData((prev) => ({ ...prev, available: e.target.checked }))
              }
              disabled={!isEditing}
              className="w-5 h-5 text-green-500 bg-blue-500 border-gray-300 rounded focus:ring-green-500"
            />
            <p className="text-gray-700 font-medium">Available</p>
          </div>



          <div className="flex items-center gap-2" >
            <label className="text-gray-700 font-medium">Address</label>
            <textarea
              name="address"
              value={docData.address}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Experience</label>
            {isEditing ? (
              <select
                name="experience"
                onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                value={docData.experience}
                className="w-full p-2 border rounded-md"
                required >

                <option value="">---Select Experience---</option>
                <option value="1-5 Years">1-5 Years </option>
                <option value="6-10 Years">6-10 Years</option>
                <option value="11-15 Years">11-15 Years</option>
                <option value="16-20 Years">16-20 Years</option>
                <option value="More than 20 Years">More than 20 Years</option>
              </select>
            ) : (
              <input
                type="text"
                name="experience"
                value={docData.experience}
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            )}
          </div>

          {/* Full Width Textarea for About Section */}
          <div className="col-span-2">
            <label className="text-gray-700 font-medium">About</label>
            <textarea
              name="about"
              value={docData.about}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md"
            />
          </div>

        </form>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {isEditing ? (
            <>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={handleSubmit}
              >Update Profile
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default doctorProfile
