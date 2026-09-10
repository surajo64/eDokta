import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { 
  Home, 
  UserCheck, 
  Stethoscope, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  HeartPulse, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  Activity,
  Users
} from 'lucide-react';

const defaultTeams = [
  {
    _id: "default-1",
    teamName: "General Home Care Team Alpha",
    speciality: "General Service",
    doctorName: "Dr. Abubakar Shehu",
    doctorTitle: "Consultant Physician (Lead)",
    nurseName: "Nurse Grace Danjuma",
    nurseTitle: "Senior Registered Nurse",
    assistantName: "Usman Bello",
    assistantTitle: "Clinical Assistant & Phlebotomist",
    fees: 45000,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
    about: "Complete general medical home evaluation, vitals screening, IV fluid administration, and basic lab sample collection at your doorstep.",
    location: "Abuja Metropolitan & Environs",
    servicesIncluded: ["Full Physical Examination", "Blood Pressure & Vitals Audit", "Blood Sample Collection", "IV Therapy & Medication"],
    available: true
  },
  {
    _id: "default-2",
    teamName: "Cardiology Home Care Unit 1",
    speciality: "Cardiology Service",
    doctorName: "Dr. Farida Aliyu",
    doctorTitle: "Consultant Cardiologist (Lead)",
    nurseName: "Nurse Samuel Kalu",
    nurseTitle: "ICU / Cardiac Care Nurse",
    assistantName: "Fatima Umar",
    assistantTitle: "ECG Technician & Caregiver",
    fees: 65000,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
    about: "Specialized cardiac home monitoring team equipped with portable ECG/EKG machines, blood pressure telemetry, and heart failure care management.",
    location: "Abuja, Ikeja & Environs",
    servicesIncluded: ["Portable 12-Lead ECG/EKG", "Cardiovascular Vitals Monitoring", "Cardiac Medication Audit", "Doctor & Nurse Joint Assessment"],
    available: true
  },
  {
    _id: "default-3",
    teamName: "Maternal & Child Home Care Team",
    speciality: "Pediatric & Maternal Care",
    doctorName: "Dr. Zainab Ahmed",
    doctorTitle: "Consultant Obstetrician & Pediatrician",
    nurseName: "Nurse Maryam Mustapha",
    nurseTitle: "Certified Midwife & Newborn Specialist",
    assistantName: "Aminu Sani",
    assistantTitle: "Pediatric Assistant",
    fees: 55000,
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
    about: "Comprehensive post-natal mother and newborn care visits, infant immunization guidance, growth tracking, and maternal recovery assessments.",
    location: "Abuja & Surrounding Districts",
    servicesIncluded: ["Newborn Vital Screening", "Post-Natal Maternal Checkup", "Infant Jaundice & Growth Check", "Lactation & Nutrition Guidance"],
    available: true
  }
];

