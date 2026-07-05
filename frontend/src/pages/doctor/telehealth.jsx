import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DoctorContext } from "../../context/doctorContext";

const loadJitsiScript = (callback) => {
  const existingScript = document.getElementById("jitsi-external-api");
  if (existingScript) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://meet.jit.si/external_api.js";
  script.id = "jitsi-external-api";
  script.async = true;
  script.onload = () => {
    callback();
  };
  document.body.appendChild(script);
};

const Telehealth = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [meetingUrl, setMeetingUrl] = useState("");
  const { backendUrl, dToken, docData, getProfileData } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken && !docData) {
      getProfileData();
    }
  }, [dToken, docData]);

  useEffect(() => {
    const fetchMeetingUrl = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/doctor/appointment/${appointmentId}`,
          { headers: { dToken } }
        );

        if (data.success) {
          setMeetingUrl(data.appointment.meetingUrl);
        }
      } catch (error) {
        console.error("Error fetching meeting URL:", error);
      }
    };

    fetchMeetingUrl();
  }, [appointmentId, backendUrl, dToken]);

  useEffect(() => {
    if (!meetingUrl || (dToken && !docData)) return;

    let api = null;
    const domain = meetingUrl.split("/")[2];
    const roomName = meetingUrl.split("/").pop().split("#")[0].split("?")[0];

    loadJitsiScript(() => {
      if (!document.getElementById("jitsi-container")) return;

      let displayName = docData?.name ? docData.name.trim() : "";
      if (displayName && !displayName.toLowerCase().startsWith("dr.") && !displayName.toLowerCase().startsWith("dr ")) {
        displayName = `Dr. ${displayName}`;
      }

      const options = {
        roomName: roomName,
        width: "100%",
        height: "100%",
        parentNode: document.getElementById("jitsi-container"),
        configOverwrite: {
          prejoinConfig: { enabled: false }
        },
        userInfo: {
          displayName: displayName,
          email: docData?.email || ""
        }
      };

      api = new window.JitsiMeetExternalAPI(domain, options);

      const handleClose = () => {
        navigate("/doctor-appointment");
      };

      api.addEventListener("videoConferenceLeft", handleClose);
      api.addEventListener("readyToClose", handleClose);
    });

    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [meetingUrl, docData, dToken, navigate]);

  if (!meetingUrl || (dToken && !docData)) {
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

export default Telehealth;
