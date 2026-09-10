import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  HeartPulse, 
  ArrowLeft,
  ArrowRight,
  Stethoscope
} from 'lucide-react';

const BookHomeTeam = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token, userData } = useContext(AppContext);

  const [team, setTeam] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const fetchTeamDetails = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/home-care-team/${teamId}`);
      if (data.success && data.team) {
        setTeam(data.team);
      } else {
        // Fallback team info if ID is mock/default
        setTeam({
          _id: teamId,
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
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAvailableSlots = () => {
    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(20, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDateHyphen = `${day}-${month}-${year}`;
        const slotDateUnderscore = `${day}_${month}_${year}`;

        const isBooked = (
          (team?.slots_booked?.[slotDateHyphen]?.includes(formattedTime)) ||
          (team?.slots_booked?.[slotDateUnderscore]?.includes(formattedTime))
        );

        const isDisabled = (
          (team?.disabled_slots?.[slotDateHyphen]?.includes(formattedTime)) ||
          (team?.disabled_slots?.[slotDateUnderscore]?.includes(formattedTime))
        );

        const isSlotAvailable = !isBooked && !isDisabled;

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
          available: isSlotAvailable
        });
        currentDate.setMinutes(currentDate.getMinutes() + 120);
      }

      setDocSlots(prev => ([...prev, timeSlots]));
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  useEffect(() => {
    if (team) {
      getAvailableSlots();
    }
  }, [team]);

  useEffect(() => {
    if (userData) {
      if (userData.address?.line1) setAddress(userData.address.line1);
      if (userData.phone) setPhone(userData.phone);
    }
  }, [userData]);

  const bookTeamVisit = async () => {
    if (!token) {
      toast.warning('Please login to book a Home Healthcare Team visit');
      return navigate('/login');
    }

    if (!slotTime) {
      return toast.error('Please select a visit time slot');
    }

    if (!address) {
      return toast.error('Please enter your home address for the team visit');
    }

    try {
      setSubmitting(true);
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-home-care-team`,
        {
          teamId,
          slotDate,
          slotTime,
          address,
          phone,
          notes
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate('/my-appointment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!team) {
    return <div className="p-12 text-center text-gray-500">Loading team details...</div>;
  }

  return (
    <div className="min-h-screen text-gray-800 pb-16 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/digital-clinic/home-healthcare')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home Healthcare Teams</span>
      </button>

      {/* TEAM OVERVIEW HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-center">
        <img
          src={team.image}
          alt={team.teamName}
          className="w-full md:w-64 h-52 object-cover rounded-2xl bg-blue-50"
        />
        <div className="flex-1 space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            {team.speciality}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            {team.teamName}
          </h1>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{team.location}</span>
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {team.about}
          </p>
          <div className="pt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Home Visit Fee:</span>
            <span className="text-2xl font-extrabold text-gray-900">₦{team.fees?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* TEAM MEMBERS COMPOSITION BOX */}
      <div className="bg-blue-50/70 p-6 rounded-3xl border border-blue-100 mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span>Visiting Medical Team Members (3 Professionals)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
            <span className="text-2xl mb-1 block">🩺</span>
            <p className="text-xs text-primary font-bold uppercase tracking-wider">Lead Doctor</p>
            <p className="font-extrabold text-gray-900 text-sm mt-0.5">{team.doctorName}</p>
            <p className="text-xs text-gray-500">{team.doctorTitle || 'Consultant Physician'}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
            <span className="text-2xl mb-1 block">👩‍⚕️</span>
            <p className="text-xs text-primary font-bold uppercase tracking-wider">Registered Nurse</p>
            <p className="font-extrabold text-gray-900 text-sm mt-0.5">{team.nurseName}</p>
            <p className="text-xs text-gray-500">{team.nurseTitle || 'Senior Nurse'}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
            <span className="text-2xl mb-1 block">🧑‍⚕️</span>
            <p className="text-xs text-primary font-bold uppercase tracking-wider">Clinical Assistant</p>
            <p className="font-extrabold text-gray-900 text-sm mt-0.5">{team.assistantName}</p>
            <p className="text-xs text-gray-500">{team.assistantTitle || 'Clinical Assistant'}</p>
          </div>
        </div>
      </div>

      {/* BOOKING FORM */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span>Schedule Your Home Healthcare Visit</span>
        </h2>

        {/* DATE SELECTION */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Select Visit Date</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {docSlots.length > 0 && docSlots.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-3 px-4 rounded-2xl min-w-[70px] cursor-pointer transition-all ${
                  slotIndex === index
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'border border-gray-200 text-gray-700 hover:border-primary'
                }`}
              >
                <p className="text-xs font-bold">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p className="text-lg font-extrabold">{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TIME SLOT SELECTION */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Select Arrival Time Slot</label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
              <button
                key={index}
                type="button"
                disabled={!item.available}
                onClick={() => item.available && setSlotTime(item.time)}
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
                  !item.available
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 line-through cursor-not-allowed opacity-60'
                    : item.time === slotTime
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-700 bg-white border border-gray-200 hover:border-primary cursor-pointer'
                }`}
              >
                {item.time.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* HOME ADDRESS & CONTACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Home Address for Visit</label>
            <input
              type="text"
              required
              placeholder="Full Street Address, House No, Estate & Area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Phone Number</label>
            <input
              type="text"
              required
              placeholder="e.g. 08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* MEDICAL NOTES */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Patient Symptoms / Special Instructions</label>
          <textarea
            rows={3}
            placeholder="Describe health concerns or special directions for the visiting medical team..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
          ></textarea>
        </div>

        {/* CONFIRM BUTTON */}
        <div className="pt-4">
          <button
            onClick={bookTeamVisit}
            disabled={submitting}
            className="w-full sm:w-auto bg-primary hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>{submitting ? 'Confirming Visit...' : 'Confirm & Book Home Healthcare Team'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookHomeTeam;
