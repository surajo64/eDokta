import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/adminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { HeartPulse, Stethoscope, User, MapPin, CheckCircle2, XCircle, ShieldCheck, Edit3, X, Upload, Save, Clock } from 'lucide-react';

const HomeCareTeamsList = () => {
  const { backendUrl, aToken, doctors, getAllDoctors } = useContext(AdminContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingTeam, setEditingTeam] = useState(null);
  const [editImg, setEditImg] = useState(false);
  const [editTeamName, setEditTeamName] = useState('');
  const [editSpeciality, setEditSpeciality] = useState('General Service');
  const [editDoctorId, setEditDoctorId] = useState('');
  const [editDoctorName, setEditDoctorName] = useState('');
  const [editDoctorTitle, setEditDoctorTitle] = useState('');
  const [editNurseName, setEditNurseName] = useState('');
  const [editNurseTitle, setEditNurseTitle] = useState('');
  const [editAssistantName, setEditAssistantName] = useState('');
  const [editAssistantTitle, setEditAssistantTitle] = useState('');
  const [editFees, setEditFees] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAbout, setEditAbout] = useState('');
  const [editServicesIncluded, setEditServicesIncluded] = useState('');
  const [editDisabledSlots, setEditDisabledSlots] = useState({});
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const teamTimeSlots = [
    "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"
  ];

  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      const yearNum = d.getFullYear();
      const keyHyphen = `${dayNum}-${monthNum}-${yearNum}`;
      const keyUnderscore = `${dayNum}_${monthNum}_${yearNum}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const displayStr = `${dayName} ${dayNum}`;
      days.push({ keyHyphen, keyUnderscore, displayStr, dateObj: d });
    }
    return days;
  };

  const upcomingDays = getNextSevenDays();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/home-care-teams`, {
        headers: { aToken }
      });
      if (data.success) {
        setTeams(data.teams);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (teamId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-team-availability`,
        { teamId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchTeams();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchTeams();
      if (getAllDoctors) getAllDoctors();
    }
  }, [aToken]);

  const openEditModal = (team) => {
    setEditingTeam(team);
    setEditImg(false);
    setEditTeamName(team.teamName || '');
    setEditSpeciality(team.speciality || 'General Service');
    setEditDoctorId(team.doctorId || '');
    setEditDoctorName(team.doctorName || '');
    setEditDoctorTitle(team.doctorTitle || '');
    setEditNurseName(team.nurseName || '');
    setEditNurseTitle(team.nurseTitle || '');
    setEditAssistantName(team.assistantName || '');
    setEditAssistantTitle(team.assistantTitle || '');
    setEditFees(team.fees || '');
    setEditLocation(team.location || '');
    setEditAbout(team.about || '');
    setEditServicesIncluded(
      Array.isArray(team.servicesIncluded) ? team.servicesIncluded.join(', ') : (team.servicesIncluded || '')
    );
    setEditDisabledSlots(team.disabled_slots || {});
  };

  const toggleTeamSlotDisabled = (dayObj, timeStr) => {
    const key1 = dayObj.keyHyphen;
    const key2 = dayObj.keyUnderscore;

    setEditDisabledSlots(prev => {
      const next = { ...prev };
      const currentList1 = next[key1] || [];
      const currentList2 = next[key2] || [];
      const isAlreadyDisabled = currentList1.includes(timeStr) || currentList2.includes(timeStr);

      if (isAlreadyDisabled) {
        next[key1] = currentList1.filter(t => t !== timeStr);
        next[key2] = currentList2.filter(t => t !== timeStr);
      } else {
        next[key1] = [...currentList1, timeStr];
        next[key2] = [...currentList2, timeStr];
      }
      return next;
    });
  };

  const handleEditDoctorSelect = (docId) => {
    setEditDoctorId(docId);
    if (!docId) return;
    const doc = doctors.find(d => d._id === docId);
    if (doc) {
      setEditDoctorName(doc.name);
      setEditDoctorTitle(`${doc.degree || 'MBBS'} (${doc.speciality})`);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingTeam) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('teamId', editingTeam._id);
      formData.append('teamName', editTeamName);
      formData.append('speciality', editSpeciality);
      formData.append('doctorId', editDoctorId);
      formData.append('doctorName', editDoctorName);
      formData.append('doctorTitle', editDoctorTitle);
      formData.append('nurseName', editNurseName);
      formData.append('nurseTitle', editNurseTitle);
      formData.append('assistantName', editAssistantName);
      formData.append('assistantTitle', editAssistantTitle);
      formData.append('fees', editFees);
      formData.append('location', editLocation);
      formData.append('about', editAbout);
      formData.append('servicesIncluded', editServicesIncluded);
      formData.append('disabled_slots', JSON.stringify(editDisabledSlots));

      if (editImg) {
        formData.append('image', editImg);
      }

      const { data } = await axios.post(`${backendUrl}/api/admin/update-home-care-team`, formData, {
        headers: { aToken }
      });

      if (data.success) {
        toast.success(data.message);
        setEditingTeam(null);
        fetchTeams();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedDay = upcomingDays[selectedDayIndex];

  return (
    <div className="m-5 w-full max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Home Healthcare Teams</h1>
            <p className="text-xs text-gray-500">Manage registered home visit medical teams, edit details, and toggle availability</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-primary border border-blue-200">
          Total Teams: {teams.length}
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading home care teams...</div>
      ) : teams.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
          <HeartPulse className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">No Home Healthcare Teams Found</p>
          <p className="text-xs text-gray-500 mt-1">Click "Add Home Care Team" in the sidebar to register a team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-blue-50 overflow-hidden">
                <img src={team.image} alt={team.teamName} className="w-full h-full object-cover" />
                
                {/* Availability Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${team.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={team.available ? 'text-green-700' : 'text-red-600'}>
                    {team.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Edit Button Header Overlay */}
                <button
                  onClick={() => openEditModal(team)}
                  className="absolute top-3 left-3 bg-white/90 hover:bg-white text-primary p-2 rounded-full shadow-md transition-transform hover:scale-105"
                  title="Edit Team"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-2">
                      {team.speciality}
                    </span>
                    <button
                      onClick={() => openEditModal(team)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Team</span>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{team.teamName}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{team.location}</span>
                  </p>
                </div>

                {/* 3 Members breakdown */}
                <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-700">
                  <p className="font-semibold text-gray-900 text-[11px] uppercase tracking-wider border-b border-gray-200 pb-1 mb-1">
                    Team Composition:
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <span>🩺</span> <strong className="text-gray-900 font-medium">Doctor:</strong> {team.doctorName}
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <span>👩‍⚕️</span> <strong className="text-gray-900 font-medium">Nurse:</strong> {team.nurseName}
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <span>🧑‍⚕️</span> <strong className="text-gray-900 font-medium">Assistant:</strong> {team.assistantName}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Home Visit Fee</p>
                    <p className="text-base font-extrabold text-gray-900">₦{team.fees?.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAvailability(team._id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                        team.available
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {team.available ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{team.available ? 'Disable' : 'Enable'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT TEAM MODAL */}
      {editingTeam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">Edit Home Healthcare Team</h2>
              </div>
              <button
                onClick={() => setEditingTeam(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              {/* IMAGE EDIT */}
              <div className="flex items-center gap-4">
                <label htmlFor="edit-team-img" className="cursor-pointer group relative">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-dashed border-primary/40 flex flex-col items-center justify-center text-primary overflow-hidden group-hover:border-primary">
                    {editImg ? (
                      <img src={URL.createObjectURL(editImg)} alt="New preview" className="w-full h-full object-cover" />
                    ) : (
                      <img src={editingTeam.image} alt="Current" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <input onChange={(e) => setEditImg(e.target.files[0])} type="file" id="edit-team-img" hidden accept="image/*" />
                </label>
                <div>
                  <p className="text-xs font-bold text-gray-800">Change Team Photo</p>
                  <p className="text-[11px] text-gray-500">Click preview box to upload new photo</p>
                </div>
              </div>

              {/* TEAM NAME & SPECIALITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={editTeamName}
                    onChange={(e) => setEditTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Speciality / Service Type</label>
                  <select
                    value={editSpeciality}
                    onChange={(e) => setEditSpeciality(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary bg-white"
                  >
                    <option value="General Service">General Service</option>
                    <option value="Cardiology Service">Cardiology Service</option>
                    <option value="Pediatric & Maternal Care">Pediatric & Maternal Care</option>
                    <option value="Post-Op Recovery & Wound Care">Post-Op Recovery & Wound Care</option>
                    <option value="Elderly & Palliative Care">Elderly & Palliative Care</option>
                    <option value="Physiotherapy & Rehab">Physiotherapy & Rehab</option>
                  </select>
                </div>
              </div>

              {/* 3 MEMBERS EDIT */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-3">
                <p className="text-xs font-bold uppercase text-primary tracking-wider">Team Composition</p>

                {/* Doctor Selection */}
                <div className="bg-white p-3 rounded-xl border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-800 mb-1">1. Select Lead Medical Doctor</label>
                  <select
                    value={editDoctorId}
                    onChange={(e) => handleEditDoctorSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium bg-white mb-2"
                  >
                    <option value="">-- Choose Registered Doctor --</option>
                    {doctors && doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} - {doc.speciality} ({doc.degree})
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Doctor Name"
                      value={editDoctorName}
                      onChange={(e) => setEditDoctorName(e.target.value)}
                      className="px-3 py-1.5 rounded border text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Doctor Title"
                      value={editDoctorTitle}
                      onChange={(e) => setEditDoctorTitle(e.target.value)}
                      className="px-3 py-1.5 rounded border text-xs"
                    />
                  </div>
                </div>

                {/* Nurse */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">2. Nurse Name</label>
                    <input
                      type="text"
                      required
                      value={editNurseName}
                      onChange={(e) => setEditNurseName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nurse Title</label>
                    <input
                      type="text"
                      value={editNurseTitle}
                      onChange={(e) => setEditNurseTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border text-xs"
                    />
                  </div>
                </div>

                {/* Assistant */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">3. Clinical Assistant</label>
                    <input
                      type="text"
                      required
                      value={editAssistantName}
                      onChange={(e) => setEditAssistantName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Assistant Title</label>
                    <input
                      type="text"
                      value={editAssistantTitle}
                      onChange={(e) => setEditAssistantTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* TEAM TIME SLOT AVAILABILITY PANEL */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Manage Team Home Visit Slots</h4>
                    <p className="text-[11px] text-gray-500">Toggle time slots available for home visits (All slots available by default)</p>
                  </div>
                </div>

                {/* Days Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {upcomingDays.map((dayObj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                        selectedDayIndex === idx
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      {dayObj.displayStr}
                    </button>
                  ))}
                </div>

                {/* Slot Chips */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {teamTimeSlots.map((timeStr, idx) => {
                    const isDisabled = (
                      editDisabledSlots[selectedDay.keyHyphen]?.includes(timeStr) ||
                      editDisabledSlots[selectedDay.keyUnderscore]?.includes(timeStr)
                    );

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleTeamSlotDisabled(selectedDay, timeStr)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all border text-center ${
                          isDisabled
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-white text-gray-800 border-green-300 hover:border-green-500'
                        }`}
                      >
                        {timeStr}
                        <span className="block text-[9px] font-normal">
                          {isDisabled ? 'Disabled' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FEES & LOCATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Home Visit Fee (₦)</label>
                  <input
                    type="number"
                    required
                    value={editFees}
                    onChange={(e) => setEditFees(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location Coverage</label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>

              {/* SERVICES INCLUDED */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Services Included (Comma separated)</label>
                <input
                  type="text"
                  value={editServicesIncluded}
                  onChange={(e) => setEditServicesIncluded(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              {/* ABOUT */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Overview</label>
                <textarea
                  rows={3}
                  required
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                ></textarea>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeCareTeamsList;
