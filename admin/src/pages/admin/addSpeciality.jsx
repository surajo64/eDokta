import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/adminContext";
import { useLoading } from '../../context/loadingContext';

const AddSpeciality = () => {
  const { backendUrl, aToken, specialityData, setSpecialityData, getAllSpeciality } =
    useContext(AdminContext);

  const [speciality, setSpeciality] = useState("");
  const [fee, setFee] = useState("");
  const [doctorFee, setDoctorFee] = useState("");
  const [feePercentage, setFeePercentage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSpeciality, setEditingSpeciality] = useState(null); 
  const { setLoading } = useLoading();
  // Calculate doctor fee
  useEffect(() => {
    setDoctorFee((fee * feePercentage) / 100);
  }, [fee, feePercentage]);

  // Handles opening the form with data for update
  const handleUpdate = (item) => {
    setEditingSpeciality(item);
    setSpeciality(item.speciality);
    setFee(item.fee);
    setFeePercentage(item.feePercentage);
    setDoctorFee(item.doctorFee);
    setShowForm(true);
  };

  // Handles opening the form for adding new speciality
  const handleAddNew = () => {
    setEditingSpeciality(null);
    setSpeciality("");
    setFee("");
    setFeePercentage("");
    setDoctorFee("");
    setShowForm(true);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = { speciality, fee, feePercentage, doctorFee };

      if (editingSpeciality) {
        // Update existing specialty
        const { data } = await axios.post(
          `${backendUrl}/api/admin/update-speciality`, 
          { specialityId: editingSpeciality._id, ...formData }, 
          { headers: { aToken } }
        );

        console.log("🛠 Backend Response:", data);

        if (data.success) {
          toast.success("Speciality updated successfully!");
          getAllSpeciality(); // Refresh list
        }
      } else {
        // Add new specialty
        const { data } = await axios.post(`${backendUrl}/api/admin/add-speciality`, formData, {
          headers: { aToken },
        });

        if (data.success) {
          toast.success("Speciality added successfully!");
          getAllSpeciality();
        }
      }

      setShowForm(false); 
   } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (aToken) {
      getAllSpeciality();
    }
  }, [aToken]);

  return specialityData && (
    <div className="w-full max-w-6xl m-5">
      <div className="items-center">
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-600 transition"
        >
          Add Speciality
        </button>
      </div>

      <p className="mb-3 text-xl font-medium">All Specialities</p>

      <div className="bg-white border-rounded text-sm max-h-[80vh] min-h-[60vh] overflow-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_2fr_2fr_2fr_2fr] py-3 px-6 border-b">
          <p>#</p>
          <p>Speciality</p>
          <p>Patient Fee</p>
          <p>Percentage</p>
          <p>Doctor Fee</p>
          <p>Action</p>
        </div>

        {specialityData.length > 0 ? (
          specialityData.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_2fr_2fr_2fr_2fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-blue-50"
            >
              <p>{index + 1}</p>
              <p>{item.speciality}</p>
              <p>{item.fee}</p>
              <p>{item.feePercentage}%</p>
              <p>{item.doctorFee}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdate(item)}
                  className="bg-green-500 text-white text-sm px-3 py-1 rounded-full"
                >
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-5 text-gray-500">No specialities found.</p>
        )}
      </div>

      {/* Popup Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
              {editingSpeciality ? "Update Speciality" : "Add New Speciality"}
            </h2>

            <form onSubmit={onSubmitHandler} className="space-y-4">
              {/* Speciality Field */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Speciality</label>
                <input
                  type="text"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  placeholder="Enter Speciality"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fee Field */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Fees</label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="Enter Fee"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Percentage Field */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Percentage</label>
                <input
                  type="number"
                  value={feePercentage}
                  onChange={(e) => setFeePercentage(e.target.value)}
                  placeholder="Enter Percentage"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Doctor Fee Field */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Doctor Fee</label>
                <input
                  type="number"
                  value={doctorFee}
                  disabled
                  placeholder="Doctor Fee will be calculated"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
              >
                { editingSpeciality ? "Update Speciality" : "Add Speciality"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSpeciality;
