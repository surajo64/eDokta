import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const TelehealthRoom = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [meetingUrl, setMeetingUrl] = useState("");
  const { backendUrl, token, userData, loadUserProfileData } = useContext(AppContext);

  useEffect(() => {
    if (token && !userData) {
      loadUserProfileData();
    }
  }, [token, userData]);

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

  useEffect(() => {
    if (!meetingUrl || (token && !userData)) return;

    if (!window.JitsiMeetExternalAPI) {
      console.error("Jitsi Meet External API script not loaded.");
      return;
    }

    const domain = meetingUrl.split("/")[2];
    const roomName = meetingUrl.split("/").pop().split("#")[0].split("?")[0];

    const options = {
      roomName: roomName,
      width: "100%",
      height: "100%",
      parentNode: document.getElementById("jitsi-container"),
      configOverwrite: {
        prejoinConfig: { enabled: false }
      },
      userInfo: {
        displayName: userData?.name || "",
        email: userData?.email || ""
      }
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    const handleClose = () => {
      navigate("/My-Appointment");
    };

    api.addEventListener("videoConferenceLeft", handleClose);
    api.addEventListener("readyToClose", handleClose);

    return () => {
      api.dispose();
    };
  }, [meetingUrl, userData, token, navigate]);

  if (!meetingUrl || (token && !userData)) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Loading meeting...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Jitsi Meeting Container */}
      <div id="jitsi-container" className="w-full h-full" />

      {/* Top-left logo */}
      <img
        src="https://res.cloudinary.com/dyii5iyqq/image/upload/v1757340004/edoktor_fxnilb.jpg"
        alt="eDokta"
        className="absolute top-4 left-4 w-28 sm:w-32 z-50 pointer-events-none"
      />

      {/* Bottom-right overlay to cover Jitsi watermark */}
      <div className="absolute bottom-3 text-white right-3 bg-black/70 px-2 py-1 rounded z-50 flex items-center pointer-events-none">
        <p>Powered by eDokta...</p>
      </div>
    </div>
  );
};

export default TelehealthRoom;
