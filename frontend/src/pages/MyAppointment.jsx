import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { useNavigate, useSearchParams } from "react-router-dom";


const MyAppointment = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointment] = useState([])
  const [searchParams] = useSearchParams();
  const [showNote, setShowNote] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const reference = searchParams.get("reference"); // Get Paystack reference from URL
const navigate = useNavigate()
  const getUserAppointment = async () => {

    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      console.log(data.appointments);

      if (data.success) {
        setAppointment(data.appointments.reverse())
        console.log(data.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // cancel appointment function
  const cancelAppoint = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointment()
        getDoctorsData()

      } else {
        toast.error(data.message)
      }

    } catch (error) {

    }
  }

  const appointmentPaystack = async (appointmentId) => {
    if (!token) {
      alert("You are not logged in. Please log in first.");
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/paystack-payment',
        { appointmentId },
        { headers: { token } }
      );

      console.log("Response:", data);
      if (data.success) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Payment initialization failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  // payment verification

  const verifyPaystackPayment = async (reference) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/paystack-verify', { reference }, {
        headers: { token },
      });

      console.log("Verification Response:", data);

      if (data.success) {
        alert("Payment verified!");
        // Redirect to success page or update UI accordingly
        window.location.href = "/My-Appointment";
      } else {
        toast.error("Payment verification failed: " + data.message);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Something went wrong while verifying payment.");
    }
  };


  const handleCompleteClick = (appointments) => {
    setSelectedAppointment(appointments);
    setShowPopup(true);
  };
  // API to handle view note
  const handleViewNote = async (appointmentId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointment/${appointmentId}`,
        { headers: { token }, });

      if (data.success && data.appointment) {
        setSelectedAppointment(data.appointment);
        setShowNote(true);
      } else {
        alert("Failed to load clinical notes.");
      }
    } catch (error) {
      console.error("Error fetching clinical notes:", error);
      alert("An error occurred while fetching the clinical note.");
    }
  };




  useEffect(() => {
    if (reference && token) {
      verifyPaystackPayment(reference); // Verify payment if reference is found
    }
  }, [reference, token]);

  useEffect(() => {
    if (token) {
      getUserAppointment()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p className='font-medium mt-1 text-primary'>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-sm mt-1'>{item.docData.address}</p>
              <p className='font-medium mt-1 text-green-700'><span className='text-primary font-semibold font-medium'>BOOKED: </span> {item.slotDate} | {item.slotTime}</p>
            </div>

            <div></div>
            <div className='flex flex-col justify-end gap-2'>
              {!item.cancelled && item.payment && !item.isCompleted && item.type === "telemedicine" && (
                item.meetingUrl ? (
                  <button
                    onClick={() => navigate(`/telehealth/${item._id}`)}
                    className="text-sm text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Join Telehealth
                  </button>
                ) : (
                  <button
                    className="text-sm text-white text-center sm:min-w-48 py-2 border rounded bg-green-300 cursor-not-allowed"
                  >
                    Paid & Processing..
                  </button>
                )
              )}

              {item.approve && item.payment && item.isCompleted && !item.cancelled && (
                <button onClick={() => handleViewNote(item._id)}
                  className="text-sm text-white text-center sm:min-w-40 px-3 py-1 border rounded bg-green-500 cursor-pointer">View Note!</button>)}

              {!item.cancelled && !item.payment && item.approve && <button className='text-sm text-white text-center sm:min-w-48 py-2 border rounded bg-green-500 cursor-not-allowed' >Approved!</button>}
              {!item.cancelled && !item.payment && item.approve && <button className='text-sm text-white bg-blue-400 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer' onClick={() => appointmentPaystack(item._id)} >Pay Now!</button>}

              {!item.cancelled && !item.payment && !item.approve && <button className='text-sm text-white text-center sm:min-w-48 py-2 border rounded bg-blue-300 cursor-not-allowed'>Pending....</button>}

              {!item.cancelled && !item.payment && !item.approve && <button onClick={() => cancelAppoint(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>Cancel Appointment</button>}

              {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-600 rounded text-red-600 cursor-not-allowed'>Appointment Cancelled!</button>}

            </div>
          </div>
        ))}
      </div>


      {showNote && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Patient Clinical Note History</h2>
            <div className="max-h-60 overflow-y-auto p-2 border border-gray-300 rounded">

              <h2 className="text-xl font-semibold mb-2">Clinical Notes</h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedAppointment.clinicalNote || "No clinical note recorded."}
              </p>

              <h2 className="text-xl font-bold mb-4">Investigations</h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedAppointment.investigation
                  ? selectedAppointment.investigation.split("\n").map((line, index) => (
                    <span key={index}>{line}  <br /></span>))
                  : "No prescription recorded."}</p>

              <h2 className="text-xl font-semibold mb-2">Drug Prescriptions</h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedAppointment.prescription
                  ? selectedAppointment.prescription.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))
                  : "No prescription recorded."}
              </p>

              <h2 className="text-xl font-semibold mb-4">Diagnosis</h2>
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

  )
}

export default MyAppointment

