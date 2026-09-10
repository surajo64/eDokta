import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../context/adminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { useLoading } from '../../context/loadingContext';

const AllAppointment = () => {
  const { aToken, appointments, handleViewNote, selectedAppointment, setSelectedAppointment, allDoctorsAppointments, backendUrl, approveAppointment, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, currencySymbol } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showNote, setShowNote] = useState(false);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [filteredAppointments, setFilteredAppointments] = useState([]);
  // Report Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("all"); // completed, uncompleted, all
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [doctorId, setDoctorId] = useState("all"); 
  const [doctors, setDoctors] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    setActionType('approve');
    try {
      await approveAppointment(id);
      await fetchFilteredAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoadingId(id);
    setActionType('reject');
    try {
      await cancelAppointment(id);
      await fetchFilteredAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };


  const fetchFilteredAppointments = async () => {
    setLoading(true);
    try {
      console.log("Fetching filtered appointments with:", { startDate, endDate, filterType, doctorId }); 
  
      const response = await axios.get(`${backendUrl}/api/admin/appointments`, {
        params: { startDate, endDate, filterType, doctorId }, 
        headers: { aToken },
      });
  
      console.log("API Response:", response.data);
  
      if (response.data.success) {
        const sorted = response.data.appointments.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setFilteredAppointments(sorted);
        
        // Calculate total earnings
        const earnings = response.data.appointments
          .filter((item) => item.payment === true)
          .reduce((sum, item) => sum + item.amount, 0);
        setTotalEarnings(earnings);
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
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/doctors`, {
        headers: { aToken },
      });

      if (response.data.success) {
        setDoctors(response.data.doctors);
      } else {
        console.error("Failed to fetch doctors.");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  fetchDoctors();
}, []);


  useEffect(() => {
    if (aToken) {
      fetchFilteredAppointments();
    }


  }, [aToken]);


  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-xl font-medium">All Appointments</p>

      {/* Report Filters */}
<div className="bg-white p-4 mb-4 border rounded">
  <h3 className="text-lg font-medium mb-3">Generate Report</h3>
  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
  <p>From:   <input
      type="date"
      className="border p-2 rounded"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    /></p>
   
   <p>To:    <input
      type="date"
      className="border p-2 rounded"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    /></p>
    <select
      className="border p-2 rounded"
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
    >
      <option value="all">All</option>
      <option value="completed">Completed</option>
      <option value="uncompleted">Uncompleted</option>
    </select>
    <select
  className="border p-2 rounded"
  value={doctorId}
  onChange={(e) => setDoctorId(e.target.value)} // Update state
>
  <option value="all">All Doctors</option>
  {doctors.map((doctor) => (
    <option key={doctor._id} value={doctor._id}>
      {doctor.name}
    </option>
  ))}
</select>
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={fetchFilteredAppointments}
    >
      Generate Report
    </button>
  </div>
</div>

      {/* Report Results */}
{filteredAppointments.length > 0 && (
  <div className="bg-white p-6 mb-4 border rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">Report Summary</h3>
    <div className="flex flex-row gap-6 items-center">
      <div className="bg-gray-100 p-4 rounded-lg flex-1 shadow-sm ">
        <p className="text-gray-700 text-lg font-medium justify-center">Total Appointments</p>
        <p className="text-gray-900 text-xl font-bold items-center">{filteredAppointments.length}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg flex-1 shadow-sm">
        <p className="text-gray-700 text-lg font-medium">Total Earnings</p>
        <p className="text-gray-900 text-xl font-bold">{currencySymbol}{totalEarnings}</p>
      </div>
    </div>
  </div>
)}

      {/* Appointments Table */}
      <div className="bg-white border-rounded text-sm max-h-[80vh] min-h-[60vh] overflow-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_2fr_2fr_2fr_3fr_2fr_3fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Phone</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Status</p>
        </div>
        {filteredAppointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_2fr_2fr_2fr_3fr_2fr_3fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-blue-50"
          >
            <p>{index + 1}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 rounded-full" src={item.userData?.image || 'https://res.cloudinary.com/dyii5iyqq/image/upload/v1757340004/edoktor_fxnilb.jpg'} alt="" />
              <div>
                <p className="font-semibold text-gray-900">{item.userData?.name}</p>
                {item.docData?.isHomeCareTeam && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider block mt-0.5">
                    🏠 Home Visit Team
                  </span>
                )}
              </div>
            </div>
            <p>{calculateAge(item.userData?.dob) || 'N/A'}</p>
            <p>
              {item.slotDate} <br /> {item.slotTime}
            </p>
            <p>{item.userData?.phone || 'N/A'}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 rounded-full bg-gray-300 object-cover" src={item.docData?.image} alt="" />
              <div>
                <p className="font-medium text-gray-900">{item.docData?.name}</p>
                {item.docData?.doctorName && (
                  <p className="text-[10px] text-gray-500">Dr: {item.docData.doctorName}</p>
                )}
              </div>
            </div>
            <p>{currencySymbol}{item.amount}</p>

            <div className="flex flex-wrap gap-1.5 items-center">
              {item.cancelled ? (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Completed
                </span>
              ) : (
                <>
                  {!item.approve ? (
                    <button
                      disabled={actionLoadingId === item._id}
                      onClick={() => handleApprove(item._id)}
                      className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm transition-all flex items-center gap-1.5"
                    >
                      {actionLoadingId === item._id && actionType === 'approve' ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Approving...</span>
                        </>
                      ) : (
                        <span>Approve</span>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Approved
                    </span>
                  )}

                  <button
                    disabled={actionLoadingId === item._id}
                    onClick={() => handleReject(item._id)}
                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm transition-all flex items-center gap-1.5"
                  >
                    {actionLoadingId === item._id && actionType === 'reject' ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Rejecting...</span>
                      </>
                    ) : (
                      <span>Reject</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between mt-4'>
        <button
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <p>Page {currentPage} of {totalPages}</p>
        <button
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>


      {showNote && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Patient Clinical Note History</h2>
            <div className="max-h-60 overflow-y-auto p-2 border border-gray-300 rounded">

              <h2 className="text-xl font-bold mb-4">Clinical Notes</h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedAppointment.clinicalNote || "No clinical note recorded."}
              </p>

              <h2 className="text-xl font-bold mb-4">Investigations</h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedAppointment.investigation
                  ? selectedAppointment.investigation.split("\n").map((line, index) => (
                    <span key={index}>{line}  <br /></span>))
                  : "No prescription recorded."}</p>

              <h2 className="text-xl font-bold mb-4">Drug Prescriptions</h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedAppointment.prescription
                  ? selectedAppointment.prescription.split("\n").map((line, index) => (
                    <span key={index}>{line}  <br /></span>))
                  : "No prescription recorded."}</p>

              <h2 className="text-xl font-bold mb-4">Diagnosis</h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedAppointment.diagnosis || "No diagnosis recorded."}
              </p>
            </div>

            <button
              onClick={() => setShowNote(false)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}



    </div>
  );
};

export default AllAppointment