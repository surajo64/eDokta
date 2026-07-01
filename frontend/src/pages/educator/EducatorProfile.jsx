import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoading } from '../../context/loadingContext';
import { User, Phone, Mail, Award, Calendar, Home, FileText, Edit2, Camera } from 'lucide-react';

const EducatorProfile = () => {
  const { adminData, atoken, backendUrl, adminProfile } = useContext(AppContext);
  const { setLoading } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  
  // Local form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
    nin: '',
    about: '',
  });

  // Load profile data into form state
  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name || '',
        phone: adminData.phone || '',
        email: adminData.email || '',
        gender: adminData.gender || '',
        dob: adminData.dob ? adminData.dob.substring(0, 10) : '',
        address: adminData.address || '',
        nin: adminData.nin || '',
        about: adminData.about || '',
      });
    }
  }, [adminData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateForm = new FormData();
    updateForm.append('name', formData.name);
    updateForm.append('phone', formData.phone);
    updateForm.append('email', formData.email);
    updateForm.append('gender', formData.gender);
    updateForm.append('dob', formData.dob);
    updateForm.append('address', formData.address);
    updateForm.append('nin', formData.nin);
    updateForm.append('about', formData.about);
    updateForm.append('role', adminData.role || 'educator');

    if (image) {
      updateForm.append('image', image);
    }

    try {
      const { data } = await axios.put(`${backendUrl}/api/educator/update-profile`, updateForm, {
        headers: { atoken },
      });

      if (data.success) {
        toast.success(data.message || 'Profile updated successfully!');
        await adminProfile(); // refresh data in context
        setIsEditing(false);
        setImage(null);
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!adminData) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
        {/* Profile Header banner */}
        <div className="h-40 bg-gradient-to-r from-primary to-blue-500 relative">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-4 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-800 text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 z-10"
          >
            <Edit2 size={16} />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Profile Avatar Box */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 mb-8">
            <div className="relative group shrink-0">
              {isEditing ? (
                <label htmlFor="avatar-upload" className="cursor-pointer block relative rounded-2xl overflow-hidden shadow-md border-4 border-white">
                  <img
                    src={image ? URL.createObjectURL(image) : adminData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover transition-filter group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md border-4 border-white">
                  <img
                    src={adminData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
                    alt="Profile"
                    className="w-32 h-32 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left pb-2">
              <h1 className="text-2xl font-bold text-slate-800">{adminData.name}</h1>
              <p className="text-sm font-medium text-slate-400 capitalize">{adminData.role || 'Educator'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-slate-50/50 transition-all outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-slate-50/50 transition-all outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-slate-50/50 transition-all outline-none"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
                  <Award size={16} /> Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.gender || 'Not specified'}
                    disabled
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 disabled:opacity-75 transition-all outline-none"
                  />
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
                  <Calendar size={16} /> Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-slate-50/50 transition-all outline-none"
                />
              </div>

              {/* National Identification Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
                  <FileText size={16} /> National ID (NIN)
                </label>
                <input
                  type="text"
                  name="nin"
                  value={formData.nin}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter 11-digit NIN"
                  maxLength="11"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-slate-50/50 transition-all outline-none"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
                  <Home size={16} /> Office / Home Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-slate-50/50 transition-all outline-none"
                />
              </div>

              {/* About / Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
                  <FileText size={16} /> About Bio
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-slate-50/50 transition-all outline-none resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setImage(null);
                  }}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl shadow-sm hover:shadow active:scale-95 transition-all outline-none"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EducatorProfile;
