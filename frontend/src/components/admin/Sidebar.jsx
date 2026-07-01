import React, { useContext } from "react";
import { AdminContext } from "../../context/adminContext";
import { NavLink, useNavigate } from "react-router-dom";
import { DoctorContext } from "../../context/doctorContext";
import { AppContext } from "../../context/AppContext";
import logo from "../../assets/logo.png";
import {
  LayoutDashboard,
  Calendar,
  UserPlus,
  Users,
  BookOpen,
  Award,
  PlusCircle,
  FileText,
  User,
  Key,
  X,
  Settings
} from "lucide-react";

// Modern Sidebar Link Component
const SidebarLink = ({ to, icon: Icon, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
          isActive
            ? "bg-white text-primary font-semibold shadow-sm"
            : "text-blue-100 hover:text-white hover:bg-white/10"
        }`
      }
    >
      <Icon size={20} className="shrink-0" />
      <span className="truncate">{children}</span>
    </NavLink>
  );
};

const SideBar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { atoken, adminData } = useContext(AppContext);
  const navigate = useNavigate();

  const sidebarContent = (
    <div className="flex flex-col h-full select-none bg-primary">
      {/* Sidebar Logo Header Area */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-primary shrink-0">
        <div className="flex items-center gap-2">
          <img
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }}
            className="w-28 cursor-pointer object-contain hover:opacity-90 transition-opacity filter brightness-0 invert"
            src={logo}
            alt="eDokta Logo"
          />
          <span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-white/20 text-white truncate max-w-[80px]">
            {aToken ? "Admin" : dToken ? "Doctor" : adminData?.role === "educator" ? "Educator" : "Staff"}
          </span>
        </div>
        
        {/* Mobile Sidebar Close Button inside the Header */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Sidebar Links list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Admin Sidebar */}
        {aToken && (
          <div className="space-y-1">
            <SidebarLink to="/admin-dashboard" icon={LayoutDashboard}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/all-appointment" icon={Calendar}>
              Appointments
            </SidebarLink>
            <SidebarLink to="/add-doctor" icon={UserPlus}>
              Add Doctor
            </SidebarLink>
            <SidebarLink to="/doctors-list" icon={Users}>
              Doctors List
            </SidebarLink>
            <SidebarLink to="/patient-list" icon={Users}>
              Patients List
            </SidebarLink>
            <SidebarLink to="/admin-list" icon={Users}>
              Admin List
            </SidebarLink>
            <SidebarLink to="/educator-list" icon={Users}>
              Educator List
            </SidebarLink>
            <SidebarLink to="/fee-speciality" icon={Award}>
              Speciality & Fees
            </SidebarLink>
            <SidebarLink to="/all-users" icon={Users}>
              Student List
            </SidebarLink>
            <SidebarLink to="/add-educator" icon={UserPlus}>
              Add Educator/Admin
            </SidebarLink>
            <SidebarLink to="/educator-courses-all" icon={BookOpen}>
              All Courses (Edu)
            </SidebarLink>
          </div>
        )}

        {/* Doctor Sidebar */}
        {dToken && (
          <div className="space-y-1">
            <SidebarLink to="/doctor-dashboard" icon={LayoutDashboard}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/doctor-appointment" icon={Calendar}>
              Appointments
            </SidebarLink>
            <SidebarLink to="/doctor-profile" icon={User}>
              Doctor Profile
            </SidebarLink>
            <SidebarLink to="/change-password" icon={Settings}>
              Settings
            </SidebarLink>
          </div>
        )}

        {/* Educator Sidebar */}
        {atoken && adminData?.role === "educator" && (
          <div className="space-y-1">
            <SidebarLink to="/educator-dashboard" icon={LayoutDashboard}>
              Educator Dashboard
            </SidebarLink>
            <SidebarLink to="/educator-my-courses" icon={BookOpen}>
              My Courses
            </SidebarLink>
            <SidebarLink to="/add-course" icon={PlusCircle}>
              Add Course
            </SidebarLink>
            <SidebarLink to="/students-enrolled" icon={Users}>
              Students Enrolled
            </SidebarLink>
            <SidebarLink to="/add-quiz" icon={PlusCircle}>
              Add Quiz
            </SidebarLink>
            <SidebarLink to="/quiz-list" icon={FileText}>
              Quiz List
            </SidebarLink>
            <SidebarLink to="/educator-profile" icon={User}>
              Profile
            </SidebarLink>
            <SidebarLink to="/educator-settings" icon={Settings}>
              Settings
            </SidebarLink>
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar (Persistent left side, full screen height) */}
      <aside className="hidden md:block w-64 shrink-0 bg-primary border-r border-primary/20 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar (Slides in) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary h-screen shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default SideBar;
