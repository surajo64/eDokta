import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/doctorContext";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoading } from '../../context/loadingContext';
import { useNavigate, useSearchParams } from "react-router-dom";

const MyAppointment = () => {
  const {
    appointments,
    dToken,
    cancelAppointment,
    approveAppointment,
    completeAppointment, docData,
    getAppointments, backendUrl
  } = useContext(DoctorContext)

  const { calculateAge, currencySymbol } = useContext(AppContext)
const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [clinicalNote, setClinicalNote] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [investigation, setInvestigation] = useState("");
  const [showNote, setShowNote] = useState(false);
  const { setLoading } = useLoading();
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [filterTriggered, setFilterTriggered] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;



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
      toast.error("No appointment selected!");
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
        completeAppointment(selectedAppointment._id, setLoading);
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


  useEffect(() => {
    if (dToken) {
      getAppointments()
      handleGenerateFilter()
    }
  }, [dToken])

  useEffect(() => {
    if (appointments.length > 0) {
      handleGenerateFilter();
    }
  }, [appointments]);

  // Normalize date to midnight to avoid timezone mismatches
  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // Sets time to 00:00:00
  }
  const handleGenerateFilter = () => {
    setLoading(true); // Start loading
    setFilterTriggered(true);

    setTimeout(() => {

      const filtered = appointments.filter((item) => {
        const appointmentDate = normalizeDate(item.date);
        const start = startDate ? normalizeDate(startDate) : null;
        const end = endDate ? normalizeDate(endDate) : null;

        const isWithinDateRange =
          (!start || appointmentDate >= start) &&
          (!end || appointmentDate <= end);

        const isStatusMatch =
          statusFilter === 'all' ||
          (statusFilter === 'completed' && item.isCompleted) ||
          (statusFilter === 'uncompleted' && !item.isCompleted);

        return isWithinDateRange && isStatusMatch;
      });

      setFilteredAppointments(filtered);
      setCurrentPage(1);
      setLoading(false); // End loading
    }, 300); // Timeout mimics async processing; adjust as needed
  };


  const displayedAppointments = filterTriggered ? filteredAppointments : appointments;

  const totalPages = Math.ceil(displayedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedAppointments = displayedAppointments.slice(startIndex, startIndex + itemsPerPage);



  // Calculate total earnings
  useEffect(() => {
    const earnings = appointments
      .filter((item) => item.payment === true)
      .reduce((sum, item) => sum + item.docData.doctorFee, 0);
    setTotalEarnings(earnings);
  }, [appointments]);


  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-xl font-medium'>My Appointments</p>

      {/* Filter Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap gap-4 items-end justify-center">
          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="uncompleted">Uncompleted</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleGenerateFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate
            </button>
          </div>
        </div>
      </div>




      {/* Report Results */}
      {filteredAppointments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Report Summary</h3>
          <div className="flex flex-row gap-2 items-center">
            <div className="bg-white px-2 py-1 rounded-md flex-1 text-center border border-blue-100">
              <p className="text-[12px] text-blue-600">Appointments</p>
              <p className="text-sm font-bold text-blue-900">{filteredAppointments.length}</p>
            </div>
            <div className="bg-white px-2 py-1 rounded-md flex-1 text-center border border-blue-100">
              <p className="text-[12px] text-blue-600">Earnings</p>
              <p className="text-sm font-bold text-blue-900">
                {currencySymbol}
                {totalEarnings}
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Appointments Table */}
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

        {displayedAppointments.length === 0 && filterTriggered && (
          <p className='p-4 text-red-500 italic '>No appointments found within selected range.</p>
        )}
        {paginatedAppointments.map((item, index) => (
          <div key={index} className="flex flex-col sm:grid sm:grid-cols-[0.5fr_3fr_1fr_2fr_2fr_3fr_2fr_3fr] items-center text-gray-500 py-3 px-4 sm:px-6 border-b hover:bg-blue-50">
            <p className="hidden sm:block">{startIndex + index + 1}</p>
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
                item.type === "telemedicine" ? (

                   <button
                    onClick={() => navigate(`/telehealthRoom/${item._id}`)}
                    className="text-sm text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Start Meeting
                  </button>
 
                ) : (
                  <button
                    disabled
                    className="text-white text-sm px-3 py-1 rounded-full bg-green-500 cursor-not-allowed"
                  >
                    Paid!
                  </button>
                )
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}


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

export default MyAppointment
