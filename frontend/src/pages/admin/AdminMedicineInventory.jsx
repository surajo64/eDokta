import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/adminContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, AlertTriangle, Clock, CheckCircle2, XCircle,
  Plus, Search, Filter, Edit, Trash2, Eye, RefreshCw,
  TrendingDown, Calendar, ShieldCheck, ArrowUpDown, ChevronRight,
  X, Check
} from 'lucide-react';

const AdminMedicineInventory = () => {
  const navigate = useNavigate();
  const { backendUrl, aToken } = useContext(AdminContext);

  const [medicines, setMedicines] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCount: 0,
    lowStockCount: 0,
    expiredCount: 0,
    expiringSoonCount: 0,
    totalStockQty: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilterTab, setActiveFilterTab] = useState('all'); // 'all' | 'low_stock' | 'expiring_soon' | 'expired'

  // Quick stock edit modal
  const [quickStockModal, setQuickStockModal] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');
  const [newPriceVal, setNewPriceVal] = useState('');
  const [updatingStock, setUpdatingStock] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (activeFilterTab !== 'all') params.filter = activeFilterTab;

      const { data } = await axios.get(`${backendUrl}/api/pharmacy/admin/medicines`, {
        headers: { aToken },
        params
      });

      if (data.success) {
        setMedicines(data.medicines);
        if (data.metrics) setMetrics(data.metrics);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Inventory fetch error:', error);
      toast.error('Failed to load medicine inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedCategory, activeFilterTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  // Quick Stock & Price update
  const handleSaveQuickStock = async () => {
    if (!quickStockModal) return;
    try {
      setUpdatingStock(true);
      const updatePayload = {
        id: quickStockModal._id,
        stock: Number(newStockVal),
        price: Number(newPriceVal)
      };

      const { data } = await axios.post(`${backendUrl}/api/pharmacy/admin/update-medicine`, updatePayload, {
        headers: { aToken }
      });

      if (data.success) {
        toast.success('Stock and price updated successfully');
        setQuickStockModal(null);
        fetchInventory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingStock(false);
    }
  };

  // Delete medicine
  const handleDeleteMedicine = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/pharmacy/admin/delete-medicine`, { id }, {
        headers: { aToken }
      });
      if (data.success) {
        toast.success('Medicine removed from inventory');
        setDeleteConfirm(null);
        fetchInventory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete medicine');
    }
  };

  // Helper for expiry countdown display
  const getExpiryLabel = (dateStr) => {
    const expDate = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700">Expired ({Math.abs(diffDays)}d ago)</span>;
    }
    if (diffDays <= 30) {
      return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700">Expiring in {diffDays} days</span>;
    }
    if (diffDays <= 90) {
      return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-800">Expiring in {diffDays} days</span>;
    }
    return <span className="text-xs text-gray-600 font-medium">{expDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ──────────────── Top Header & Actions ──────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
            <Package className="text-primary" /> Medicine Inventory & Stock Alerts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage pharmacy stock levels, reorder thresholds, and expiration date alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInventory}
            className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition shadow-xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <Link
            to="/admin-add-medicine"
            className="px-4 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add New Medicine
          </Link>
        </div>
      </div>

      {/* ──────────────── Alert Metric Cards ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stocked */}
        <div
          onClick={() => setActiveFilterTab('all')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeFilterTab === 'all'
              ? 'bg-blue-50/70 border-primary ring-2 ring-blue-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Medicines</span>
            <Package size={18} className="text-primary" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">{metrics.totalCount}</p>
          <span className="text-[11px] text-gray-400 mt-0.5 block">{metrics.totalStockQty} total units across inventory</span>
        </div>

        {/* Low Stock Reorder Alert */}
        <div
          onClick={() => setActiveFilterTab('low_stock')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeFilterTab === 'low_stock'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-100'
              : 'bg-white border-gray-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Low Stock Reorder</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-900 mt-2">{metrics.lowStockCount}</p>
          <span className="text-[11px] text-amber-700 mt-0.5 block">At or below reorder level</span>
        </div>

        {/* Expiring Soon (< 90 Days) */}
        <div
          onClick={() => setActiveFilterTab('expiring_soon')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeFilterTab === 'expiring_soon'
              ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-100'
              : 'bg-white border-gray-200 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Expiring Soon</span>
            <Clock size={18} className="text-orange-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-900 mt-2">{metrics.expiringSoonCount}</p>
          <span className="text-[11px] text-orange-700 mt-0.5 block">Expiring within 90 days</span>
        </div>

        {/* Expired Stock */}
        <div
          onClick={() => setActiveFilterTab('expired')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeFilterTab === 'expired'
              ? 'bg-red-50 border-red-400 ring-2 ring-red-100'
              : 'bg-white border-gray-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">Expired Drugs</span>
            <XCircle size={18} className="text-red-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-900 mt-2">{metrics.expiredCount}</p>
          <span className="text-[11px] text-red-700 mt-0.5 block">Immediate quarantine required</span>
        </div>
      </div>

      {/* ──────────────── Search & Category Filters Bar ──────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drug name, generic formula, NAFDAC..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>

        {/* Category Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Pain Relief & Analgesics">Pain Relief & Analgesics</option>
            <option value="Antimalarials">Antimalarials</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Diabetes & Endocrine">Diabetes & Endocrine</option>
            <option value="Cough, Cold & Respiratory">Cough, Cold & Respiratory</option>
            <option value="Vitamins & Supplements">Vitamins & Supplements</option>
            <option value="Gastrointestinal">Gastrointestinal</option>
            <option value="First Aid & Antiseptics">First Aid & Antiseptics</option>
            <option value="Dermatology & Skin Care">Dermatology & Skin Care</option>
          </select>

          {activeFilterTab !== 'all' && (
            <button
              onClick={() => setActiveFilterTab('all')}
              className="text-xs text-primary hover:underline font-semibold cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* ──────────────── Inventory Table ──────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-xs">Loading inventory list...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Package size={40} className="mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-gray-600 text-sm">No medicines found</p>
            <p className="text-xs mt-0.5">Try resetting search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Medicine Info</th>
                  <th className="py-3 px-4">Category & Form</th>
                  <th className="py-3 px-4">Price (₦)</th>
                  <th className="py-3 px-4">Stock Level</th>
                  <th className="py-3 px-4">Reorder Level</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Prescription</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicines.map((med) => {
                  const isLow = med.stock <= med.reorderLevel;
                  const isOutOfStock = med.stock <= 0;

                  return (
                    <tr key={med._id} className="hover:bg-slate-50/80 transition">
                      {/* Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={med.image}
                            alt={med.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-100 p-0.5 border border-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-gray-900 block truncate max-w-xs">{med.name}</span>
                            <span className="text-[11px] text-gray-500 truncate block">
                              {med.genericName} • {med.strength}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-700 block">{med.category}</span>
                        <span className="text-[11px] text-gray-400">{med.dosageForm}</span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-gray-900">
                        ₦{med.price.toLocaleString()}
                      </td>

                      {/* Stock Level with Progress Bar */}
                      <td className="py-3 px-4">
                        <div className="w-28">
                          <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                            <span className={isOutOfStock ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-700'}>
                              {med.stock} units
                            </span>
                            {isLow && (
                              <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-1 rounded">
                                LOW
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isOutOfStock ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (med.stock / (med.reorderLevel * 3)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Reorder Level */}
                      <td className="py-3 px-4 font-semibold text-gray-600">
                        {med.reorderLevel} units
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3 px-4">
                        {getExpiryLabel(med.expiryDate)}
                      </td>

                      {/* Prescription */}
                      <td className="py-3 px-4">
                        {med.requiresPrescription ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Rx Required
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            OTC
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Adjust Stock */}
                          <button
                            onClick={() => {
                              setQuickStockModal(med);
                              setNewStockVal(med.stock);
                              setNewPriceVal(med.price);
                            }}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-primary rounded-lg transition cursor-pointer"
                            title="Quick Adjust Stock & Price"
                          >
                            <ArrowUpDown size={14} />
                          </button>

                          {/* Full Edit */}
                          <Link
                            to={`/admin-edit-medicine/${med._id}`}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                            title="Edit Medicine Details"
                          >
                            <Edit size={14} />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirm(med)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ──────────────── Quick Stock & Price Adjustment Modal ──────────────── */}
      {quickStockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Quick Stock & Price Adjust</h3>
              <button
                onClick={() => setQuickStockModal(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="font-semibold text-gray-800">{quickStockModal.name}</p>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Current Stock (Units)</label>
                <input
                  type="number"
                  min="0"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Selling Price (₦)</label>
                <input
                  type="number"
                  min="0"
                  value={newPriceVal}
                  onChange={(e) => setNewPriceVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setQuickStockModal(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={updatingStock}
                onClick={handleSaveQuickStock}
                className="px-5 py-2 bg-primary hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {updatingStock ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── Delete Confirmation Modal ──────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <Trash2 size={36} className="text-red-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 text-base">Remove Medicine?</h4>
            <p className="text-xs text-gray-500 mt-1">
              Are you sure you want to delete <strong className="text-gray-800">{deleteConfirm.name}</strong> from inventory?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMedicine(deleteConfirm._id)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMedicineInventory;
