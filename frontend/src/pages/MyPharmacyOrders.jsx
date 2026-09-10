import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package, Clock, CheckCircle2, XCircle, Truck, Building2,
  Calendar, CreditCard, ChevronRight, ArrowLeft, RefreshCw,
  ExternalLink, Eye, MapPin, AlertCircle, Check, Search, Phone,
  User, ShieldCheck, FileText, Compass, X
} from 'lucide-react';

const STATUS_BADGE = {
  'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
  'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
  'Processing': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'In Transit': 'bg-purple-100 text-purple-800 border-purple-200',
  'Ready for Collection': 'bg-teal-100 text-teal-800 border-teal-200',
  'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Collected': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Cancelled': 'bg-red-100 text-red-800 border-red-200'
};

const MyPharmacyOrders = () => {
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Tracking state
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/pharmacy/my-orders`, {
        headers: { token }
      });
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch my orders error:', error);
      toast.error('Failed to load your pharmacy orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token]);

  // Track an order by ID (e.g. ED-PH-XXXXXX)
  const handleTrackOrder = async (orderNum) => {
    const targetNumber = (orderNum || trackingInput).trim().toUpperCase();
    if (!targetNumber) {
      toast.warning('Please enter an order number to track');
      return;
    }

    try {
      setTrackingLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/pharmacy/track-order/${targetNumber}`);
      if (data.success && data.order) {
        setTrackingModalOrder(data.order);
      } else {
        toast.error(data.message || 'No order found with this reference number');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to find order tracking details');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getTrackingStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed':
      case 'Processing': return 2;
      case 'In Transit':
      case 'Ready for Collection': return 3;
      case 'Delivered':
      case 'Collected': return 4;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-gray-200/80">
          <div>
            <Link to="/digital-clinic/e-pharmacy" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5 mb-2">
              <ArrowLeft size={15} /> Back to Pharmacy Store
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">My Pharmacy Orders</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Track medication deliveries, view courier assignments, and manage your orders</p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Orders
          </button>
        </div>

        {/* ──────────────── My Orders List ──────────────── */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">Your Recent Orders</h2>
              <p className="text-xs text-gray-500">Overview of all medications ordered via your account</p>
            </div>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {orders.length} order{orders.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading your pharmacy orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
              <Package size={48} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No pharmacy orders found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                You haven't ordered any medications yet or your orders have not been placed.
              </p>
              <Link
                to="/digital-clinic/e-pharmacy"
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-blue-600 transition shadow-sm"
              >
                Browse Medications Store
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 p-5 shadow-xs hover:shadow-md transition duration-200"
                >
                  {/* Card Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 text-primary rounded-xl shrink-0">
                        <Package size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-gray-900">{order.orderNumber}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                            {order.orderStatus}
                          </span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {order.paymentStatus === 'Paid' ? '✓ Paid' : 'Pending Payment'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <Calendar size={13} /> {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                      <div>
                        <span className="text-[11px] text-gray-400 block font-medium">Fulfillment</span>
                        <span className="text-xs font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                          {order.fulfillmentType === 'home_delivery' ? (
                            <>
                              <Truck size={14} className="text-blue-600" /> Home Delivery
                            </>
                          ) : (
                            <>
                              <Building2 size={14} className="text-emerald-600" /> Facility Collection
                            </>
                          )}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-gray-400 block font-medium">Payment</span>
                        <span className="text-xs font-semibold text-gray-800 uppercase">
                          {order.paymentMethod.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-gray-400 block font-medium">Total</span>
                        <span className="text-base font-extrabold text-primary">
                          ₦{order.totalAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <button
                          onClick={() => setTrackingModalOrder(order)}
                          className="px-3.5 py-2 bg-gradient-to-r from-primary to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Compass size={14} /> Track Live
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={14} /> Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ──────────────── Assigned Courier & Dispatcher Information Banner ──────────────── */}
                  {(order.courierInfo?.courierName || order.courierInfo?.courierPhone || order.courierInfo?.trackingCode) && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                          <Truck size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-900 block">Assigned Dispatcher / Courier</span>
                          <div className="flex items-center gap-2 flex-wrap mt-0.5">
                            <span className="font-bold text-gray-900 text-xs">
                              {order.courierInfo.courierName || 'eDokta Delivery Partner'}
                            </span>
                            {order.courierInfo.courierPhone && (
                              <a
                                href={`tel:${order.courierInfo.courierPhone}`}
                                className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] transition border border-emerald-200"
                              >
                                <Phone size={11} /> Call Rider: {order.courierInfo.courierPhone}
                              </a>
                            )}
                            {order.courierInfo.trackingCode && (
                              <span className="font-mono text-gray-600 font-semibold bg-white/80 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                                Code: {order.courierInfo.trackingCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {order.courierInfo.estimatedDelivery && (
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block font-semibold">Estimated Arrival</span>
                          <span className="font-bold text-blue-700">{order.courierInfo.estimatedDelivery}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ──────────────── Status Update Note (For Patient) ──────────────── */}
                  {order.trackingNotes && (
                    <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-amber-950 block">Status Note from Dispensary:</strong>
                        <p className="mt-0.5 leading-relaxed">{order.trackingNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* Items preview */}
                  <div className="pt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="font-semibold text-gray-800">Items ({order.items?.length}):</span>
                    {order.items?.map((it, idx) => (
                      <span key={idx} className="bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5">
                        <span className="font-medium text-gray-800">{it.name}</span>
                        <strong className="text-primary font-bold">×{it.quantity}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ──────────────── LIVE ORDER TRACKING MODAL ──────────────── */}
        {trackingModalOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 my-auto animate-in fade-in duration-200">
              {/* Sticky Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 text-primary rounded-xl shrink-0">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Live Order Tracking</h3>
                    <p className="text-xs font-mono text-primary font-bold">{trackingModalOrder.orderNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setTrackingModalOrder(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {/* Status & Payment banner */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Current Status</span>
                    <strong className="text-xs sm:text-sm font-bold text-gray-900">{trackingModalOrder.orderStatus}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      trackingModalOrder.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {trackingModalOrder.paymentStatus === 'Paid' ? '✓ Paid' : 'Pending'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[trackingModalOrder.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {trackingModalOrder.orderStatus}
                    </span>
                  </div>
                </div>

                {/* 4-Step Compact Visual Timeline Tracker */}
                <div className="relative py-2 px-2">
                  <div className="absolute left-6 top-5 bottom-5 w-0.5 bg-gray-200" />
                  {[
                    { step: 1, title: 'Order Placed', desc: 'Order received and logged in system' },
                    { step: 2, title: 'Pharmacist Processing', desc: 'Medications inspected, verified, and packaged' },
                    { 
                      step: 3, 
                      title: trackingModalOrder.fulfillmentType === 'home_delivery' ? 'Out for Delivery' : 'Ready for Collection', 
                      desc: trackingModalOrder.fulfillmentType === 'home_delivery' ? 'Courier dispatched with rider to your address' : 'Ready for pickup at clinic counter' 
                    },
                    { 
                      step: 4, 
                      title: trackingModalOrder.fulfillmentType === 'home_delivery' ? 'Delivered' : 'Collected', 
                      desc: 'Order successfully delivered to recipient' 
                    }
                  ].map((item) => {
                    const currentStep = getTrackingStepIndex(trackingModalOrder.orderStatus);
                    const isComplete = currentStep >= item.step;
                    const isCurrent = currentStep === item.step;

                    return (
                      <div key={item.step} className="relative flex items-start gap-3 mb-3.5 last:mb-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                          isComplete
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : isCurrent
                            ? 'bg-primary text-white ring-4 ring-blue-100 shadow-sm animate-pulse'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isComplete ? <Check size={15} /> : <span className="font-bold text-xs">{item.step}</span>}
                        </div>

                        <div className="pt-0.5">
                          <h5 className={`text-xs sm:text-sm font-bold ${isComplete || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                            {item.title}
                          </h5>
                          <p className="text-[11px] text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ──────────────── Assigned Courier & Tracking Details ──────────────── */}
                {(trackingModalOrder.courierInfo?.courierName || trackingModalOrder.courierInfo?.courierPhone || trackingModalOrder.courierInfo?.trackingCode) && (
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 uppercase tracking-wider">
                      <Truck size={15} className="text-primary" /> Courier & Dispatch Details
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                      <div>
                        <span className="text-gray-500 block text-[10px]">Courier / Rider:</span>
                        <strong className="text-gray-900 text-xs">{trackingModalOrder.courierInfo.courierName || 'eDokta Rider'}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Tracking Number:</span>
                        <strong className="text-primary font-mono text-xs">{trackingModalOrder.courierInfo.trackingCode || 'N/A'}</strong>
                      </div>
                    </div>

                    {trackingModalOrder.courierInfo.courierPhone && (
                      <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                        <span className="text-gray-600 font-medium text-[11px]">Rider Phone Number:</span>
                        <a
                          href={`tel:${trackingModalOrder.courierInfo.courierPhone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition"
                        >
                          <Phone size={12} /> Call Rider: {trackingModalOrder.courierInfo.courierPhone}
                        </a>
                      </div>
                    )}

                    {trackingModalOrder.courierInfo.estimatedDelivery && (
                      <p className="text-[11px] text-blue-700 font-medium pt-1 border-t border-blue-100">
                        ⏱️ Estimated Delivery: <strong>{trackingModalOrder.courierInfo.estimatedDelivery}</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* ──────────────── Status Update Note (For Patient) ──────────────── */}
                {trackingModalOrder.trackingNotes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs">
                    <strong className="text-amber-950 block font-bold mb-1 flex items-center gap-1.5 text-[11px]">
                      <AlertCircle size={14} className="text-amber-600" /> Status Update Note from Dispatcher:
                    </strong>
                    <p className="text-amber-900 leading-relaxed font-medium bg-white/70 p-2.5 rounded-xl border border-amber-100 text-xs">
                      {trackingModalOrder.trackingNotes}
                    </p>
                  </div>
                )}

                {/* Destination / Pickup Info */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-0.5">
                  {trackingModalOrder.fulfillmentType === 'home_delivery' ? (
                    <>
                      <strong className="text-gray-900 block font-semibold flex items-center gap-1.5 text-[11px]">
                        <MapPin size={13} className="text-primary" /> Delivery Destination:
                      </strong>
                      <p className="text-gray-700">{trackingModalOrder.deliveryAddress?.address}, {trackingModalOrder.deliveryAddress?.city}</p>
                      <p className="text-gray-500 text-[10px]">Recipient: {trackingModalOrder.customer?.name} ({trackingModalOrder.customer?.phone})</p>
                    </>
                  ) : (
                    <>
                      <strong className="text-gray-900 block font-semibold flex items-center gap-1.5 text-[11px]">
                        <Building2 size={13} className="text-emerald-600" /> Pickup Facility:
                      </strong>
                      <p className="text-gray-800 font-medium">{trackingModalOrder.collectionFacility?.facilityName}</p>
                      <p className="text-gray-600 text-[10px]">{trackingModalOrder.collectionFacility?.facilityAddress}</p>
                    </>
                  )}
                </div>

                {/* Complete Status History Log */}
                {trackingModalOrder.statusHistory?.length > 0 && (
                  <div className="border border-gray-100 rounded-2xl p-3 bg-white">
                    <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">Detailed Tracking Log</h4>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 divide-y divide-gray-50 text-xs">
                      {trackingModalOrder.statusHistory.slice().reverse().map((h, idx) => (
                        <div key={idx} className="pt-1.5 first:pt-0">
                          <div className="flex items-center justify-between text-gray-700">
                            <span className="font-bold text-gray-900 text-[11px]">{h.status}</span>
                            <span className="text-[9px] text-gray-400">
                              {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(h.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          {h.note && <p className="text-[10px] text-gray-500 mt-0.5">{h.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Footer */}
              <div className="p-3 border-t border-gray-100 bg-white shrink-0">
                <button
                  onClick={() => setTrackingModalOrder(null)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Close Tracking Window
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ──────────────── Selected Order Detail Modal (Receipt) ──────────────── */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 my-auto animate-in fade-in duration-200">
              {/* Sticky Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Order Invoice & Summary</span>
                  <h3 className="font-mono text-base font-bold text-gray-900">{selectedOrder.orderNumber}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {/* Status Header */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Current Status</span>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{selectedOrder.orderStatus}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[selectedOrder.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {selectedOrder.paymentStatus === 'Paid' ? '✓ Paid' : 'Pending'}
                  </span>
                </div>

                {/* Courier info in Details modal if assigned */}
                {(selectedOrder.courierInfo?.courierName || selectedOrder.courierInfo?.courierPhone || selectedOrder.courierInfo?.trackingCode) && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-1.5">
                    <strong className="block font-bold mb-1 flex items-center gap-1.5 text-primary text-[11px]">
                      <Truck size={14} /> Courier / Dispatch Information:
                    </strong>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-semibold text-gray-900 text-xs">
                        {selectedOrder.courierInfo.courierName || 'eDokta Courier'} 
                        {selectedOrder.courierInfo.trackingCode && (
                          <span className="ml-2 font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                            Code: {selectedOrder.courierInfo.trackingCode}
                          </span>
                        )}
                      </p>
                      {selectedOrder.courierInfo.courierPhone && (
                        <a
                          href={`tel:${selectedOrder.courierInfo.courierPhone}`}
                          className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] transition border border-emerald-200"
                        >
                          <Phone size={11} /> Call: {selectedOrder.courierInfo.courierPhone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Dispatch note in Details modal */}
                {selectedOrder.trackingNotes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                    <strong className="block font-bold mb-0.5 text-[11px]">Dispensary Update Note:</strong>
                    <p className="text-xs">{selectedOrder.trackingNotes}</p>
                  </div>
                )}

                {/* Delivery / Facility info */}
                <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs space-y-1">
                  {selectedOrder.fulfillmentType === 'home_delivery' ? (
                    <>
                      <strong className="text-blue-900 block font-semibold flex items-center gap-1 text-[11px]">
                        <Truck size={13} /> Home Delivery Address
                      </strong>
                      <p className="text-blue-800">{selectedOrder.deliveryAddress?.address}, {selectedOrder.deliveryAddress?.city}</p>
                      {selectedOrder.deliveryAddress?.deliveryNotes && (
                        <p className="text-blue-600 italic mt-0.5 text-[10px]">Note: {selectedOrder.deliveryAddress.deliveryNotes}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <strong className="text-emerald-900 block font-semibold flex items-center gap-1 text-[11px]">
                        <Building2 size={13} /> Clinic Facility Pickup Location
                      </strong>
                      <p className="text-emerald-800 font-bold">{selectedOrder.collectionFacility?.facilityName}</p>
                      <p className="text-emerald-700 text-[10px]">{selectedOrder.collectionFacility?.facilityAddress}</p>
                    </>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">Ordered Medications</h4>
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl p-2.5 bg-white">
                    {selectedOrder.items?.map((it, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between items-center first:pt-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-gray-800 text-xs">{it.name}</p>
                          <span className="text-[10px] text-gray-400">{it.strength} • {it.dosageForm}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500 font-medium text-[11px]">{it.quantity} × ₦{it.price?.toLocaleString()}</span>
                          <p className="font-bold text-gray-900 text-xs">₦{(it.price * it.quantity)?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total breakdown */}
                <div className="pt-2 border-t border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-gray-800">₦{selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-gray-800">₦{selectedOrder.deliveryFee?.toLocaleString()}</span>
                  </div>
                  <div className="pt-1.5 border-t border-gray-200 flex justify-between font-bold text-xs text-gray-900">
                    <span>Total Amount:</span>
                    <span className="text-primary font-extrabold text-sm">₦{selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-3 border-t border-gray-100 bg-white shrink-0 flex gap-2">
                <button
                  onClick={() => {
                    const ord = selectedOrder;
                    setSelectedOrder(null);
                    setTrackingModalOrder(ord);
                  }}
                  className="flex-1 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Compass size={15} /> Open Live Tracking
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyPharmacyOrders;
