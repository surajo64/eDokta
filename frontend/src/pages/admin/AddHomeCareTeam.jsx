import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../context/adminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserPlus, ShieldCheck, HeartPulse, Stethoscope, Upload, DollarSign, MapPin, FileText, CheckCircle2, User } from 'lucide-react';

const AddHomeCareTeam = () => {
  const { backendUrl, aToken, doctors, getAllDoctors } = useContext(AdminContext);

  const [teamImg, setTeamImg] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [speciality, setSpeciality] = useState('General Service');
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorTitle, setDoctorTitle] = useState('Consultant Physician (Lead)');
  const [nurseName, setNurseName] = useState('');
  const [nurseTitle, setNurseTitle] = useState('Senior Registered Nurse');
  const [assistantName, setAssistantName] = useState('');
  const [assistantTitle, setAssistantTitle] = useState('Clinical Assistant & Phlebotomist');
  const [fees, setFees] = useState('');
  const [location, setLocation] = useState('Abuja Metropolitan & Environs');
  const [about, setAbout] = useState('');
  const [servicesIncluded, setServicesIncluded] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aToken && getAllDoctors) {
      getAllDoctors();
    }
  }, [aToken]);

  const handleDoctorSelect = (selectedId) => {
    setDoctorId(selectedId);
    if (!selectedId) return;

    const selectedDoc = doctors.find(doc => doc._id === selectedId);
    if (selectedDoc) {
      setDoctorName(selectedDoc.name);
      setDoctorTitle(`${selectedDoc.degree || 'MBBS'} (${selectedDoc.speciality})`);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!teamImg) {
      return toast.error("Please select a Home Healthcare Team image/photo");
    }

    if (!doctorName) {
      return toast.error("Please select a Lead Medical Doctor");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', teamImg);
      formData.append('teamName', teamName);
      formData.append('speciality', speciality);
      formData.append('doctorId', doctorId);
      formData.append('doctorName', doctorName);
      formData.append('doctorTitle', doctorTitle);
      formData.append('nurseName', nurseName);
      formData.append('nurseTitle', nurseTitle);
      formData.append('assistantName', assistantName);
      formData.append('assistantTitle', assistantTitle);
      formData.append('fees', fees);
      formData.append('location', location);
      formData.append('about', about);
      formData.append('servicesIncluded', servicesIncluded);

      const { data } = await axios.post(`${backendUrl}/api/admin/add-home-care-team`, formData, {
        headers: { aToken }
      });

      if (data.success) {
        toast.success(data.message);
        setTeamImg(false);
        setTeamName('');
        setDoctorId('');
        setDoctorName('');
        setNurseName('');
        setAssistantName('');
        setFees('');
        setAbout('');
        setServicesIncluded('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register Home Healthcare Team</h1>
          <p className="text-xs text-gray-500">Create a 3-member medical team (Doctor, Nurse, Assistant) for home visits</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        {/* IMAGE UPLOAD */}
        <div className="flex items-center gap-4">
          <label htmlFor="team-img" className="cursor-pointer group relative">
            <div className="w-24 h-24 rounded-2xl bg-blue-50 border-2 border-dashed border-primary/40 flex flex-col items-center justify-center text-primary overflow-hidden group-hover:border-primary transition-all">
              {teamImg ? (
                <img src={URL.createObjectURL(teamImg)} alt="Team preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-7 h-7 mb-1" />
                  <span className="text-[10px] font-semibold">Upload Photo</span>
                </>
              )}
            </div>
            <input onChange={(e) => setTeamImg(e.target.files[0])} type="file" id="team-img" hidden accept="image/*" />
          </label>
          <div>
            <p className="text-sm font-semibold text-gray-800">Team Photo / Picture</p>
            <p className="text-xs text-gray-500">Upload a professional photo representing the healthcare team</p>
          </div>
        </div>

        {/* BASIC TEAM INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Team Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Cardiology Home Care Unit 1"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Speciality / Service Type</label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary bg-white"
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

        {/* 3 TEAM MEMBERS Composition */}
        <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4" />
            <span>Team Composition (3 Professionals)</span>
          </h3>

          {/* Member 1: Doctor Selection Dropdown */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1 flex items-center justify-between">
                <span>1. Select Lead Medical Doctor (From Registered Doctors List)</span>
                <span className="text-[10px] text-primary font-normal">Linked to Doctor Portal</span>
              </label>
              <select
                value={doctorId}
                onChange={(e) => handleDoctorSelect(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-xs font-medium focus:border-primary bg-white text-gray-900"
              >
                <option value="">-- Choose Lead Doctor --</option>
                {doctors && doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.speciality} ({doc.degree})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-gray-100">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Doctor Name (Selected/Display)</label>
                <input
                  type="text"
                  required
                  placeholder="Doctor Name"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Doctor Title & Specialty Role</label>
                <input
                  type="text"
                  placeholder="e.g. Consultant Physician (Lead)"
                  value={doctorTitle}
                  onChange={(e) => setDoctorTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Member 2: Nurse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">2. Registered Nurse</label>
              <input
                type="text"
                required
                placeholder="Nurse Full Name (e.g. Nurse Grace Danjuma)"
                value={nurseName}
                onChange={(e) => setNurseName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nurse Title & Role</label>
              <input
                type="text"
                placeholder="e.g. Senior Registered Nurse"
                value={nurseTitle}
                onChange={(e) => setNurseTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-primary"
              />
            </div>
          </div>

          {/* Member 3: Clinical Assistant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">3. Clinical Assistant</label>
              <input
                type="text"
                required
                placeholder="Assistant Full Name (e.g. Usman Bello)"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Assistant Title & Role</label>
              <input
                type="text"
                placeholder="e.g. Clinical Assistant & Phlebotomist"
                value={assistantTitle}
                onChange={(e) => setAssistantTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* FEES & LOCATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Home Visit Fee (NGN ₦)</label>
            <input
              type="number"
              required
              placeholder="e.g. 45000"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Coverage Area / Location</label>
            <input
              type="text"
              required
              placeholder="e.g. Abuja Metropolitan & Environs"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* SERVICES INCLUDED */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Services Included (Comma separated)</label>
          <input
            type="text"
            placeholder="e.g. Full Physical Exam, Blood Pressure Audit, Blood Sample Collection, IV Therapy"
            value={servicesIncluded}
            onChange={(e) => setServicesIncluded(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Team Overview / Description</label>
          <textarea
            required
            rows={3}
            placeholder="Describe what the medical team delivers during home visits..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
          ></textarea>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>{loading ? 'Registering Team...' : 'Register Home Healthcare Team'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddHomeCareTeam;
