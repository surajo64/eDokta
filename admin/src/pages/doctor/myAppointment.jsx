import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/doctorContext";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoading } from '../../context/loadingContext';

const MyAppointment = () => {
  const { appointments, dToken, cancelAppointment, approveAppointment, completeAppointment, docData, getAppointments, backendUrl, } = useContext(DoctorContext);
  const { calculateAge, currencySymbol } = useContext(AppContext);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [clinicalNote, setClinicalNote] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [investigation, setInvestigation] = useState("");
  const [showNote, setShowNote] = useState(false);
  const { setLoading } = useLoading();
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    // Report Filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [totalEarnings, setTotalEarnings] = useState(0);


  const handleApproveAppointment = (appointmentId) => {
    approveAppointment(appointmentId, setLoading);
  }
  const handleCancelAppoitment = (appointmentId) => {
    cancelAppointment(appointmentId, setLoading);
  }
  const handleCompleteClick = (appointments) => {
    setSelectedAppointment(appointments);
    setShowPopup(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) {
      alert("No appointment selected!");
      return;
    }

    const formData = {
      appointmentId: selectedAppointment._id,
      docId: docData.docId,
      clinicalNote,
      diagnosis,
      prescription,
      investigation
    };
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/clinical-note`, formData, {
        headers: { dToken },
      });

      console.log("API Response:", data); // Debugging

      if (data.success) {
        completeAppointment(selectedAppointment._id);
        toast.success("Note recorded successfully!");
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting clinical note:", error);
      toast.error("Failed to submit clinical note.");
    } finally {
      setLoading(false);
    }

    setShowPopup(false);
    setClinicalNote("");
    setDiagnosis("");
    setPrescription("");
  };


  // API to handle view note
  const handleViewNote = async (appointmentId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointment/${appointmentId}`,
        { headers: { dToken }, });

      if (data.success && data.appointment) {
        setSelectedAppointment(data.appointment);
        setShowNote(true);
      } else {
        alert("Failed to load clinical notes.");
      }
    } catch (error) {
      console.error("Error fetching clinical notes:", error);
      alert("An error occurred while fetching the clinical note.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredAppointments = async () => {
    if (!docData || !docData.docId) {
      console.error("Doctor ID is not available.");
      return;
    }
    setLoading(true);
    try {
      console.log("Fetching filtered appointments with:", { startDate, endDate, filterType,docId: docData.docId});
  
      const response = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dToken },
        params: {
          docId: docData.docId,
          startDate,
          endDate,
          filterType
        }
      });
      
      
  
      console.log("API Response:", response.data);
  
      if (response.data.success) {
        setFilteredAppointments(response.data.appointments);
        
        // Calculate total earnings
        const earnings = response.data.appointments
          .filter((item) => item.payment === true)
          .reduce((sum, item) => sum + item.docData.doctorFee, 0);
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
    if (docData && docData.docId) {
      fetchFilteredAppointments();
    }
  }, [startDate, endDate, filterType, docData]);

  useEffect(() => {
    if (dToken) {
      fetchFilteredAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-xl font-medium text-center sm:text-left">My Appointments</p>
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

      <div className="bg-white border-rounded text-sm max-h-[80vh] min-h-[60vh] overflow-scrolll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_2fr_2fr_3fr_2fr_3fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Phone</p>
          <p>Doctor</p>
          <p>Doctor Fee</p>
          <p>Actions</p>
        </div>

        {appointments.map((item, index) => (
          <div key={index} className="flex flex-col sm:grid sm:grid-cols-[0.5fr_3fr_1fr_2fr_2fr_3fr_2fr_3fr] items-center text-gray-500 py-3 px-4 sm:px-6 border-b hover:bg-blue-50">
            <p className="hidden sm:block">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full" src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>{item.slotDate} <br /> {item.slotTime}</p>
            <p>{item.userData.phone}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full bg-gray-300" src={item.docData.image} alt="" />
              <p className="text-center sm:text-left">{item.docData.name}</p>
            </div>
            <p className="text-center sm:text-left">{currencySymbol}{item.docData.doctorFee}</p>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {item.payment && !item.isCompleted && (
                <button className="text-white text-sm px-3 py-1 rounded-full bg-green-500 cursor-not-allowed">Paid!</button>
              )}
              {item.payment && !item.isCompleted && (
                <button onClick={() => handleCompleteClick(item)} className="bg-primary text-white text-sm px-3 py-1 rounded-full ">Clinical Note</button>
              )}
              {!item.payment && !item.cancelled && !item.approve && (
                <button onClick={() => handleApproveAppointment(item._id)} className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">Approve</button>
              )}
              {!item.payment && !item.cancelled && !item.approve && (
                <button className="bg-red-500 text-white text-sm px-3 py-1 rounded-full" onClick={() => handleCancelAppoitment(item._id)}>Cancel</button>
              )}
              {item.cancelled && (
                <button className='sm:min-w-48 py-2 border border-red-600 rounded text-red-600 cursor-not-allowed'>Appointment Cancelled!</button>
              )}

              {item.approve && item.payment && item.isCompleted && !item.cancelled && (
                <button
                  className="text-sm text-white px-3 py-1 border rounded bg-blue-500 cursor-pointerer">Completed</button>)}
              {item.approve && item.payment && item.isCompleted && !item.cancelled && (
                <button
                  onClick={() => handleViewNote(item._id)}
                  className="text-sm text-white px-3 py-1 border rounded bg-green-500 cursor-pointerer">View Note!</button>)}

              {item.approve && !item.payment && (
                <button className="text-sm cursor-not-allowed text-white px-3 py-1 border rounded bg-blue-400">Approved!</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Complete Appointment</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={clinicalNote}

                onChange={(e) => setClinicalNote(e.target.value)}
                placeholder="Clinical Note"
                className="w-full p-2 border rounded-md"
                required
              />
              <textarea
                value={investigation}
                onChange={(e) => setInvestigation(e.target.value)}
                placeholder="investigation"
                className="w-full p-2 border rounded-md"

              />

              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Prescription"
                className="w-full p-2 border rounded-md"
                required
              />

              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Diagnosis"
                className="w-full p-2 border rounded-md"
                required
              />


              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default MyAppointment;
