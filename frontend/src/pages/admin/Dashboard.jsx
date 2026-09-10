import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../context/adminContext";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { useLoading } from "../../context/loadingContext";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  List,
  Stethoscope,
  Calendar as CalendarIcon,
  ArrowUpRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  PlusCircle,
  Activity,
  BarChart3,
  ArrowRight,
  HeartPulse,
  Video,
  Home,
  X,
} from "lucide-react";

// Custom Tooltip for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-800 text-xs">
        <p className="text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          {payload[0].value.toLocaleString()}
          <span className="text-[10px] text-slate-400 font-normal">records</span>
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const {
    aToken,
    currencySymbol,
    dashboardData,
    getDashboardData,
    backendUrl,
    appointments,
    allDoctorsAppointments,
  } = useContext(AdminContext);

  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showRecord, setShowRecord] = useState(false);
  const [recordType, setRecordType] = useState("");
  const [eduDashboardData, setEduDashboardData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Compute Home Care vs Doctor (Telehealth/Facility) counts
  const homeCareCount =
    dashboardData?.homeCareAppointments !== undefined
      ? dashboardData.homeCareAppointments
      : appointments && appointments.length > 0
      ? appointments.filter(
          (a) => a.type === "HomeCareTeam" || a.docData?.isHomeCareTeam === true
        ).length
      : 0;

  const doctorAppointmentsCount =
    dashboardData?.doctorAppointments !== undefined
      ? dashboardData.doctorAppointments
      : appointments && appointments.length > 0
      ? appointments.filter(
          (a) => a.type !== "HomeCareTeam" && !a.docData?.isHomeCareTeam
        ).length
      : Math.max(0, (dashboardData?.appointments || 0) - homeCareCount);

  // Chart data differentiating Doctor Appointments and Home Health Care
  const chartData = dashboardData
    ? [
        { name: "Doctors", count: dashboardData.doctors || 0 },
        { name: "Patients", count: dashboardData.users || 0 },
        { name: "Doctor Appts", count: doctorAppointmentsCount },
        { name: "Home Care", count: homeCareCount },
      ]
    : [];

  const handleShowRecord = (type) => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 250);
    setRecordType(type);
    setShowRecord(true);
  };

  const fetchEduDashboardData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/educator/admin-dashboard",
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        setEduDashboardData(data.dashboardData);
      }
    } catch (error) {
      console.error("Error fetching educator dashboard data:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        getDashboardData(),
        fetchEduDashboardData(),
        allDoctorsAppointments ? allDoctorsAppointments() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    if (aToken) {
      getDashboardData();
      fetchEduDashboardData();
      if (allDoctorsAppointments) {
        allDoctorsAppointments();
      }
    }
  }, [aToken]);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (!dashboardData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  // Growth percentage calculator for record modal
  const getGrowth = (current, previous) => {
    if (!previous || previous === 0) {
      return current > 0 ? "+100%" : "0%";
    }
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-7">
      {/* Embedded Modern Calendar Theme Styling */}
      <style>{`
        .custom-calendar.react-calendar {
          border: none;
          width: 100%;
          font-family: inherit;
          background: transparent;
        }
        .custom-calendar .react-calendar__navigation {
          margin-bottom: 0.5rem;
          height: 2.25rem;
        }
        .custom-calendar .react-calendar__navigation button {
          font-weight: 600;
          color: #1e293b;
          border-radius: 0.5rem;
          min-width: 32px;
          transition: all 0.15s ease;
        }
        .custom-calendar .react-calendar__navigation button:hover:enabled,
        .custom-calendar .react-calendar__navigation button:focus {
          background-color: #f1f5f9;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
          text-decoration: none;
        }
        .custom-calendar .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
        }
        .custom-calendar .react-calendar__tile {
          padding: 0.5rem 0.2rem;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: #334155;
          transition: all 0.15s ease;
        }
        .custom-calendar .react-calendar__tile:hover:enabled {
          background-color: #eef2ff;
          color: #5f6FFF;
        }
        .custom-calendar .react-calendar__tile--now {
          background: #f1f5f9;
          color: #5f6FFF;
          font-weight: 700;
        }
        .custom-calendar .react-calendar__tile--active {
          background: #5f6FFF !important;
          color: white !important;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(95, 111, 255, 0.35);
        }
      `}</style>

      {/* Top Welcome Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-white via-indigo-50/30 to-blue-50/40 p-5 md:p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              {getGreeting()}, Administrator
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              Live
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            System overview and real-time medical platform activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
            title="Refresh dashboard metrics"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-primary" : ""} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate("/add-doctor")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <PlusCircle size={15} />
            <span>Add Doctor</span>
          </button>

          <button
            onClick={() => navigate("/add-home-care-team")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Home size={14} className="text-teal-600" />
            <span>Add Home Care</span>
          </button>

          <button
            onClick={() => navigate("/all-appointment")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <CalendarIcon size={14} className="text-primary" />
            <span>Appointments</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards (Separating Doctor Consultations & Home Health Care) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {/* 1. Doctors Card */}
        <div
          onClick={() => navigate("/doctors-list")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Doctors
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Stethoscope size={20} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {dashboardData.doctors}
            </h3>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Practitioners</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 group-hover:underline">
                View all <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>

        {/* 2. Patients Card */}
        <div
          onClick={() => navigate("/patient-list")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Patients
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {dashboardData.users}
            </h3>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Registered Users</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 group-hover:underline">
                View all <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>

        {/* 3. Doctor Appointments (Telehealth / Facility Visit) */}
        <div
          onClick={() => handleShowRecord("appointments")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Doctor Appts
              </span>
              <span className="text-[10px] text-blue-600 font-medium">
                Telehealth / Clinic
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarIcon size={20} />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {doctorAppointmentsCount}
            </h3>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Consultations</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full group-hover:bg-blue-100 transition-colors">
                Report <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        </div>

        {/* 4. Home Health Care Appointments */}
        <div
          onClick={() => navigate("/home-care-teams-list")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Home Health Care
              </span>
              <span className="text-[10px] text-teal-600 font-medium">
                Home Visit Teams
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartPulse size={20} />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {homeCareCount}
            </h3>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Home Care Visits</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full group-hover:bg-teal-100 transition-colors">
                Teams <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>

        {/* 5. Total Earnings Card */}
        <div
          onClick={() => handleShowRecord("earnings")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg hover:border-violet-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight truncate">
              {currencySymbol}{Number(dashboardData.earning || 0).toLocaleString()}
            </h3>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Settled Payments</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full group-hover:bg-violet-100 transition-colors">
                Breakdown <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Schedule Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Analytics & Recent Activity (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Charts Container Card */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" />
                  <span>Platform Overview & Trends</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparative distribution of medical staff, patients, doctor consultations & home care visits
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                  <Activity size={12} className="text-emerald-500" />
                  Live Sync
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Resource Distribution
                  </h3>
                  <span className="text-[11px] text-slate-400">By category</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5f6FFF" stopOpacity={1} />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={42} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Trends Chart */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Trends Over Time
                  </h3>
                  <span className="text-[11px] text-slate-400">Activity curve</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#10B981"
                        strokeWidth={3}
                        fill="url(#areaGradient)"
                        dot={{ r: 5, fill: "#10B981", stroke: "#ffffff", strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: "#10B981" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Appointments Feed */}
          {dashboardData.latestAppointment && dashboardData.latestAppointment.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Recent Appointments</h3>
                    <p className="text-xs text-slate-400">Latest patient visits & home consultations</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/all-appointment")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {dashboardData.latestAppointment.map((item, idx) => {
                  const isHomeCare =
                    item.type === "HomeCareTeam" || item.docData?.isHomeCareTeam === true;
                  const isTelehealth =
                    item.type === "telemedicine" || item.type === "telehealth" || item.meetingUrl;

                  return (
                    <div
                      key={item._id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-slate-50/60 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          src={
                            item.userData?.image ||
                            "https://res.cloudinary.com/dyii5iyqq/image/upload/v1757340004/edoktor_fxnilb.jpg"
                          }
                          alt={item.userData?.name || "Patient"}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-slate-800">
                              {item.userData?.name || "Patient"}
                            </p>
                            {isHomeCare ? (
                              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                🏠 Home Care
                              </span>
                            ) : isTelehealth ? (
                              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                💻 Telehealth
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                🏥 Facility
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            With{" "}
                            <span className="font-medium text-slate-700">
                              {item.docData?.name || "Doctor"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                          <CalendarIcon size={12} className="text-slate-400" />
                          <span>{item.slotDate}</span>
                          <span className="text-slate-300">•</span>
                          <span>{item.slotTime}</span>
                        </div>

                        <span className="font-semibold text-slate-700">
                          {currencySymbol}
                          {item.amount}
                        </span>

                        {item.cancelled ? (
                          <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-red-50 text-red-600 border border-red-100">
                            Cancelled
                          </span>
                        ) : item.isCompleted ? (
                          <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                            Scheduled
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Schedule & Calendar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                  <CalendarIcon size={16} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Clinical Schedule</h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Interactive
              </span>
            </div>

            {/* Custom Styled Calendar Component */}
            <div className="flex justify-center p-1">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="custom-calendar"
              />
            </div>

            {/* Selected Date Card */}
            <div className="p-3.5 bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Selected Date
                </p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <button
                onClick={() => navigate("/all-appointment")}
                className="p-2 bg-white hover:bg-primary hover:text-white text-slate-600 rounded-lg border border-slate-200 shadow-xs transition-all"
                title="View appointments on this schedule"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Quick Platform Status Widget */}
          <div className="bg-gradient-to-br from-indigo-600 to-primary p-5 rounded-2xl text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Portal Health
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h4 className="font-bold text-base">eDokta System Active</h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              All clinical booking channels (Telehealth, Facility Visits, and Home Health Care Units) are online and operational.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-indigo-200">Database & APIs</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-300" /> Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Education Portal Overview (If present) */}
      {eduDashboardData && (
        <div className="space-y-5 pt-4 border-t border-slate-200">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              <span>Education Portal Overview</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Key metrics and student course enrollments for your academy platform
            </p>
          </div>

          {/* Educator Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {/* Total Students */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-slate-800">
                  {eduDashboardData.totalStudents}
                </h4>
                <p className="text-xs font-semibold text-slate-400">Total Students</p>
              </div>
            </div>

            {/* Total Courses */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <BookOpen size={22} />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-slate-800">
                  {eduDashboardData.totalCourses}
                </h4>
                <p className="text-xs font-semibold text-slate-400">Total Courses</p>
              </div>
            </div>

            {/* Active Enrollments */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp size={22} />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-slate-800">
                  {eduDashboardData.enrolledStudentsData?.length || 0}
                </h4>
                <p className="text-xs font-semibold text-slate-400">Active Enrollments</p>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <DollarSign size={22} />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-slate-800 truncate">
                  {currencySymbol}{eduDashboardData.totalEarnings?.toLocaleString() || 0}
                </h4>
                <p className="text-xs font-semibold text-slate-400">Total Earnings (Edu)</p>
              </div>
            </div>
          </div>

          {/* Latest Enrollments Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <List size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Latest Course Enrollments</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">#</th>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Course Title</th>
                    <th className="px-6 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {eduDashboardData.enrolledStudentsData?.length > 0 ? (
                    eduDashboardData.enrolledStudentsData.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3.5 text-xs text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                              src={
                                item.student?.image ||
                                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                              }
                              alt="Student"
                            />
                            <span className="font-semibold text-slate-800 text-sm">
                              {item.student?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-slate-600 text-xs font-medium">
                          {item.courseTitle}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-slate-400 text-xs">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : new Date().toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400 font-medium text-xs">
                        No enrollments found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Performance Modal Dialog */}
      {showRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
                  <BarChart3 size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {recordType === "earnings" ? "Revenue Performance" : "Appointments Performance"}
                </h3>
              </div>
              <button
                onClick={() => setShowRecord(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {(() => {
                const now = new Date();
                const currentMonthName = now.toLocaleString("default", { month: "long" });
                const currentYear = now.getFullYear();

                const prevDate = new Date();
                prevDate.setMonth(prevDate.getMonth() - 1);
                const prevMonthName = prevDate.toLocaleString("default", { month: "long" });
                const prevYear = prevDate.getFullYear();

                const prevVal =
                  recordType === "earnings"
                    ? dashboardData.monthlyEarnings?.previousMonth || 0
                    : dashboardData.completedAppointments?.previousMonth || 0;

                const currVal =
                  recordType === "earnings"
                    ? dashboardData.monthlyEarnings?.currentMonth || 0
                    : dashboardData.completedAppointments?.currentMonth || 0;

                const growthStr = getGrowth(currVal, prevVal);

                return (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Previous Month Card */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase">
                          {prevMonthName} {prevYear}
                        </span>
                        <p className="text-xl font-bold text-slate-700 mt-1">
                          {recordType === "earnings" ? `${currencySymbol}${Number(prevVal).toLocaleString()}` : `${prevVal} Completed`}
                        </p>
                      </div>

                      {/* Current Month Card */}
                      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100/70">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-indigo-600 uppercase">
                            {currentMonthName} {currentYear}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                            {growthStr}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-indigo-900 mt-1">
                          {recordType === "earnings" ? `${currencySymbol}${Number(currVal).toLocaleString()}` : `${currVal} Completed`}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      Comparing {currentMonthName} performance against {prevMonthName}. Growth is computed on completed and paid transactions.
                    </p>
                  </>
                );
              })()}
            </div>

            <button
              onClick={() => setShowRecord(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
