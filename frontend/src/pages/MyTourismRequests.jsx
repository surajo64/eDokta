import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import {
  Globe, Clock, CheckCircle2, XCircle, FileText, AlertCircle,
  ArrowRight, RefreshCw, ChevronRight, Calendar, Phone, Mail,
  MapPin, Stethoscope, Activity, Building2, User
} from 'lucide-react';

const STATUS_CONFIG = {
  'Pending':      { color: 'bg-amber-100 text-amber-700 border-amber-200',    dot: 'bg-amber-400',    icon: Clock },
  'Under Review': { color: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500',     icon: Activity },
  'Accepted':     { color: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-500',    icon: CheckCircle2 },
  'Rejected':     { color: 'bg-red-100 text-red-700 border-red-200',          dot: 'bg-red-500',      icon: XCircle }
};

const MyTourismRequests = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/my-tourism-requests`, {
        headers: { token }
      });
      if (data.success) {
        setRequests(data.requests);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your medical tourism requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-blue-300" />
              <span className="text-xs uppercase tracking-widest text-blue-200 font-semibold">My Medical Tourism</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">My International Treatment Requests</h1>
            <p className="text-blue-200 text-sm">Track the status of your medical tourism requests and view responses from the eDokta concierge team.</p>
          </div>
          <button
            onClick={() => navigate('/digital-clinic/medical-tourism')}
            className="hidden sm:flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-5 py-3 rounded-full transition-all">
            <FileText className="w-4 h-4" /> New Request
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <Globe className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Medical Tourism Requests Yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            You haven't submitted any international treatment requests. Submit your first request and our team will respond within 24–48 hours.
          </p>
          <button
            onClick={() => navigate('/digital-clinic/medical-tourism')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full inline-flex items-center gap-2 transition-all">
            <Globe className="w-4 h-4" /> Submit Medical Tourism Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-gray-700">All Requests ({requests.length})</h2>
              <button onClick={fetchRequests} className="text-blue-600 hover:text-blue-800 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {requests.map(req => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG['Pending'];
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={req._id}
                  onClick={() => setSelected(req)}
                  className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    selected?._id === req._id ? 'border-blue-400 shadow-md ring-1 ring-blue-200' : 'border-gray-200'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" /> {req.status}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(req.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">{req.treatmentSought}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {req.preferredCountry}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Stethoscope className="w-3 h-3" /> {req.medicalCondition}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                {/* Status Header */}
                <div className={`p-6 ${
                  selected.status === 'Accepted' ? 'bg-green-600' :
                  selected.status === 'Rejected' ? 'bg-red-600' :
                  selected.status === 'Under Review' ? 'bg-blue-700' :
                  'bg-gray-700'
                } text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-80 font-semibold mb-1">Request Status</p>
                      <h2 className="text-2xl font-extrabold">{selected.status}</h2>
                      <p className="text-white/80 text-sm mt-1">
                        Submitted: {new Date(selected.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Treatment Summary */}
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Treatment Request Summary</h3>
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-100">
                      {[
                        { label: 'Medical Condition', value: selected.medicalCondition, icon: Stethoscope },
                        { label: 'Treatment Sought', value: selected.treatmentSought, icon: Activity },
                        { label: 'Preferred Country', value: selected.preferredCountry, icon: Globe },
                        { label: 'Urgency', value: selected.urgency, icon: Clock },
                        { label: 'Budget Range', value: selected.budgetRange, icon: FileText },
                        { label: 'Travel Timeline', value: selected.travelTimeline || 'Not specified', icon: Calendar },
                      ].map((row, i) => {
                        const Icon = row.icon;
                        return (
                          <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-xs font-semibold text-gray-500 w-36 shrink-0">{row.label}</span>
                            <span className="text-sm text-gray-800 font-medium">{row.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Admin Response */}
                  {(selected.adminNotes || selected.assignedHospital || selected.assignedCountry || selected.estimatedCost) && (
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">eDokta Concierge Response</h3>
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
                        {selected.adminNotes && (
                          <div>
                            <p className="text-xs font-bold text-blue-700 mb-1">Concierge Notes</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{selected.adminNotes}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-semibold mb-0.5">Assigned Hospital</p>
                            <p className="text-sm font-bold text-gray-800">{selected.assignedHospital || 'Pending assignment'}</p>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-semibold mb-0.5">Assigned Country</p>
                            <p className="text-sm font-bold text-blue-700 flex items-center gap-1.5">
                              <Globe className="w-4 h-4 text-blue-500" />
                              {selected.assignedCountry || 'Pending assignment'}
                            </p>
                          </div>

                          <div className="sm:col-span-2 bg-white p-3.5 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-semibold mb-0.5">Hospital Address</p>
                            <p className="text-sm font-medium text-gray-800 flex items-start gap-1.5">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                              {selected.hospitalAddress || 'Address will be provided upon confirmation'}
                            </p>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-semibold mb-0.5">Your Coordinator</p>
                            <p className="text-sm font-bold text-gray-800">{selected.assignedCoordinator || '—'}</p>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-semibold mb-0.5">Estimated Cost</p>
                            <p className="text-sm font-bold text-gray-800">{selected.estimatedCost || '—'}</p>
                          </div>

                          <div className="sm:col-span-2 bg-white p-3.5 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-semibold mb-0.5">Proposed Travel Date</p>
                            <p className="text-sm font-bold text-gray-800">{selected.estimatedTravelDate || '—'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selected.status === 'Pending' && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Awaiting Review</p>
                        <p className="text-xs text-amber-700 mt-0.5">Our concierge team typically responds within 24–48 hours. Please keep your phone accessible.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                <Globe className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">Select a request from the list to view full details and eDokta's response.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTourismRequests;