const HomeHealthcare = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [teams, setTeams] = useState(defaultTeams);
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');
  const [loading, setLoading] = useState(false);

  const specialities = [
    'All',
    'General Service',
    'Cardiology Service',
    'Pediatric & Maternal Care',
    'Post-Op Recovery & Wound Care',
    'Elderly & Palliative Care',
    'Physiotherapy & Rehab'
  ];

  const fetchHomeCareTeams = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/home-care-teams`);
      if (data.success && data.teams && data.teams.length > 0) {
        setTeams(data.teams);
      }
    } catch (error) {
      console.log("Using initial home care teams list:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeCareTeams();
  }, []);

  const filteredTeams = selectedSpeciality === 'All'
    ? teams
    : teams.filter(t => t.speciality?.toLowerCase().includes(selectedSpeciality.toLowerCase()));

  return (
    <div className="min-h-screen text-gray-800 pb-16">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-12 mb-12 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-200 border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Multi-Disciplinary Medical Teams</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Book a <span className="text-blue-300">Complete Medical Team</span> to Visit You at Home
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl leading-relaxed">
              Every home visit team includes a <strong>Medical Doctor</strong> (Lead Clinician), <strong>Registered Nurse</strong>, and <strong>Clinical Assistant</strong> working together at your doorstep to deliver comprehensive healthcare.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#teams-section"
                className="bg-primary hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full flex items-center gap-3 shadow-lg transition-all"
              >
                <span>Explore Home Care Teams</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-4 w-full pt-6 border-t border-white/10 mt-2">
              <div>
                <p className="text-2xl font-extrabold text-white">3-in-1</p>
                <p className="text-xs text-blue-200 font-medium">Doctor + Nurse + Assistant</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-blue-200 font-medium">Verified Medical Personnel</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">Doorstep</p>
                <p className="text-xs text-blue-200 font-medium">Full Clinical Examination</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-yellow-300">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">What a Team Visit Includes</h3>
                  <p className="text-xs text-blue-200">Integrated home healthcare care plan</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-blue-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span><strong>Medical Doctor:</strong> Diagnosis, prescription & clinical plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span><strong>Registered Nurse:</strong> Medication admin & vital sign monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span><strong>Clinical Assistant:</strong> Blood sample collection & vitals check</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span><strong>Portable Diagnostics:</strong> ECG, Glucose, Blood Pressure telemetry</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALTY FILTER PILLS */}
      <section id="teams-section" className="mb-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Home Healthcare Units</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Select a Medical Team by Specialty
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Choose the specialized home healthcare team that fits your medical needs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10">
          {specialities.map((spec, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSpeciality(spec)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                selectedSpeciality === spec
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* TEAMS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeams.map((team, idx) => (
            <div
              key={team._id || idx}
              className="bg-white border border-blue-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Status Badge */}
              <div className="relative h-56 bg-blue-50 overflow-hidden">
                <img
                  src={team.image}
                  alt={team.teamName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${team.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={team.available ? 'text-green-700' : 'text-red-600'}>
                    {team.available ? 'Available for Booking' : 'Fully Booked'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-md">
                  {team.speciality}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                    {team.teamName}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{team.location || "Abuja Metropolitan & Environs"}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-3 leading-relaxed line-clamp-2">
                    {team.about}
                  </p>
                </div>

                {/* 3 TEAM MEMBERS Composition Breakdown */}
                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-2 text-xs">
                  <p className="font-bold text-primary text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Visiting Medical Team (3 Members):</span>
                  </p>
                  
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-blue-50">
                    <span className="text-base">🩺</span>
                    <div>
                      <p className="font-bold text-gray-900">{team.doctorName}</p>
                      <p className="text-[10px] text-gray-500">{team.doctorTitle || 'Medical Doctor (Lead)'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-blue-50">
                    <span className="text-base">👩‍⚕️</span>
                    <div>
                      <p className="font-bold text-gray-900">{team.nurseName}</p>
                      <p className="text-[10px] text-gray-500">{team.nurseTitle || 'Registered Nurse'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-blue-50">
                    <span className="text-base">🧑‍⚕️</span>
                    <div>
                      <p className="font-bold text-gray-900">{team.assistantName}</p>
                      <p className="text-[10px] text-gray-500">{team.assistantTitle || 'Clinical Assistant'}</p>
                    </div>
                  </div>
                </div>

                {/* SERVICES TAGS */}
                {team.servicesIncluded && team.servicesIncluded.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {team.servicesIncluded.slice(0, 3).map((srv, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-medium">
                        ✓ {srv}
                      </span>
                    ))}
                  </div>
                )}

                {/* FOOTER & BOOK BUTTON */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Home Visit Fee</p>
                    <p className="text-xl font-extrabold text-gray-900">₦{team.fees?.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (team.available) {
                        navigate(`/book-home-team/${team._id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={!team.available}
                    className={`py-3 px-5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                      team.available
                        ? 'bg-primary hover:bg-indigo-700 text-white shadow-primary/25 hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Book Home Visit Team</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeHealthcare;
