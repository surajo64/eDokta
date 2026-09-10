import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../context/adminContext";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  X,
  Settings,
  HeartPulse,
  Globe,
  ChevronDown,
  Stethoscope,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Pill,
  ShoppingBag,
  Package
} from "lucide-react";

// Standard Sidebar Link (Standalone)
const SidebarLink = ({ to, icon: Icon, children, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
          isActive
            ? "bg-white text-primary font-semibold shadow-sm"
            : "text-blue-100 hover:text-white hover:bg-white/10"
        }`
      }
    >
      <Icon size={19} className="shrink-0" />
      <span className="truncate">{children}</span>
    </NavLink>
  );
};

// Collapsible Dropdown Submenu
const SidebarDropdown = ({
  id,
  title,
  icon: Icon,
  items,
  isOpen,
  onToggle,
  onItemClick,
  currentPath,
}) => {
  const isAnyChildActive = items.some(
    (item) => currentPath === item.to || (item.to !== "/" && currentPath.startsWith(item.to + "/"))
  );

  return (
    <div className="space-y-1">
      {/* Dropdown Header Button */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium select-none ${
          isAnyChildActive
            ? "bg-white/15 text-white font-semibold shadow-xs"
            : "text-blue-100 hover:text-white hover:bg-white/10"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon size={19} className="shrink-0" />
          <span className="truncate">{title}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {isAnyChildActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180 text-white" : "text-blue-200"
            }`}
          />
        </div>
      </button>

      {/* Submenu Item Container with smooth expand/collapse */}
      <div
        style={{
          maxHeight: isOpen ? `${items.length * 48 + 20}px` : "0px",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
        }}
      >
        <div className="ml-5 pl-3 border-l-2 border-white/20 space-y-1 py-1">
          {items.map((item) => {
            const SubIcon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-xs font-medium ${
                    isActive
                      ? "bg-white text-primary font-semibold shadow-sm"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {SubIcon && <SubIcon size={15} className="shrink-0" />}
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Section Category Label
const SectionHeader = ({ label }) => (
  <div className="pt-3 pb-1 px-3.5">
    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200/60 select-none">
      {label}
    </p>
  </div>
);

const SideBar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { atoken, adminData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation schema for Admin with grouped related menus
  const adminNavigation = [
    {
      type: "section",
      label: "Overview",
    },
    {
      type: "link",
      to: "/admin-dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      type: "link",
      to: "/all-appointment",
      icon: Calendar,
      label: "Appointments",
    },
    {
      type: "section",
      label: "Clinical & Services",
    },
    {
      type: "group",
      id: "doctors",
      title: "Doctors",
      icon: Stethoscope,
      items: [
        { to: "/doctors-list", label: "Doctors List", icon: Users },
        { to: "/add-doctor", label: "Add Doctor", icon: UserPlus },
        { to: "/fee-speciality", label: "Speciality & Fees", icon: Award },
      ],
    },
    {
      type: "group",
      id: "patients",
      title: "Patients & Services",
      icon: Users,
      items: [
        { to: "/patient-list", label: "Patients List", icon: Users },
        { to: "/medical-tourism-requests", label: "Medical Tourism", icon: Globe },
      ],
    },
    {
      type: "group",
      id: "homeCare",
      title: "Home Care",
      icon: HeartPulse,
      items: [
        { to: "/home-care-teams-list", label: "Home Care Teams", icon: ShieldCheck },
        { to: "/add-home-care-team", label: "Add Home Care Team", icon: PlusCircle },
      ],
    },
    {
      type: "group",
      id: "pharmacy",
      title: "e-Pharmacy & Store",
      icon: Pill,
      items: [
        { to: "/admin-pharmacy-inventory", label: "Medicine Inventory", icon: Package },
        { to: "/admin-add-medicine", label: "Add Medicine", icon: PlusCircle },
        { to: "/admin-pharmacy-orders", label: "Pharmacy Orders", icon: ShoppingBag },
      ],
    },
    {
      type: "section",
      label: "Management & Academics",
    },
    {
      type: "group",
      id: "education",
      title: "Education",
      icon: GraduationCap,
      items: [
        { to: "/educator-courses-all", label: "All Courses", icon: BookOpen },
        { to: "/all-users", label: "Student List", icon: Users },
        { to: "/educator-list", label: "Educator List", icon: UserCheck },
      ],
    },
    {
      type: "group",
      id: "adminManagement",
      title: "Administration",
      icon: ShieldCheck,
      items: [
        { to: "/admin-list", label: "Admin List", icon: Users },
        { to: "/add-educator", label: "Add Educator / Admin", icon: UserPlus },
      ],
    },
  ];

  // Navigation schema for Educator
  const educatorNavigation = [
    {
      type: "section",
      label: "Overview",
    },
    {
      type: "link",
      to: "/educator-dashboard",
      icon: LayoutDashboard,
      label: "Educator Dashboard",
    },
    {
      type: "section",
      label: "Academics",
    },
    {
      type: "group",
      id: "courses",
      title: "Courses",
      icon: BookOpen,
      items: [
        { to: "/educator-my-courses", label: "My Courses", icon: BookOpen },
        { to: "/add-course", label: "Add Course", icon: PlusCircle },
        { to: "/students-enrolled", label: "Students Enrolled", icon: Users },
      ],
    },
    {
      type: "group",
      id: "quizzes",
      title: "Quizzes",
      icon: FileText,
      items: [
        { to: "/quiz-list", label: "Quiz List", icon: FileText },
        { to: "/add-quiz", label: "Add Quiz", icon: PlusCircle },
      ],
    },
    {
      type: "section",
      label: "Account",
    },
    {
      type: "link",
      to: "/educator-profile",
      icon: User,
      label: "Profile",
    },
    {
      type: "link",
      to: "/educator-settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  // Track which submenus are open
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    const pathname = window.location.pathname;

    const findAndSet = (list) => {
      list.forEach((item) => {
        if (item.type === "group" && item.items.some((sub) => sub.to === pathname)) {
          initial[item.id] = true;
        }
      });
    };

    findAndSet(adminNavigation);
    findAndSet(educatorNavigation);
    return initial;
  });

  // Auto-expand menu group when route changes to an item inside it
  useEffect(() => {
    const currentPath = location.pathname;

    const autoExpand = (list) => {
      list.forEach((item) => {
        if (
          item.type === "group" &&
          item.items.some(
            (sub) => sub.to === currentPath || (sub.to !== "/" && currentPath.startsWith(sub.to + "/"))
          )
        ) {
          setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
        }
      });
    };

    if (aToken) autoExpand(adminNavigation);
    if (atoken && adminData?.role === "educator") autoExpand(educatorNavigation);
  }, [location.pathname, aToken, atoken, adminData?.role]);

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLinkClick = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full select-none bg-primary">
      {/* Sidebar Logo Header Area */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-primary shrink-0">
        <div className="flex items-center gap-2">
          <img
            onClick={() => {
              navigate("/");
              handleLinkClick();
            }}
            className="w-28 cursor-pointer object-contain hover:opacity-90 transition-opacity filter brightness-0 invert"
            src={logo}
            alt="eDokta Logo"
          />
          <span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-white/20 text-white truncate max-w-[80px]">
            {aToken ? "Admin" : dToken ? "Doctor" : adminData?.role === "educator" ? "Educator" : "Staff"}
          </span>
        </div>

        {/* Mobile Sidebar Close Button inside Header */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Sidebar Links List */}
      <nav
        className="flex-1 px-3 py-3 space-y-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Admin Navigation */}
        {aToken && (
          <div className="space-y-1">
            {adminNavigation.map((entry, idx) => {
              if (entry.type === "section") {
                return <SectionHeader key={`sec-${idx}`} label={entry.label} />;
              }
              if (entry.type === "link") {
                return (
                  <SidebarLink
                    key={entry.to}
                    to={entry.to}
                    icon={entry.icon}
                    onClick={handleLinkClick}
                  >
                    {entry.label}
                  </SidebarLink>
                );
              }
              if (entry.type === "group") {
                return (
                  <SidebarDropdown
                    key={entry.id}
                    id={entry.id}
                    title={entry.title}
                    icon={entry.icon}
                    items={entry.items}
                    isOpen={!!openGroups[entry.id]}
                    onToggle={toggleGroup}
                    onItemClick={handleLinkClick}
                    currentPath={location.pathname}
                  />
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Doctor Navigation */}
        {dToken && (
          <div className="space-y-1">
            <SectionHeader label="Overview" />
            <SidebarLink to="/doctor-dashboard" icon={LayoutDashboard} onClick={handleLinkClick}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/doctor-appointment" icon={Calendar} onClick={handleLinkClick}>
              Appointments
            </SidebarLink>

            <SectionHeader label="Account" />
            <SidebarLink to="/doctor-profile" icon={User} onClick={handleLinkClick}>
              Doctor Profile
            </SidebarLink>
            <SidebarLink to="/change-password" icon={Settings} onClick={handleLinkClick}>
              Settings
            </SidebarLink>
          </div>
        )}

        {/* Educator Navigation */}
        {atoken && adminData?.role === "educator" && (
          <div className="space-y-1">
            {educatorNavigation.map((entry, idx) => {
              if (entry.type === "section") {
                return <SectionHeader key={`edu-sec-${idx}`} label={entry.label} />;
              }
              if (entry.type === "link") {
                return (
                  <SidebarLink
                    key={entry.to}
                    to={entry.to}
                    icon={entry.icon}
                    onClick={handleLinkClick}
                  >
                    {entry.label}
                  </SidebarLink>
                );
              }
              if (entry.type === "group") {
                return (
                  <SidebarDropdown
                    key={entry.id}
                    id={entry.id}
                    title={entry.title}
                    icon={entry.icon}
                    items={entry.items}
                    isOpen={!!openGroups[entry.id]}
                    onToggle={toggleGroup}
                    onItemClick={handleLinkClick}
                    currentPath={location.pathname}
                  />
                );
              }
              return null;
            })}
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

