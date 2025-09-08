import React, { useContext } from "react";
import { AdminContext } from "../context/adminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/doctorContext";

const SideBar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="min-h-screen bg-white border-r">

        {/* Admin Sidebar  */}  
      {aToken && (
        <nav>
          <ul className="space-y-4">
            <li>
              <NavLink
                to='/admin-dashboard'
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200  border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6 mr-2" />
                <p>Dashboard</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/all-appointment"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200  border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6 mr-2" />
                <p>Appointments</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/add-doctor"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200  border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.add_icon} alt="Add Doctor" className="w-6 h-6 mr-2" />
                <p>Add Doctor</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/doctors-list"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200  border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.people_icon} alt="Doctors List" className="w-6 h-6 mr-2" />
                <p>Doctors List</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/patient-list"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200 border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.people_icon} alt="Patient List" className="w-6 h-6 mr-2" />
                <p>Patients List</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-list"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200 border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.people_icon} alt="Patient List" className="w-6 h-6 mr-2" />
                <p>Admin List</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/fee-speciality"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200 border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.add_icon} alt="Add Speciality" className="w-7 h-7 mr-2" />
                <p>Speciality & Fees</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      )}

  {/* Doctor Sidebar  */}    
{dToken && (
        <nav>
          <ul className="space-y-4">
            <li>
              <NavLink
                to='/doctor-dashboard'
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200  border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6 mr-2" />
                <p>Dashboard</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/doctor-appointment"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200  border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6 mr-2" />
                <p>Doctor Appointments</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/doctor-profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200  border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.add_icon} alt="Add Doctor" className="w-6 h-6 mr-2" />
                <p>Doctor Profile</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/change-password"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer  ${
                    isActive ? "bg-gray-200 border-r-4 border-primary" : ""
                  }`
                }
              >
                <img src={assets.people_icon} alt="Patient List" className="w-6 h-6 mr-2" />
                <p>Change Password</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      )}


    </div>



  );
};

export default SideBar;
