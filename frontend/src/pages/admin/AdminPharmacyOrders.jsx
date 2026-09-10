import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/adminContext';
import {
  Package, Clock, CheckCircle2, XCircle, Truck, Building2,
  Calendar, Search, Filter, RefreshCw, Eye, Save, AlertCircle,
  FileText, ExternalLink, Check, User, Phone, Mail, MapPin, X
} from 'lucide-react';

const STATUS_CONFIG = {
  'Pending': { color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  'Confirmed': { color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  'Processing': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' },
  'In Transit': { color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  'Ready for Collection': { color: 'bg-teal-100 text-teal-800 border-teal-200', dot: 'bg-teal-500' },
  'Delivered': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  'Collected': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  'Cancelled': { color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500' }
};

const ORDER_STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'In Transit',
  'Ready for Collection',
  'Delivered',
  'Collected',
  'Cancelled'
];

const AdminPharmacyOrders = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    inTransitOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected order for full processing modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [paymentStatusVal, setPaymentStatusVal] = useState('');
  const [courierNameVal, setCourierNameVal] = useState('');
  const [courierPhoneVal, setCourierPhoneVal] = useState('');
  const [trackingCodeVal, setTrackingCodeVal] = useState('');
  const [trackingNotesVal, setTrackingNotesVal] = useState('');
  const [rxVerifiedVal, setRxVerifiedVal] = useState(false);
  const [statusNoteVal, setStatusNoteVal] = useState('');
  const [savingOrder, setSavingOrder] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (fulfillmentFilter !== 'All') params.fulfillment = fulfillmentFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const { data } = await axios.get(`${backendUrl}/api/pharmacy/admin/orders`, {
        headers: { aToken },
        params
      });

      if (data.success) {
        setOrders(data.orders);
        if (data.metrics) setMetrics(data.metrics);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load pharmacy orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, fulfillmentFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setProcessingStatus(order.orderStatus);
    setPaymentStatusVal(order.paymentStatus);
    setCourierNameVal(order.courierInfo?.courierName || '');
    setCourierPhoneVal(order.courierInfo?.courierPhone || '');
    setTrackingCodeVal(order.courierInfo?.trackingCode || '');
    setTrackingNotesVal(order.trackingNotes || '');
    setRxVerifiedVal(order.prescriptionVerified || false);
    setStatusNoteVal('');
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    try {
      setSavingOrder(true);
      const payload = {
        orderId: selectedOrder._id,
        orderStatus: processingStatus,
        paymentStatus: paymentStatusVal,
        courierName: courierNameVal,
        courierPhone: courierPhoneVal,
        trackingCode: trackingCodeVal,
        trackingNotes: trackingNotesVal,
        prescriptionVerified: rxVerifiedVal,
        statusNote: statusNoteVal
      };

      const { data } = await axios.post(`${backendUrl}/api/pharmacy/admin/update-order-status`, payload, {
        headers: { aToken }
      });

      if (data.success) {
        toast.success(data.message || 'Order updated successfully!');
        setSelectedOrder(null);
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ──────────────── Top Header ──────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
            <Package className="text-primary" /> Pharmacy Order Processing
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Track patient orders, verify prescriptions, manage dispatch, and update order statuses
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition shadow-xs cursor-pointer"
          title="Refresh Orders"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ──────────────── Order Status Metric Badges ──────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setStatusFilter('All')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'All' ? 'bg-blue-50/60 border-primary ring-2 ring-blue-100' : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Total Orders</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{metrics.totalOrders}</p>
        </div>

        <div
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'Pending' ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-100' : 'bg-white border-gray-200 hover:border-amber-200'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase block">Pending</span>
          <p className="text-2xl font-black text-amber-900 mt-1">{metrics.pendingOrders}</p>
        </div>

        <div
          onClick={() => setStatusFilter('Processing')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'Processing' ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-100' : 'bg-white border-gray-200 hover:border-indigo-200'
          }`}
        >
          <span className="text-[11px] font-bold text-indigo-700 uppercase block">Processing / Packing</span>
          <p className="text-2xl font-black text-indigo-900 mt-1">{metrics.processingOrders}</p>
        </div>

        <div
          onClick={() => setStatusFilter('In Transit')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'In Transit' ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-100' : 'bg-white border-gray-200 hover:border-purple-200'
          }`}
        >
          <span className="text-[11px] font-bold text-purple-700 uppercase block">In Transit / Ready</span>
          <p className="text-2xl font-black text-purple-900 mt-1">{metrics.inTransitOrders}</p>
        </div>

        <div
          onClick={() => setStatusFilter('Delivered')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'Delivered' ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100' : 'bg-white border-gray-200 hover:border-emerald-200'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">Fulfilled</span>
          <p className="text-2xl font-black text-emerald-900 mt-1">{metrics.completedOrders}</p>
        </div>
      </div>

      {/* ──────────────── Search & Filter Strip ──────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Patient Name, Phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Fulfillment filter */}
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Fulfillment Types</option>
            <option value="home_delivery">Home Delivery Only</option>
            <option value="facility_collection">Facility Collection Only</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {ORDER_STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ──────────────── Orders Table ──────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-xs">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Package size={40} className="mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-gray-600 text-sm">No orders matching criteria</p>
            <p className="text-xs mt-0.5">Try changing search or status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4">Total & Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const cfg = STATUS_CONFIG[order.orderStatus] || { color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/80 transition">
                      {/* Order Number & Date */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-gray-900 block">{order.orderNumber}</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{order.customer?.name}</span>
                        <span className="text-[11px] text-gray-500">{order.customer?.phone}</span>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">{order.items?.length} item{order.items?.length > 1 ? 's' : ''}</span>
                        <span className="text-[11px] text-gray-400 block truncate max-w-xs">
                          {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </span>
                      </td>

                      {/* Fulfillment */}
                      <td className="py-3 px-4">
                        {order.fulfillmentType === 'home_delivery' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                            <Truck size={12} /> Home Delivery
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                            <Building2 size={12} /> Facility Collection
                          </span>
                        )}
                      </td>

                      {/* Total & Payment */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">₦{order.totalAmount.toLocaleString()}</span>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase">
                            {order.paymentMethod.replace(/_/g, ' ')}
                          </span>

                          {order.paymentMethod === 'paystack' && order.paymentStatus === 'Pending' && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const { data } = await axios.post(`${backendUrl}/api/pharmacy/verify-payment`, {
                                    reference: order.paystackReference,
                                    orderNumber: order.orderNumber
                                  });
                                  if (data.success) {
                                    toast.success(`Order ${order.orderNumber} verified as Paid!`);
                                    fetchOrders();
                                  } else {
                                    toast.warning(data.message || 'Payment not confirmed yet');
                                  }
                                } catch (err) {
                                  toast.error('Failed to verify Paystack');
                                }
                              }}
                              className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold hover:bg-emerald-100 transition cursor-pointer"
                              title="Check Paystack API to confirm payment"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openOrderModal(order)}
                          className="px-3 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye size={13} /> Process
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ──────────────── Order Processing Modal ──────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-primary rounded-xl">
                  <Package size={22} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Order Processing</span>
                  <h3 className="font-mono text-lg font-bold text-gray-900">{selectedOrder.orderNumber}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Customer & Delivery Details */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} className="text-primary" /> Customer Info
                  </h4>
                  <p><strong>Name:</strong> {selectedOrder.customer?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer?.phone}</p>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-2">
                  <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    {selectedOrder.fulfillmentType === 'home_delivery' ? <Truck size={14} /> : <Building2 size={14} />}
                    Fulfillment: {selectedOrder.fulfillmentType === 'home_delivery' ? 'Home Delivery' : 'Facility Collection'}
                  </h4>

                  {selectedOrder.fulfillmentType === 'home_delivery' ? (
                    <>
                      <p><strong>Address:</strong> {selectedOrder.deliveryAddress?.address}, {selectedOrder.deliveryAddress?.city}</p>
                      {selectedOrder.deliveryAddress?.deliveryNotes && (
                        <p className="italic text-gray-500">Note: {selectedOrder.deliveryAddress.deliveryNotes}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p><strong>Facility:</strong> {selectedOrder.collectionFacility?.facilityName}</p>
                      <p><strong>Address:</strong> {selectedOrder.collectionFacility?.facilityAddress}</p>
                    </>
                  )}
                </div>

                {/* Prescription Image Preview if uploaded */}
                {selectedOrder.prescriptionImage && (
                  <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <FileText size={14} /> Doctor's Prescription
                      </h4>
                      <a
                        href={selectedOrder.prescriptionImage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline text-[11px] font-semibold flex items-center gap-1"
                      >
                        View Full Image <ExternalLink size={12} />
                      </a>
                    </div>

                    <img
                      src={selectedOrder.prescriptionImage}
                      alt="Prescription document"
                      className="max-h-36 mx-auto rounded-lg border border-amber-200 object-contain mt-1"
                    />

                    <label className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rxVerifiedVal}
                        onChange={(e) => setRxVerifiedVal(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span className="font-bold text-emerald-800 text-[11px]">
                        Mark Prescription as Verified by Pharmacist
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Right Column: Order Items & Processing Controls */}
              <div className="space-y-4">
                {/* Items */}
                <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-2">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Ordered Medications</h4>
                  <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto pr-1">
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-gray-800">{it.name}</span>
                          <span className="text-[10px] text-gray-400 block">{it.strength} • {it.dosageForm}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500">×{it.quantity}</span>
                          <span className="font-bold text-gray-900 block">₦{(it.price * it.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                    <span>Total Amount:</span>
                    <span className="text-primary">₦{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Status & Payment Controls */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Update Order Status</h4>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Order Status</label>
                    <select
                      value={processingStatus}
                      onChange={(e) => setProcessingStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                    >
                      {ORDER_STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-gray-600 font-semibold">Payment Status</label>
                      {selectedOrder.paymentStatus === 'Paid' ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          🔒 Verified & Locked
                        </span>
                      ) : selectedOrder.paymentMethod === 'paystack' && paymentStatusVal !== 'Paid' ? (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const { data } = await axios.post(`${backendUrl}/api/pharmacy/verify-payment`, {
                                reference: selectedOrder.paystackReference,
                                orderNumber: selectedOrder.orderNumber
                              });
                              if (data.success) {
                                toast.success('Paystack payment verified successfully!');
                                setPaymentStatusVal('Paid');
                                fetchOrders();
                              } else {
                                toast.warning(data.message || 'Payment not verified on Paystack yet');
                              }
                            } catch (e) {
                              toast.error(e.response?.data?.message || 'Verification request failed');
                            }
                          }}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                        >
                          Check Paystack Status
                        </button>
                      ) : null}
                    </div>

                    {selectedOrder.paymentStatus === 'Paid' ? (
                      <div className="w-full px-3 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <span>Paid ({selectedOrder.paymentMethod === 'paystack' ? 'Paystack Online' : 'Cash / POS / Counter'})</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider bg-emerald-200/70 px-2 py-0.5 rounded">
                          Locked
                        </span>
                      </div>
                    ) : (
                      <select
                        value={paymentStatusVal}
                        onChange={(e) => setPaymentStatusVal(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending (Unpaid)</option>
                        <option value="Paid">Paid (Cash / POS / Online Collected)</option>
                        <option value="Failed">Failed</option>
                      </select>
                    )}
                  </div>

                  {selectedOrder.fulfillmentType === 'home_delivery' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-600 font-medium mb-0.5">Courier Name</label>
                        <input
                          type="text"
                          value={courierNameVal}
                          onChange={(e) => setCourierNameVal(e.target.value)}
                          placeholder="e.g. eDokta Express"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium mb-0.5">Tracking Number</label>
                        <input
                          type="text"
                          value={trackingCodeVal}
                          onChange={(e) => setTrackingCodeVal(e.target.value)}
                          placeholder="ED-EXP-908"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-600 font-medium mb-0.5">Courier Phone Number</label>
                    <input
                      type="tel"
                      value={courierPhoneVal}
                      onChange={(e) => setCourierPhoneVal(e.target.value)}
                      placeholder="e.g. 08012345678 or 07035400899"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 transition cursor-pointer"
              >
                Close
              </button>

              <button
                disabled={savingOrder}
                onClick={handleUpdateOrder}
                className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                {savingOrder ? (
                  'Updating...'
                ) : (
                  <>
                    <Save size={15} /> Save & Update Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPharmacyOrders;
