import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/adminContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Package, Plus, Upload, ArrowLeft, Save, AlertTriangle,
  Calendar, Check, ShieldCheck, DollarSign
} from 'lucide-react';

const CATEGORIES = [
  "Antibiotics",
  "Pain Relief & Analgesics",
  "Antimalarials",
  "Cardiovascular",
  "Diabetes & Endocrine",
  "Cough, Cold & Respiratory",
  "Vitamins & Supplements",
  "Gastrointestinal",
  "First Aid & Antiseptics",
  "Pediatrics",
  "Dermatology & Skin Care",
  "Eye & Ear Care"
];

const DOSAGE_FORMS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Suspension",
  "Injection",
  "Ointment / Cream",
  "Inhaler",
  "Eye / Ear Drops",
  "Powder / Sachet",
  "Liquid / Solution"
];

const AdminAddMedicine = () => {
  const { id } = useParams(); // If id exists, it is in edit mode
  const navigate = useNavigate();
  const { backendUrl, aToken } = useContext(AdminContext);

  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brandName: '',
    category: CATEGORIES[0],
    dosageForm: DOSAGE_FORMS[0],
    strength: '',
    packSize: '',
    price: '',
    costPrice: '',
    stock: '',
    reorderLevel: '10',
    expiryDate: '',
    requiresPrescription: false,
    nafdacRegNumber: '',
    description: '',
    indications: '',
    dosageInstructions: '',
    sideEffects: '',
    storageInstructions: 'Store below 25°C away from heat and moisture.',
    manufacturer: 'eDokta Verified Partner',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // If edit mode, load existing medicine details
  useEffect(() => {
    if (isEditMode) {
      const fetchMedicine = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${backendUrl}/api/pharmacy/medicine/${id}`);
          if (data.success && data.medicine) {
            const med = data.medicine;
            setFormData({
              name: med.name || '',
              genericName: med.genericName || '',
              brandName: med.brandName || '',
              category: med.category || CATEGORIES[0],
              dosageForm: med.dosageForm || DOSAGE_FORMS[0],
              strength: med.strength || '',
              packSize: med.packSize || '',
              price: med.price || '',
              costPrice: med.costPrice || '',
              stock: med.stock !== undefined ? med.stock : '',
              reorderLevel: med.reorderLevel !== undefined ? med.reorderLevel : '10',
              expiryDate: med.expiryDate ? new Date(med.expiryDate).toISOString().split('T')[0] : '',
              requiresPrescription: Boolean(med.requiresPrescription),
              nafdacRegNumber: med.nafdacRegNumber || '',
              description: med.description || '',
              indications: med.indications || '',
              dosageInstructions: med.dosageInstructions || '',
              sideEffects: med.sideEffects || '',
              storageInstructions: med.storageInstructions || '',
              manufacturer: med.manufacturer || '',
              image: med.image || ''
            });
            if (med.image) {
              setImagePreview(med.image);
            }
          }
        } catch (error) {
          toast.error('Failed to load medicine details');
        } finally {
          setLoading(false);
        }
      };

      fetchMedicine();
    }
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.genericName || !formData.strength || !formData.packSize || !formData.price || !formData.expiryDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const dataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        dataToSend.append(key, formData[key]);
      });

      if (imageFile) {
        dataToSend.append('image', imageFile);
      }

      if (isEditMode) {
        dataToSend.append('id', id);
        const { data } = await axios.post(`${backendUrl}/api/pharmacy/admin/update-medicine`, dataToSend, {
          headers: { aToken, 'Content-Type': 'multipart/form-data' }
        });
        if (data.success) {
          toast.success(data.message || 'Medicine updated successfully!');
          navigate('/admin-pharmacy-inventory');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/pharmacy/admin/add-medicine`, dataToSend, {
          headers: { aToken, 'Content-Type': 'multipart/form-data' }
        });
        if (data.success) {
          toast.success(data.message || 'Medicine added to inventory!');
          navigate('/admin-pharmacy-inventory');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Error saving medicine');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-xs">Loading medicine information...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin-pharmacy-inventory"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft size={14} /> Back to Inventory
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {isEditMode ? 'Edit Medication Details' : 'Add Medication to Inventory'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Set clinical formulation, pricing, stock levels, reorder alert threshold, and expiration date
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Section 1: Basic Clinical Identification */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <Package size={16} className="text-primary" /> 1. Medication Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Medication Name / Trade Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Amoxicillin Trihydrate Caps 500mg"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Active / Generic Molecule *</label>
              <input
                type="text"
                required
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                placeholder="e.g. Amoxicillin"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Brand / Product Line</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder="e.g. Amoxil"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Therapeutic Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Dosage Form *</label>
              <select
                value={formData.dosageForm}
                onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer bg-white"
              >
                {DOSAGE_FORMS.map((form) => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Strength (e.g. 500mg, 100ml) *</label>
              <input
                type="text"
                required
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                placeholder="500mg"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pack Size / Presentation *</label>
              <input
                type="text"
                required
                value={formData.packSize}
                onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                placeholder="Pack of 20 Capsules"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">NAFDAC Reg Number</label>
              <input
                type="text"
                value={formData.nafdacRegNumber}
                onChange={(e) => setFormData({ ...formData, nafdacRegNumber: e.target.value })}
                placeholder="e.g. 04-1234"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Stock, Reorder Threshold & Expiry (Crucial User Requirements) */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" /> 2. Inventory Stock, Reorder Alerts & Expiration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Selling Price (₦) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2400"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cost / Wholesale Price (₦)</label>
              <input
                type="number"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="1600"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Current Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              <label className="block text-xs font-bold text-amber-900 mb-1">
                Reorder Alert Level *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                placeholder="10"
                className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs sm:text-sm font-bold text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
              <span className="text-[10px] text-amber-700 mt-1 block">
                Triggers Low Stock Notification when stock falls to this count.
              </span>
            </div>

            <div className="sm:col-span-2 bg-blue-50/50 p-3 rounded-xl border border-blue-200">
              <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" /> Expiration Date *
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 text-xs sm:text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none bg-white"
              />
              <span className="text-[10px] text-blue-700 mt-1 block">
                Alerts triggered automatically at &lt; 90 days, &lt; 30 days, and on expiration.
              </span>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="requiresRx"
                checked={formData.requiresPrescription}
                onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                className="w-5 h-5 text-primary rounded cursor-pointer"
              />
              <label htmlFor="requiresRx" className="cursor-pointer text-xs">
                <strong className="text-gray-900 block font-bold">Prescription Required (Rx)</strong>
                <span className="text-gray-500">
                  When checked, patients must upload or provide a doctor's prescription before checkout.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Medication Image */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <Upload size={16} className="text-primary" /> 3. Medication Product Image
          </h3>

          <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-2xl bg-slate-100 border border-gray-200 flex items-center justify-center overflow-hidden p-2 shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <Package size={32} className="text-gray-300" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Upload Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 cursor-pointer"
              />
              <p className="text-[11px] text-gray-400">
                Leave empty to use the default professional pharmaceutical packaging asset.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Clinical Guidance */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" /> 4. Clinical Details & Usage
          </h3>

          <div className="space-y-4 mt-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Medication Overview / Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief clinical description of the drug..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Indications (What it treats)</label>
                <textarea
                  rows={2}
                  value={formData.indications}
                  onChange={(e) => setFormData({ ...formData, indications: e.target.value })}
                  placeholder="e.g. Chest infections, UTI, bacterial infections..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Dosage Instructions</label>
                <textarea
                  rows={2}
                  value={formData.dosageInstructions}
                  onChange={(e) => setFormData({ ...formData, dosageInstructions: e.target.value })}
                  placeholder="e.g. 1 capsule every 8 hours with water..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Side Effects & Warnings</label>
                <textarea
                  rows={2}
                  value={formData.sideEffects}
                  onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                  placeholder="e.g. Nausea, mild rash. Discontinue if allergic."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Storage Instructions</label>
                <input
                  type="text"
                  value={formData.storageInstructions}
                  onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            to="/admin-pharmacy-inventory"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Medication...
              </>
            ) : (
              <>
                <Save size={16} /> {isEditMode ? 'Update Medicine' : 'Save to Inventory'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddMedicine;
