import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import logo from "../assets/logo.png";

const TelehealthRoom = () => {
  const { appointmentId } = useParams();
  const [meetingUrl, setMeetingUrl] = useState("");
  const { backendUrl, token } = useContext(AppContext);

  useEffect(() => {
  const fetchMeetingUrl = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointment/${appointmentId}`,
        { headers: { token } }
      );

      if (data.success) {
        let url = data.appointment.meetingUrl;

        // Ensure URL starts with https://
        if (url && !url.startsWith("http")) {
          url = `https://${url}`;
        }

        setMeetingUrl(url);
      }
    } catch (error) {
      console.error("Error fetching meeting URL:", error);
    }
  };

  fetchMeetingUrl();
}, [appointmentId, backendUrl, token]);


  if (!meetingUrl) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Loading meeting...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Jitsi Meeting */}
      <iframe
        src={meetingUrl}
        allow="camera; microphone; fullscreen; display-capture"
        className="w-full h-full"
        id="jitsiConferenceFrame0"
        style={{ border: "0" }}
        title="Telehealth Meeting"
      />

      {/* Top-left logo */}
      <img
        src="https://res.cloudinary.com/dyii5iyqq/image/upload/v1757340004/edoktor_fxnilb.jpg"
        alt="eDokta"
        className="absolute top-4 left-4 w-28 sm:w-32 z-50"
      />

      {/* Bottom-right overlay to cover Jitsi watermark */}
      <div className="absolute bottom-3 text-white right-3 bg-black/70 px-2 py-1 rounded z-50 flex items-center">
        <p>Powered by eDokta...</p>
      </div>
    </div>
  );
};

export default TelehealthRoom;
