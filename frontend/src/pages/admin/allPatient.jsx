
import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from '../../context/adminContext'
import { AppContext } from '../../context/appContext'
import axios from "axios";
import { useLoading } from '../../context/loadingContext';




const allPatient = () => {

  const { aToken, getAllPatients, deletePatient, users, backendUrl } = useContext(AdminContext)
  const { calculateAge } = useContext(AppContext)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredPatient, setFilteredPatients] = useState([]);
  const { setLoading } = useLoading();


  const fetchFilteredPatients = async () => {
    setLoading(true);
    try {
      console.log("Fetching filtered appointments with:", { startDate, endDate });

      const response = await axios.get(`${backendUrl}/api/admin/patients-list`, {
        params: { startDate, endDate },
        headers: { aToken },
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        setFilteredPatients(response.data.users);

      } else {
        console.error("Failed to fetch filtered appointments.");
      }
    } catch (error) {
      console.error("Error fetching filtered appointments:", error);
    }finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (aToken) {
      fetchFilteredPatients()
    }

  }, [aToken])


  return (

    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-xl font-medium '>All Patients</p>

      {/* Report Filters */}
      <div className="bg-white p-4 mb-4 border rounded">
        <h3 className="text-lg font-medium mb-3">Generate Report</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="start-date" className="whitespace-nowrap">From:</label>
            <input
              id="start-date"
              type="date"
              className="border p-2 rounded w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="end-date" className="whitespace-nowrap">To:</label>
            <input
              id="end-date"
              type="date"
              className="border p-2 rounded w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={fetchFilteredPatients}
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Results */}
      {filteredPatient.length > 0 && (
        <div className="bg-white p-6 mb-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Report Summary</h3>
          <div className="flex flex-row gap-6 items-center">
            <div className="bg-gray-100 p-4 rounded-lg flex-1 shadow-sm ">
              <p className="text-gray-700 text-lg font-medium justify-center">Total Patients</p>
              <p className="text-gray-900 text-xl font-bold items-center">{filteredPatient.length}</p>
            </div>
          </div>
        </div>
      )}

      <div className='bg-white border-rounded text-sm max-h-[80vh] min-h-[60vh] overflow-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_4fr_3fr_3fr_2fr_3fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Email</p>
          <p>Phone</p>
          <p>Address</p>
          <p>gender</p>
          <p>Actions</p>
        </div>

        {filteredPatient?.length > 0 ? (
          filteredPatient.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_4fr_3fr_3fr_2fr_3fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-blue-50"
            >
              <p className="max-ms:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src={item.image} alt="" />
                <p>{item.name}</p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.dob)}</p>
              <p>{item.email}</p>
              <p>{item.phone}</p>
              <p>{item.address}</p>
              <p>{item.gender}</p>
              <div className="flex items-center gap-2">

                {/*  <button onClick={deletePatient}
                  className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  Delete
                </button>*/}

              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-5 text-gray-500">No patients found.</p>
        )}
      </div>
    </div>
  );
};
export default allPatient
