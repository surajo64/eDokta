import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoading } from '../../context/loadingContext';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { atoken, setAtoken, setAdminData, backendUrl } = useContext(AppContext);
  const { setLoading } = useLoading();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/educator/change-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        { headers: { atoken } }
      );

      if (data.success) {
        toast.success(data.message || 'Password changed successfully!');
        // Log out the user
        setAtoken(false);
        setAdminData(false);
        localStorage.removeItem('atoken');
        localStorage.removeItem('adminData');
        
        setTimeout(() => {
          setLoading(false);
          navigate('/login');
        }, 1000);
      } else {
        toast.error(data.message || 'Failed to change password');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-3">
            <KeyRound size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 text-center">Settings</h2>
          <p className="text-sm font-medium text-slate-400 text-center mt-1">Change your account password securely</p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
              <Lock size={15} /> Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
              <Lock size={15} /> New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-1.5 flex items-center gap-2">
              <ShieldCheck size={15} /> Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 px-5 py-3 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl shadow-sm hover:shadow active:scale-95 transition-all outline-none flex items-center justify-center gap-2"
          >
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
