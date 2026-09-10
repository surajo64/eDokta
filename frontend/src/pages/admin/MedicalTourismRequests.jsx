import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/adminContext';
import {
  Globe, Clock, CheckCircle2, XCircle, Activity, Search,
  RefreshCw, Eye, Save, Trash2, ChevronDown, AlertCircle,
  User, Phone, Mail, FileText, Building2, Calendar,
  Stethoscope, MapPin, Filter, Download, X
} from 'lucide-react';

const STATUS_CONFIG = {
  'Pending':      { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400',  icon: Clock },
  'Under Review': { color: 'bg-blue-100 text-blue-700 border-blue-200',    dot: 'bg-blue-500',   icon: Activity },
  'Accepted':     { color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500',  icon: CheckCircle2 },
  'Rejected':     { color: 'bg-red-100 text-red-700 border-red-200',       dot: 'bg-red-500',    icon: XCircle }
};

const STATUS_OPTIONS = ['Pending', 'Under Review', 'Accepted', 'Rejected'];

const MedicalTourismRequests = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Edit form state
  const [editData, setEditData] = useState({
    status: '',
    adminNotes: '',
    assignedHospital: '',
    assignedCountry: '',
    hospitalAddress: '',
    assignedCoordinator: '',
    estimatedCost: '',
    estimatedTravelDate: ''
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/tourism-requests`, {
        headers: { aToken },
        params: filterStatus !== 'All' ? { status: filterStatus } : {}
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

  useEffect(() => { fetchRequests(); }, [filterStatus]);

  const openDetail = (req) => {
    setSelected(req);
    setEditMode(false);
    setEditData({
      status: req.status,
      adminNotes: req.adminNotes || '',
      assignedHospital: req.assignedHospital || '',
      assignedCountry: req.assignedCountry || '',
      hospitalAddress: req.hospitalAddress || '',
      assignedCoordinator: req.assignedCoordinator || '',
      estimatedCost: req.estimatedCost || '',
      estimatedTravelDate: req.estimatedTravelDate || ''
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/update-tourism-request`, {
        requestId: selected._id,
        ...editData
      }, { headers: { aToken } });
      if (data.success) {
        toast.success('Request updated successfully');
        setSelected(data.request);
        setEditMode(false);
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/delete-tourism-request`,
        { requestId }, { headers: { aToken } });
      if (data.success) {
        toast.success('Request deleted');
        setSelected(null);
        setConfirmDelete(null);
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredRequests = requests.filter(r => {
    const q = searchQuery.toLowerCase();
    return !q || r.patientName?.toLowerCase().includes(q) ||
      r.medicalCondition?.toLowerCase().includes(q) ||
      r.preferredCountry?.toLowerCase().includes(q) ||
      r.treatmentSought?.toLowerCase().includes(q);
  });

  // Summary stats
  const stats = [
    { label: 'Total Requests', value: requests.length, color: 'bg-gray-100 text-gray-700', icon: Globe },
    { label: 'Pending Review', value: requests.filter(r => r.status === 'Pending').length, color: 'bg-amber-100 text-amber-700', icon: Clock },
    { label: 'Under Review', value: requests.filter(r => r.status === 'Under Review').length, color: 'bg-blue-100 text-blue-700', icon: Activity },
    { label: 'Accepted', value: requests.filter(r => r.status === 'Accepted').length, color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    { label: 'Rejected', value: requests.filter(r => r.status === 'Rejected').length, color: 'bg-red-100 text-red-700', icon: XCircle }
  ];

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900">Medical Tourism Requests</h1>
        </div>
        <p className="text-sm text-gray-500 ml-11">Manage patient international medical tourism consultation requests.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`${s.color} rounded-2xl p-4 flex items-center justify-between`}>
              <div>
                <p className="text-xs font-semibold opacity-70">{s.label}</p>
                <p className="text-3xl font-extrabold mt-0.5">{s.value}</p>
              </div>
              <Icon className="w-6 h-6 opacity-50" />
            </div>
          );
        })}
      </div>

      {/* Filters Row */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by patient, condition, country, treatment..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-semibold flex items-center gap-1"><Filter className="w-3.5 h-3.5" />Status:</span>
          {['All', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
          <button onClick={fetchRequests} className="p-2 text-gray-500 hover:text-blue-600 transition-colors ml-1">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Requests Table */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No requests found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[72vh] overflow-y-auto">
                {filteredRequests.map(req => {
                  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG['Pending'];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={req._id}
                      onClick={() => openDetail(req)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?._id === req._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.color}`}>
                          <Icon className="w-3 h-3" /> {req.status}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(req.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">{req.patientName}</p>
                      <p className="text-xs text-gray-500 truncate">{req.treatmentSought}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Globe className="w-3 h-3" /> {req.preferredCountry} &nbsp;·&nbsp;
                        <Clock className="w-3 h-3" /> {req.urgency}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detail / Edit Panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* Detail Header */}
              <div className={`p-5 text-white ${
                selected.status === 'Accepted' ? 'bg-green-700' :
                selected.status === 'Rejected' ? 'bg-red-700' :
                selected.status === 'Under Review' ? 'bg-blue-700' : 'bg-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider opacity-75 font-semibold">{selected.status}</span>
                    <h2 className="text-xl font-extrabold mt-0.5">{selected.patientName}</h2>
                    <p className="text-sm opacity-80">{selected.treatmentSought} → {selected.preferredCountry}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
                {/* Patient Contact Info */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Patient Contact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: User,  label: 'Name',   value: selected.patientName },
                      { icon: Mail,  label: 'Email',  value: selected.patientEmail },
                      { icon: Phone, label: 'Phone',  value: selected.patientPhone }
                    ].map((row, i) => {
                      const Icon = row.icon;
                      return (
                        <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Icon className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-xs text-gray-400 font-semibold">{row.label}</p>
                          </div>
                          <p className="text-xs font-bold text-gray-800 truncate">{row.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Medical Details */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Medical Details</h3>
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-100">
                    {[
                      { label: 'Medical Condition',  value: selected.medicalCondition },
                      { label: 'Treatment Sought',   value: selected.treatmentSought },
                      { label: 'Preferred Country',  value: selected.preferredCountry },
                      { label: 'Urgency',            value: selected.urgency },
                      { label: 'Budget Range',       value: selected.budgetRange },
                      { label: 'Travel Timeline',    value: selected.travelTimeline || '—' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                        <span className="text-xs font-semibold text-gray-400 w-36 shrink-0 pt-0.5">{row.label}</span>
                        <span className="text-xs font-medium text-gray-800">{row.value}</span>
                      </div>
                    ))}
                    {selected.additionalNotes && (
                      <div className="px-4 py-2.5">
                        <p className="text-xs font-semibold text-gray-400 mb-1">Additional Notes</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{selected.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Response Form */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Admin Response & Management</h3>
                    {!editMode && (
                      <button onClick={() => setEditMode(true)}
                        className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                        Edit Response
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <div className="space-y-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
                      {/* Status */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Update Status</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {STATUS_OPTIONS.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setEditData(prev => ({ ...prev, status: s }))}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                                editData.status === s
                                  ? s === 'Accepted' ? 'bg-green-600 border-green-600 text-white' :
                                    s === 'Rejected' ? 'bg-red-600 border-red-600 text-white' :
                                    s === 'Under Review' ? 'bg-blue-600 border-blue-600 text-white' :
                                    'bg-gray-700 border-gray-700 text-white'
                                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Assigned Hospital, Country, Address & Coordinator */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned Hospital</label>
                          <input type="text" value={editData.assignedHospital}
                            onChange={e => setEditData(prev => ({ ...prev, assignedHospital: e.target.value }))}
                            placeholder="e.g. Acibadem Hospital, Istanbul"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned Country</label>
                          <input type="text" value={editData.assignedCountry}
                            onChange={e => setEditData(prev => ({ ...prev, assignedCountry: e.target.value }))}
                            placeholder="e.g. Turkey, UAE, India, UK..."
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Hospital Address</label>
                          <input type="text" value={editData.hospitalAddress}
                            onChange={e => setEditData(prev => ({ ...prev, hospitalAddress: e.target.value }))}
                            placeholder="e.g. Fevzi Cakmak Mah. No:45, Kadikoy, Istanbul, Turkey"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned Coordinator</label>
                          <input type="text" value={editData.assignedCoordinator}
                            onChange={e => setEditData(prev => ({ ...prev, assignedCoordinator: e.target.value }))}
                            placeholder="e.g. Dr. Farida Musa"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Cost</label>
                          <input type="text" value={editData.estimatedCost}
                            onChange={e => setEditData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                            placeholder="e.g. $12,000 – $18,000 USD"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Proposed Travel Date</label>
                          <input type="text" value={editData.estimatedTravelDate}
                            onChange={e => setEditData(prev => ({ ...prev, estimatedTravelDate: e.target.value }))}
                            placeholder="e.g. November 2026 / Q1 2027"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      {/* Admin Notes */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Admin / Concierge Notes to Patient</label>
                        <textarea
                          value={editData.adminNotes}
                          onChange={e => setEditData(prev => ({ ...prev, adminNotes: e.target.value }))}
                          rows={4}
                          placeholder="Write notes to the patient: treatment plan overview, next steps, hospital information, visa procedure, estimated dates..."
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-white resize-none"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all disabled:opacity-50">
                          <Save className="w-4 h-4" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-xl text-xs hover:bg-gray-50 transition-all">
                          Cancel
                        </button>
                        <button
                          onClick={() => setConfirmDelete(selected._id)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold text-xs transition-colors ml-auto">
                          <Trash2 className="w-4 h-4" /> Delete Request
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Read-only admin response view */
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                      {selected.adminNotes || selected.assignedHospital ? (
                        <>
                          {selected.adminNotes && (
                            <div>
                              <p className="text-xs text-gray-400 font-semibold mb-1">Concierge Notes</p>
                              <p className="text-xs text-gray-700 leading-relaxed">{selected.adminNotes}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                              <p className="text-xs text-gray-400 font-semibold mb-0.5">Hospital</p>
                              <p className="text-xs font-bold text-gray-800">{selected.assignedHospital || 'Not assigned yet'}</p>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                              <p className="text-xs text-gray-400 font-semibold mb-0.5">Assigned Country</p>
                              <p className="text-xs font-bold text-blue-700 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5 text-blue-500" />
                                {selected.assignedCountry || 'Not assigned yet'}
                              </p>
                            </div>

                            <div className="sm:col-span-2 bg-white p-2.5 rounded-xl border border-gray-200">
                              <p className="text-xs text-gray-400 font-semibold mb-0.5">Hospital Address</p>
                              <p className="text-xs font-medium text-gray-700 flex items-start gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                                {selected.hospitalAddress || 'Not specified yet'}
                              </p>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                              <p className="text-xs text-gray-400 font-semibold mb-0.5">Coordinator</p>
                              <p className="text-xs font-bold text-gray-800">{selected.assignedCoordinator || '—'}</p>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                              <p className="text-xs text-gray-400 font-semibold mb-0.5">Estimated Cost</p>
                              <p className="text-xs font-bold text-gray-800">{selected.estimatedCost || '—'}</p>
                            </div>

                            <div className="sm:col-span-2 bg-white p-2.5 rounded-xl border border-gray-200">
                              <p className="text-xs text-gray-400 font-semibold mb-0.5">Travel Date</p>
                              <p className="text-xs font-bold text-gray-800">{selected.estimatedTravelDate || '—'}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                          <p className="text-xs text-gray-400">No admin response added yet. Click "Edit Response" to review and respond to this request.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
              <Globe className="w-14 h-14 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400 font-medium">Select a request from the list</p>
              <p className="text-xs text-gray-300 mt-1">to view details and manage the patient's medical tourism journey.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Request?</h3>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone. The medical tourism request will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Yes, Delete
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalTourismRequests;
