import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/doctorContext'
import axios from "axios";
import { toast } from "react-toastify";
import { useLoading } from '../../context/loadingContext';
import { Calendar, Clock, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

const DoctorProfile = () => {

  const { getProfileData, currencySymbol, docData, backendUrl, setDocData, dToken } = useContext(DoctorContext)
  const [image, setImage] = useState(false)
  const { setLoading } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const [disabledSlots, setDisabledSlots] = useState({});
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const states = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe"
  ];

  const standardTimeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM",
    "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
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

  const normalizeTime = (timeStr) => {
    if (!timeStr) return '';
    const clean = timeStr.trim().toUpperCase();
    if (clean.includes('AM') || clean.includes('PM')) {
      const isPM = clean.includes('PM');
      const parts = clean.replace(/AM|PM/g, '').trim().split(':');
      let h = parseInt(parts[0], 10);
      const m = parts[1] || '00';
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
      const hStr = h < 10 ? `0${h}` : `${h}`;
      return `${hStr}:${m}`;
    }
    const parts = clean.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    const hStr = h < 10 ? `0${h}` : `${h}`;
    return `${hStr}:${m}`;
  };

  const getTimeVariants = (timeStr) => {
    const normalized = normalizeTime(timeStr);
    if (!normalized) return [timeStr];
    const [hStr, mStr] = normalized.split(':');
    let h = parseInt(hStr, 10);
    const v24_padded = `${hStr}:${mStr}`;
    const v24_unpadded = `${h}:${mStr}`;
    const isPM = h >= 12;
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const h12Str = h12 < 10 ? `0${h12}` : `${h12}`;
    const ampm = isPM ? 'PM' : 'AM';
    const v12_1 = `${h12}:${mStr} ${ampm}`;
    const v12_2 = `${h12Str}:${mStr} ${ampm}`;
    return Array.from(new Set([timeStr, v24_padded, v24_unpadded, v12_1, v12_2]));
  };

  const upcomingDays = getNextSevenDays();

  useEffect(() => {
    if (docData) {
      setDisabledSlots(docData.disabled_slots || {});
    }
  }, [docData]);

  const toggleSlotDisabled = (dayObj, timeStr) => {
    if (!isEditing) return;
    const key1 = dayObj.keyHyphen;
    const key2 = dayObj.keyUnderscore;
    const variants = getTimeVariants(timeStr);

    setDisabledSlots(prev => {
      const next = { ...prev };
      const currentList1 = next[key1] || [];
      const currentList2 = next[key2] || [];

      const isAlreadyDisabled = variants.some(v => currentList1.includes(v) || currentList2.includes(v));

      if (isAlreadyDisabled) {
        next[key1] = currentList1.filter(t => !variants.includes(t) && normalizeTime(t) !== normalizeTime(timeStr));
        next[key2] = currentList2.filter(t => !variants.includes(t) && normalizeTime(t) !== normalizeTime(timeStr));
      } else {
        next[key1] = Array.from(new Set([...currentList1, ...variants]));
        next[key2] = Array.from(new Set([...currentList2, ...variants]));
      }
      return next;
    });
  };

  const disableAllForDay = (dayObj) => {
    if (!isEditing) return;
    const key1 = dayObj.keyHyphen;
    const key2 = dayObj.keyUnderscore;
    const allVariants = standardTimeSlots.flatMap(getTimeVariants);
    setDisabledSlots(prev => ({
      ...prev,
      [key1]: Array.from(new Set(allVariants)),
      [key2]: Array.from(new Set(allVariants))
    }));
  };

  const enableAllForDay = (dayObj) => {
    if (!isEditing) return;
    const key1 = dayObj.keyHyphen;
    const key2 = dayObj.keyUnderscore;
    setDisabledSlots(prev => ({
      ...prev,
      [key1]: [],
      [key2]: []
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); 

    const formData = new FormData();
    formData.append("docId", docData._id);
    formData.append("name", docData.name);
    formData.append("speciality", docData.speciality);
    formData.append("email", docData.email);
    formData.append("degree", docData.degree);
    formData.append("address", docData.address);
    formData.append("experience", docData.experience);
    formData.append("about", docData.about);
    formData.append("available", docData.available ? "true" : "false");
    formData.append("state", docData.state);
    formData.append("disabled_slots", JSON.stringify(disabledSlots));

    image && formData.append("image", image);

    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', formData, { headers: { dToken } })

      if (data.success) {
        toast.success(data.message)
        await getProfileData()
        setIsEditing(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  const selectedDay = upcomingDays[selectedDayIndex];

  return docData && (
    <div className="flex flex-col items-center mt-6 w-full max-w-4xl mx-auto px-4 pb-12">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 w-full space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Doctor Profile & Availability Settings</h2>

        {/* Profile Image */}
        {isEditing ? (
          <label htmlFor="image" className="cursor-pointer block">
            <div className="w-32 h-32 mx-auto relative group">
              <img
                src={image ? URL.createObjectURL(image) : docData.image} alt="Profile Preview"
                className="w-32 h-32 rounded-full border-4 border-primary object-cover shadow-md group-hover:opacity-80" />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Change Photo
              </div>
            </div>
            <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
          </label>
        ) : (
          <img src={docData.image} alt="Profile" className="w-32 h-32 mx-auto rounded-full border-4 border-primary object-cover shadow-md" />
        )}

        {/* Profile Form - Two Columns */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-700 font-semibold text-xs mb-1 block">Full Name</label>
            <input
              type="text"
              name="name"
              value={docData.name}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2.5 border rounded-xl text-sm focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-xs mb-1 block">Speciality</label>
            {isEditing ? (
              <select
                name="speciality"
                onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                value={docData.speciality}
                className="w-full p-2.5 border rounded-xl text-sm focus:border-primary bg-white"
                required
              >
                <option value="">Select Speciality</option>
                <option value="General physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Psychiatrists">Psychiatrists</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Cardiologists">Cardiologists</option>
                <option value="Anesthesiologists">Anesthesiologists</option>
                <option value="Family Physicians">Family Physicians</option>
              </select>
            ) : (
              <input
                type="text"
                name="speciality"
                value={docData.speciality}
                disabled
                className="w-full p-2.5 border rounded-xl text-sm"
              />
            )}
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-xs mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={docData.email}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2.5 border rounded-xl text-sm focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-xs mb-1 block">Degree / Credentials</label>
            <input
              type="text"
              name="degree"
              value={docData.degree}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2.5 border rounded-xl text-sm focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-xs mb-1 block">State / Region</label>
            {isEditing ? (
              <select
                name="state"
                onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                value={docData.state}
                className="w-full p-2.5 border rounded-xl text-sm focus:border-primary bg-white"
                required
              >
                <option value="" disabled>State</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="state"
                value={docData.state}
                disabled
                className="w-full p-2.5 border rounded-xl text-sm"
              />
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <input
              type="checkbox"
              name="available"
              id="available-check"
              checked={docData.available || false}
              onChange={(e) =>
                setDocData((prev) => ({ ...prev, available: e.target.checked }))
              }
              disabled={!isEditing}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="available-check" className="text-gray-800 font-bold text-sm cursor-pointer">
              General Availability (Accepting Bookings)
            </label>
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-xs mb-1 block">Facility / Practice Address</label>
            <textarea
              name="address"
              rows={2}
              value={docData.address}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2.5 border rounded-xl text-sm focus:border-primary"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold text-xs mb-1 block">Clinical Experience</label>
            {isEditing ? (
              <select
                name="experience"
                onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                value={docData.experience}
                className="w-full p-2.5 border rounded-xl text-sm focus:border-primary bg-white"
                required >
                <option value="">---Select Experience---</option>
                <option value="1-5 Years">1-5 Years </option>
                <option value="6-10 Years">6-10 Years</option>
                <option value="11-15 Years">11-15 Years</option>
                <option value="16-20 Years">16-20 Years</option>
                <option value="More than 20 Years">More than 20 Years</option>
              </select>
            ) : (
              <input
                type="text"
                name="experience"
                value={docData.experience}
                disabled
                className="w-full p-2.5 border rounded-xl text-sm"
              />
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-700 font-semibold text-xs mb-1 block">About Doctor / Biography</label>
            <textarea
              name="about"
              rows={3}
              value={docData.about}
              onChange={(e) => setDocData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              disabled={!isEditing}
              className="w-full p-2.5 border rounded-xl text-sm focus:border-primary"
            />
          </div>
        </form>

        {/* TIME SLOT AVAILABILITY CONFIGURATION PANEL */}
        <div className="p-6 bg-blue-50/70 border border-blue-100 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-base font-bold text-gray-900">Working Hours & Time Slot Availability</h3>
                <p className="text-xs text-gray-500">Configure time slots for Teleconsultation & Facility Visits (All slots available by default)</p>
              </div>
            </div>
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => enableAllForDay(selectedDay)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                >
                  Enable All
                </button>
                <button
                  type="button"
                  onClick={() => disableAllForDay(selectedDay)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Disable All
                </button>
              </div>
            )}
          </div>

          {/* Date Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-blue-100">
            {upcomingDays.map((dayObj, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDayIndex === idx
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-blue-100/50 border border-blue-100'
                }`}
              >
                {dayObj.displayStr}
              </button>
            ))}
          </div>

          {/* Time Slot Chips Grid */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">
              Time Slots for <span className="text-primary font-bold">{selectedDay.displayStr}</span>:
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {standardTimeSlots.map((timeStr, idx) => {
                const targetNorm = normalizeTime(timeStr);
                const disabledList = [
                  ...(disabledSlots[selectedDay.keyHyphen] || []),
                  ...(disabledSlots[selectedDay.keyUnderscore] || [])
                ];
                const isDisabled = disabledList.some(item => normalizeTime(item) === targetNorm || item === timeStr);

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => toggleSlotDisabled(selectedDay, timeStr)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border text-center ${
                      isDisabled
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        : 'bg-white text-gray-800 border-green-300 hover:border-green-500 shadow-sm'
                    } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {timeStr}
                    <span className="block text-[9px] font-normal mt-0.5">
                      {isDisabled ? '❌ Disabled' : '✅ Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          {isEditing ? (
            <div className="flex items-center gap-3 w-full justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-semibold hover:bg-green-700 shadow-md transition-all"
                onClick={handleSubmit}
              >
                Save Schedule & Profile
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-md transition-all"
            >
              Edit Profile & Slot Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile
