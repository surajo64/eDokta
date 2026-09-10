import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search, ShoppingCart, Filter, ShieldCheck, Truck, Clock,
  CheckCircle2, AlertTriangle, X, Plus, Minus, Eye, ArrowRight,
  Package, MapPin, CreditCard, Building2, FileText, Upload,
  ExternalLink, ChevronRight, Phone, Mail, User, RotateCcw,
  Sparkles, Check, HelpCircle
} from 'lucide-react';

const CATEGORIES = [
  "All",
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

const FACILITIES = [
  {
    name: "eDokta Central Pharmacy & Diagnostic Hub",
    address: "Plot 14 Healthcare Avenue, Phase 2, Abuja Central",
    pickupHours: "Mon - Sat: 8:00 AM - 9:00 PM, Sun: 10:00 AM - 6:00 PM"
  },
  {
    name: "eDokta Clinic & Dispensary (Kano Branch)",
    address: "22 Airport Road, Nassarawa GRA, Kano",
    pickupHours: "Mon - Sat: 8:30 AM - 8:30 PM"
  },
  {
    name: "eDokta Medical Center (Lagos Island Hub)",
    address: "18 Adeola Odeku Street, Victoria Island, Lagos",
    pickupHours: "Mon - Sun: 24/7 Available"
  }
];

const Pharmacy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { backendUrl, token, userData, setShowLogin } = useContext(AppContext);

  // Catalog state
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState('all'); // all | otc | rx
  const [sortBy, setSortBy] = useState('');

  // Cart state (stored in localStorage for persistence)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('edokta_pharmacy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Drug Detail Modal state
  const [selectedDrug, setSelectedDrug] = useState(null);

  // Checkout Modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Info, 2: Delivery/Collection, 3: Rx (if needed), 4: Payment
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Form data for checkout
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    fulfillmentType: 'home_delivery', // 'home_delivery' | 'facility_collection'
    deliveryAddress: {
      address: '',
      city: '',
      state: 'Nigeria',
      deliveryNotes: ''
    },
    collectionFacility: FACILITIES[0],
    paymentMethod: 'pay_on_delivery', // 'paystack' | 'pay_on_delivery' | 'pay_on_collection'
  });
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);

  // Tracking Modal state
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [pendingCheckoutLogin, setPendingCheckoutLogin] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('edokta_pharmacy_cart', JSON.stringify(cart));
  }, [cart]);

  // Resume checkout smoothly after login or registration without losing any typed data
  useEffect(() => {
    if (token) {
      if (pendingCheckoutLogin) {
        setIsCheckoutOpen(true);
        setIsCartOpen(false);
        setPendingCheckoutLogin(false);
        toast.success(`Welcome${userData?.name ? ', ' + userData.name : ''}! You can now complete your checkout.`);
      }
    }
  }, [token, pendingCheckoutLogin, userData]);

  // Autofill user details if logged in without overwriting user's active inputs
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || userData.name || '',
        customerEmail: prev.customerEmail || userData.email || '',
        customerPhone: prev.customerPhone || userData.phone || '',
        deliveryAddress: {
          ...prev.deliveryAddress,
          address: prev.deliveryAddress.address || userData.address?.line1 || '',
          city: prev.deliveryAddress.city || userData.address?.line2 || '',
        }
      }));
    }
  }, [userData]);

  // Listen for Paystack redirect callbacks and verify automatically
  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const orderRef = searchParams.get('orderRef');
    const payment = searchParams.get('payment');

    if (reference || (orderRef && payment === 'success')) {
      const verifyPayment = async () => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/pharmacy/verify-payment`, {
            reference: reference || '',
            orderNumber: orderRef || ''
          });
          if (data.success) {
            toast.success(`Payment Confirmed! Your order ${data.order?.orderNumber || orderRef} is paid and confirmed.`);
            clearCart();
            if (data.order) {
              setTrackedOrder(data.order);
              setIsTrackingOpen(true);
            }
            navigate('/digital-clinic/e-pharmacy', { replace: true });
          }
        } catch (err) {
          console.error('Payment verification callback error:', err);
        }
      };
      verifyPayment();
    }
  }, [searchParams]);

  // Fetch medicines catalog
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (prescriptionFilter !== 'all') params.prescriptionType = prescriptionFilter;
      if (sortBy) params.sort = sortBy;

      const { data } = await axios.get(`${backendUrl}/api/pharmacy/medicines`, { params });
      if (data.success) {
        setMedicines(data.medicines);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load medicine catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [selectedCategory, prescriptionFilter, sortBy]);

  // Check URL params for order payment callback
  useEffect(() => {
    const orderRef = searchParams.get('orderRef');
    const payment = searchParams.get('payment');
    if (orderRef && payment === 'success') {
      toast.success(`Order ${orderRef} payment successful!`);
      // Auto open tracking
      setTrackingNumberInput(orderRef);
      setIsTrackingOpen(true);
      trackOrder(orderRef);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMedicines();
  };

  // Cart operations
  const addToCart = (medicine, quantity = 1) => {
    if (medicine.stock <= 0) {
      toast.error('This medicine is currently out of stock.');
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.medicineId === medicine._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > medicine.stock) {
          toast.warning(`Only ${medicine.stock} units available in stock.`);
          return prevCart.map(item =>
            item.medicineId === medicine._id ? { ...item, quantity: medicine.stock } : item
          );
        }
        toast.success(`Updated ${medicine.name} quantity to ${newQty}`);
        return prevCart.map(item =>
          item.medicineId === medicine._id ? { ...item, quantity: newQty } : item
        );
      } else {
        toast.success(`Added ${medicine.name} to cart`);
        return [
          ...prevCart,
          {
            medicineId: medicine._id,
            name: medicine.name,
            genericName: medicine.genericName,
            price: medicine.price,
            quantity: Math.min(quantity, medicine.stock),
            dosageForm: medicine.dosageForm,
            strength: medicine.strength,
            image: medicine.image,
            requiresPrescription: medicine.requiresPrescription,
            maxStock: medicine.stock
          }
        ];
      }
    });
  };

  const updateCartQuantity = (medicineId, change) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.medicineId === medicineId) {
            const newQty = item.quantity + change;
            if (newQty > item.maxStock) {
              toast.warning(`Maximum available stock is ${item.maxStock}`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (medicineId) => {
    setCart(prev => prev.filter(item => item.medicineId !== medicineId));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasRxItem = cart.some(item => item.requiresPrescription);
  const deliveryFee = formData.fulfillmentType === 'home_delivery' ? 1500 : 0;
  const orderTotal = cartSubtotal + deliveryFee;

  // Handle file select
  const handlePrescriptionChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescriptionFile(file);
      setPrescriptionPreview(URL.createObjectURL(file));
    }
  };

  // Proceed to Checkout with mandatory login check & preservation of cart data
  const handleProceedToCheckout = () => {
    if (!token) {
      setPendingCheckoutLogin(true);
      setShowLogin(true);
      toast.info('Please sign in or register to complete your checkout. Your cart is preserved.');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCheckoutStep(1);
    setOrderConfirmed(null);
  };

  // Checkout submission
  const handlePlaceOrder = async () => {
    if (!token) {
      setPendingCheckoutLogin(true);
      setShowLogin(true);
      toast.info('Please sign in or register to finish placing your order. All your checkout information has been saved.');
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error('Please complete all contact information');
      setCheckoutStep(1);
      return;
    }

    if (formData.fulfillmentType === 'home_delivery' && !formData.deliveryAddress.address) {
      toast.error('Please provide your complete delivery address');
      setCheckoutStep(2);
      return;
    }

    if (hasRxItem && !prescriptionFile) {
      toast.warning('A doctor prescription is required for one or more medications in your cart.');
      setCheckoutStep(3);
      return;
    }

    try {
      setSubmittingOrder(true);

      const orderData = new FormData();
      orderData.append('customerName', formData.customerName);
      orderData.append('customerEmail', formData.customerEmail);
      orderData.append('customerPhone', formData.customerPhone);
      orderData.append('fulfillmentType', formData.fulfillmentType);
      orderData.append('paymentMethod', formData.paymentMethod);
      orderData.append('items', JSON.stringify(cart));
      orderData.append('deliveryAddress', JSON.stringify(formData.deliveryAddress));
      orderData.append('collectionFacility', JSON.stringify(formData.collectionFacility));

      if (prescriptionFile) {
        orderData.append('prescription', prescriptionFile);
      }

      const headers = { 'Content-Type': 'multipart/form-data' };
      if (token) headers.token = token;

      const { data } = await axios.post(`${backendUrl}/api/pharmacy/order`, orderData, { headers });

      if (data.success) {
        // If Paystack online redirect
        if (formData.paymentMethod === 'paystack' && data.authorizationUrl) {
          toast.info('Redirecting to Paystack Secure Checkout...');
          clearCart();
          window.location.href = data.authorizationUrl;
          return;
        }

        // Pay on Delivery or Pay on Collection
        setOrderConfirmed(data.order);
        clearCart();
        toast.success(data.message || 'Order placed successfully!');
        fetchMedicines(); // Refresh stock counts
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Error processing order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Track order lookup
  const trackOrder = async (orderNum) => {
    const target = orderNum || trackingNumberInput;
    if (!target || !target.trim()) {
      toast.error('Please enter an order reference number');
      return;
    }

    try {
      setTrackingLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/pharmacy/track-order/${target.trim()}`);
      if (data.success) {
        setTrackedOrder(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order not found');
      setTrackedOrder(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  // Helper for tracking steps
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ──────────────── Top Navigation & Search Header ──────────────── */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-primary text-white pt-8 pb-14 px-4 sm:px-8 rounded-b-3xl shadow-xl relative overflow-hidden">
        {/* Background glowing orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top meta strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 text-xs sm:text-sm text-blue-100">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 font-medium text-emerald-300">
                <ShieldCheck size={16} /> 100% Genuine NAFDAC Approved
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <Truck size={16} /> Doorstep Delivery & Free Clinic Pickup
              </span>
              <span className="hidden lg:flex items-center gap-1.5">
                <Clock size={16} /> 24/7 Licensed Pharmacist Dispensary
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer"
              >
                <ShoppingCart size={14} /> Cart ({cartItemCount})
              </button>

              <button
                onClick={() => { setIsTrackingOpen(true); setTrackedOrder(null); }}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer"
              >
                <Package size={14} /> Track Your Order
              </button>

              {token && (
                <Link
                  to="/my-pharmacy-orders"
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-medium transition"
                >
                  <FileText size={14} /> My Orders
                </Link>
              )}
            </div>
          </div>

          {/* Hero Content */}
          <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4">
                <Sparkles size={14} className="text-yellow-300 animate-pulse" /> eDokta Verified E-Pharmacy Store
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Quality Healthcare & Medicines <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-teal-200 to-emerald-300">
                  Delivered or Picked Up In Minutes
                </span>
              </h1>
              <p className="mt-4 text-blue-100/90 text-sm sm:text-base leading-relaxed">
                Order authentic prescription medications, OTC remedies, vitamins, and healthcare essentials.
                Choose between doorstep delivery or free immediate collection at our facility.
              </p>
            </div>

            {/* Quick Stats / Highlights */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">5,000+</p>
                <p className="text-xs text-blue-200 mt-1">Authentic Drugs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-300">100%</p>
                <p className="text-xs text-blue-200 mt-1">NAFDAC Certified</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
                <p className="text-2xl sm:text-3xl font-bold text-teal-200">₦0</p>
                <p className="text-xs text-blue-200 mt-1">Facility Pickup Fee</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
                <p className="text-2xl sm:text-3xl font-bold text-yellow-300">24/7</p>
                <p className="text-xs text-blue-200 mt-1">Rx Verification</p>
              </div>
            </div>
          </div>

          {/* Search bar inside Hero */}
          <div className="mt-8 max-w-3xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medications by brand name, generic formula (e.g., Paracetamol, Amoxicillin)..."
                  className="w-full pl-12 pr-4 py-4 rounded-l-2xl text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base font-medium"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 sm:px-8 py-4 rounded-r-2xl transition duration-200 text-sm sm:text-base cursor-pointer flex items-center gap-2 shrink-0"
              >
                Search <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ──────────────── Main Catalog Layout ──────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20">
        {/* Category Carousel / Pills Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters & Control Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          {/* Rx vs OTC Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mr-2 flex items-center gap-1">
              <Filter size={14} /> Type:
            </span>
            <button
              onClick={() => setPrescriptionFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                prescriptionFilter === 'all'
                  ? 'bg-blue-50 text-primary border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Drugs
            </button>
            <button
              onClick={() => setPrescriptionFilter('otc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                prescriptionFilter === 'otc'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Over-The-Counter (OTC)
            </button>
            <button
              onClick={() => setPrescriptionFilter('rx')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                prescriptionFilter === 'rx'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Prescription Required (Rx)
            </button>
          </div>

          {/* Sort & Count */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-gray-500">
              Showing <strong className="text-gray-800">{medicines.length}</strong> medications
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* ──────────────── Medication Cards Grid ──────────────── */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm font-medium">Loading authentic medicines catalog...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl mt-6 border border-dashed border-gray-200 p-8">
            <Package size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No medications found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mt-1">
              We couldn't find any medications matching your search criteria. Try clearing filters or searching for generic chemical names.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setPrescriptionFilter('all'); fetchMedicines(); }}
              className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {medicines.map((med) => {
              const inCart = cart.find(i => i.medicineId === med._id);
              const isOutOfStock = med.stock <= 0;
              const isLowStock = med.stock > 0 && med.stock <= med.reorderLevel;

              return (
                <div
                  key={med._id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Top Badges & Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Rx vs OTC Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {med.requiresPrescription ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-xs">
                          Rx Required
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                          OTC Medicine
                        </span>
                      )}
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                          Only {med.stock} left
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => setSelectedDrug(med)}
                      className="absolute inset-x-4 bottom-3 bg-white/90 backdrop-blur-md text-gray-800 py-2 rounded-xl text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md hover:bg-white cursor-pointer"
                    >
                      <Eye size={14} /> View Details & Dosage
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-1">
                        <span>{med.category}</span>
                        <span>{med.dosageForm}</span>
                      </div>

                      <h3
                        onClick={() => setSelectedDrug(med)}
                        className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 hover:text-primary transition cursor-pointer"
                        title={med.name}
                      >
                        {med.name}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        Active: <span className="text-gray-700 font-medium">{med.genericName}</span> ({med.strength})
                      </p>

                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Pack: {med.packSize}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium block">Price</span>
                        <span className="text-lg font-extrabold text-gray-900">
                          ₦{med.price.toLocaleString()}
                        </span>
                      </div>

                      {inCart ? (
                        <div className="flex items-center gap-2 bg-blue-50 border border-primary/30 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateCartQuantity(med._id, -1)}
                            className="w-7 h-7 rounded-lg bg-white text-gray-700 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition shadow-xs cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-primary w-4 text-center">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(med._id, 1)}
                            disabled={inCart.quantity >= med.stock}
                            className="w-7 h-7 rounded-lg bg-white text-gray-700 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition shadow-xs cursor-pointer disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(med, 1)}
                          disabled={isOutOfStock}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                            isOutOfStock
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-primary hover:bg-blue-600 text-white hover:shadow-md'
                          }`}
                        >
                          <ShoppingCart size={14} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ──────────────── Floating Cart Indicator (Always Visible) ──────────────── */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-3 bg-gradient-to-r from-primary to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart size={22} />
            <span className={`absolute -top-2 -right-2 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
              cartItemCount > 0 ? 'bg-emerald-400 text-emerald-950 animate-pulse' : 'bg-white/20 text-white'
            }`}>
              {cartItemCount}
            </span>
          </div>
          <div className="text-left border-l border-white/20 pl-3">
            <span className="text-[11px] uppercase tracking-wider text-blue-200 block font-semibold">View Cart</span>
            <span className="text-sm font-extrabold">₦{cartSubtotal.toLocaleString()}</span>
          </div>
        </button>
      </div>

      {/* ──────────────── Slide-Out Cart Drawer ──────────────── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 text-primary rounded-xl">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Your Pharmacy Cart</h2>
                    <p className="text-xs text-gray-500">{cartItemCount} item{cartItemCount > 1 ? 's' : ''} in cart</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Rx Warning Banner if Rx items present */}
              {hasRxItem && (
                <div className="bg-amber-50 border-b border-amber-100 p-3.5 flex items-start gap-2.5 text-xs text-amber-800">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Doctor's Prescription Required</strong>
                    One or more items in your cart requires a valid prescription. You can upload it in the checkout screen.
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <div className="py-20 text-center text-gray-400">
                    <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold text-gray-600">Your cart is empty</p>
                    <p className="text-xs mt-1">Browse our medications catalog to add items.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.medicineId} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-xl bg-slate-100 p-1 shrink-0 border border-gray-100"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-gray-800 truncate" title={item.name}>
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.medicineId)}
                            className="text-gray-400 hover:text-red-500 text-xs transition cursor-pointer"
                          >
                            <X size={15} />
                          </button>
                        </div>

                        <p className="text-[11px] text-gray-500">{item.strength} • {item.dosageForm}</p>

                        {item.requiresPrescription && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            Rx Required
                          </span>
                        )}

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.medicineId, -1)}
                              className="w-6 h-6 rounded bg-white text-gray-700 flex items-center justify-center hover:bg-gray-200 transition text-xs font-bold shadow-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-gray-800 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.medicineId, 1)}
                              className="w-6 h-6 rounded bg-white text-gray-700 flex items-center justify-center hover:bg-gray-200 transition text-xs font-bold shadow-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-sm font-bold text-gray-900">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">₦{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Pickup at Facility</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Home Delivery (Nationwide)</span>
                    <span className="font-semibold text-gray-800">₦1,500</span>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">Estimated Total</span>
                    <span className="text-lg font-extrabold text-primary">
                      ₦{(cartSubtotal + (formData.fulfillmentType === 'home_delivery' ? 1500 : 0)).toLocaleString()}
                    </span>
                  </div>

                  {!token && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-center justify-between gap-2">
                      <span className="font-medium">You must be logged in to checkout.</span>
                      <button
                        onClick={() => setShowLogin(true)}
                        className="font-bold text-primary hover:underline shrink-0 cursor-pointer"
                      >
                        Login Now →
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-primary hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Proceed to Checkout <ChevronRight size={18} />
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition py-1 cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── Comprehensive Multi-Step Checkout Modal ──────────────── */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            {orderConfirmed ? (
              /* Order Confirmation Success Screen */
              <div className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Order Placed Successfully!</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Your order reference number is:
                </p>
                <div className="my-4 inline-block px-5 py-2.5 bg-blue-50 border border-blue-200 text-primary font-mono text-lg font-bold rounded-2xl tracking-wider">
                  {orderConfirmed.orderNumber}
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl text-left text-xs text-gray-600 space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span>Fulfillment:</span>
                    <strong className="text-gray-800 capitalize">
                      {orderConfirmed.fulfillmentType === 'home_delivery' ? 'Home Delivery' : 'Collect at Facility'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <strong className="text-gray-800 uppercase">{orderConfirmed.paymentMethod.replace(/_/g, ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <strong className="text-gray-900 font-bold">₦{orderConfirmed.totalAmount.toLocaleString()}</strong>
                  </div>
                  {orderConfirmed.fulfillmentType === 'facility_collection' && (
                    <div className="pt-2 border-t border-gray-200 text-emerald-700 font-medium">
                      📍 Collection Location: {orderConfirmed.collectionFacility?.facilityName || 'eDokta Central Dispensary'}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsTrackingOpen(true);
                      trackOrder(orderConfirmed.orderNumber);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Package size={16} /> Track Order Progress
                  </button>

                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              /* Multi-step Checkout Form */
              <div>
                {/* Top header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg">eDokta Pharmacy Checkout</h3>
                    <p className="text-xs text-gray-500">Step {checkoutStep} of {hasRxItem ? 4 : 3}</p>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Stepper Progress Bar */}
                <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${checkoutStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${checkoutStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</span>
                    Customer Info
                  </div>
                  <div className={`h-0.5 flex-1 mx-2 ${checkoutStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
                  <div className={`flex items-center gap-2 text-xs font-semibold ${checkoutStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${checkoutStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</span>
                    Fulfillment
                  </div>
                  {hasRxItem && (
                    <>
                      <div className={`h-0.5 flex-1 mx-2 ${checkoutStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
                      <div className={`flex items-center gap-2 text-xs font-semibold ${checkoutStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${checkoutStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</span>
                        Prescription
                      </div>
                    </>
                  )}
                  <div className={`h-0.5 flex-1 mx-2 ${checkoutStep === (hasRxItem ? 4 : 3) ? 'bg-primary' : 'bg-gray-200'}`} />
                  <div className={`flex items-center gap-2 text-xs font-semibold ${checkoutStep === (hasRxItem ? 4 : 3) ? 'text-primary' : 'text-gray-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${checkoutStep === (hasRxItem ? 4 : 3) ? 'bg-primary text-white' : 'bg-gray-200'}`}>{hasRxItem ? 4 : 3}</span>
                    Payment
                  </div>
                </div>

                {/* Step Contents */}
                <div className="p-6">
                  {/* Step 1: Customer Contact Info */}
                  {checkoutStep === 1 && (
                    <div className="space-y-4">
                      {!token && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                          <div>
                            <strong className="text-blue-900 block font-bold">Have an account or need to register?</strong>
                            <span className="text-blue-700">Log in or create an account to easily track your orders.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setPendingCheckoutLogin(true); setShowLogin(true); }}
                            className="px-3.5 py-1.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition shrink-0 cursor-pointer shadow-xs text-xs"
                          >
                            Sign In / Register
                          </button>
                        </div>
                      )}

                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <User size={16} className="text-primary" /> Contact & Delivery Information
                      </h4>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Patient / Recipient Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          placeholder="e.g. Aisha Bello"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                            placeholder="aisha@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number (For Delivery/Call) *</label>
                          <input
                            type="tel"
                            required
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                            placeholder="08012345678"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
                              toast.error('Please complete all contact fields.');
                              return;
                            }
                            setCheckoutStep(2);
                          }}
                          className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center gap-1.5"
                        >
                          Next: Delivery Method <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Fulfillment Method (Home Delivery vs Facility Collection) */}
                  {checkoutStep === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <MapPin size={16} className="text-primary" /> Choose Fulfillment Option
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Home Delivery Card */}
                        <div
                          onClick={() => setFormData({ ...formData, fulfillmentType: 'home_delivery' })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            formData.fulfillmentType === 'home_delivery'
                              ? 'border-primary bg-blue-50/50 ring-2 ring-blue-100'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Truck size={22} className={formData.fulfillmentType === 'home_delivery' ? 'text-primary' : 'text-gray-400'} />
                              <span className="text-xs font-bold text-gray-800">₦1,500</span>
                            </div>
                            <h5 className="font-bold text-gray-900 text-sm">Doorstep Home Delivery</h5>
                            <p className="text-xs text-gray-500 mt-1">
                              Temperature-controlled packaging dispatched to your home or office address.
                            </p>
                          </div>
                          <span className="text-[11px] text-blue-600 font-semibold mt-3 block">Est. 2-24 Hours</span>
                        </div>

                        {/* Facility Collection Card */}
                        <div
                          onClick={() => setFormData({ ...formData, fulfillmentType: 'facility_collection' })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            formData.fulfillmentType === 'facility_collection'
                              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Building2 size={22} className={formData.fulfillmentType === 'facility_collection' ? 'text-emerald-600' : 'text-gray-400'} />
                              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">FREE</span>
                            </div>
                            <h5 className="font-bold text-gray-900 text-sm">Pay / Collect at Facility</h5>
                            <p className="text-xs text-gray-500 mt-1">
                              Pick up directly from our clinic counter or dispensary with zero delivery fee.
                            </p>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-semibold mt-3 block">Ready in 30 Minutes</span>
                        </div>
                      </div>

                      {/* Detail inputs based on selected fulfillment */}
                      {formData.fulfillmentType === 'home_delivery' ? (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 mt-4">
                          <label className="block text-xs font-bold text-gray-700">Delivery Address *</label>
                          <input
                            type="text"
                            required
                            value={formData.deliveryAddress.address}
                            onChange={(e) => setFormData({
                              ...formData,
                              deliveryAddress: { ...formData.deliveryAddress, address: e.target.value }
                            })}
                            placeholder="House / Street address, landmark"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">City / Town</label>
                              <input
                                type="text"
                                value={formData.deliveryAddress.city}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  deliveryAddress: { ...formData.deliveryAddress, city: e.target.value }
                                })}
                                placeholder="e.g. Abuja"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Delivery Notes (Optional)</label>
                              <input
                                type="text"
                                value={formData.deliveryAddress.deliveryNotes}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  deliveryAddress: { ...formData.deliveryAddress, deliveryNotes: e.target.value }
                                })}
                                placeholder="Call before arriving"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3 mt-4">
                          <label className="block text-xs font-bold text-emerald-900">Select Collection Facility Location *</label>
                          <div className="space-y-2">
                            {FACILITIES.map((fac, idx) => (
                              <label
                                key={idx}
                                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                  formData.collectionFacility?.name === fac.name
                                    ? 'bg-white border-emerald-500 shadow-xs'
                                    : 'bg-white/50 border-emerald-100 hover:bg-white'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="facility"
                                  checked={formData.collectionFacility?.name === fac.name}
                                  onChange={() => setFormData({ ...formData, collectionFacility: fac })}
                                  className="mt-1 text-emerald-600"
                                />
                                <div className="text-xs">
                                  <strong className="text-gray-900 block font-semibold">{fac.name}</strong>
                                  <p className="text-gray-500 mt-0.5">{fac.address}</p>
                                  <span className="text-[10px] text-emerald-700 font-medium">{fac.pickupHours}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(1)}
                          className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.fulfillmentType === 'home_delivery' && !formData.deliveryAddress.address) {
                              toast.error('Please enter your delivery street address');
                              return;
                            }
                            setCheckoutStep(hasRxItem ? 3 : 4);
                          }}
                          className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center gap-1.5"
                        >
                          Next: {hasRxItem ? 'Upload Prescription' : 'Payment Method'} <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Prescription Upload (If Rx required items exist) */}
                  {checkoutStep === 3 && hasRxItem && (
                    <div className="space-y-4">
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <AlertTriangle size={15} /> Prescription Verification Required
                        </h4>
                        <p className="text-xs text-amber-800">
                          In compliance with pharmacy regulations, prescription medications require an authentic doctor's prescription before dispensing.
                        </p>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 hover:border-primary rounded-2xl p-6 text-center cursor-pointer relative bg-gray-50 transition">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handlePrescriptionChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {prescriptionPreview ? (
                          <div>
                            <img
                              src={prescriptionPreview}
                              alt="Prescription preview"
                              className="max-h-44 mx-auto rounded-xl shadow-md mb-2 object-contain"
                            />
                            <p className="text-xs font-semibold text-emerald-600">File Selected: {prescriptionFile?.name}</p>
                            <span className="text-[11px] text-gray-400">Click to replace file</span>
                          </div>
                        ) : (
                          <div>
                            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm font-bold text-gray-800">Upload Prescription Slip / Photo</p>
                            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF (Max 5MB)</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(2)}
                          className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!prescriptionFile) {
                              toast.warning('Please upload your prescription document or photo.');
                              return;
                            }
                            setCheckoutStep(4);
                          }}
                          className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center gap-1.5"
                        >
                          Next: Payment <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Payment Method Selection */}
                  {checkoutStep === (hasRxItem ? 4 : 3) && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <CreditCard size={16} className="text-primary" /> Select Payment Method
                      </h4>

                      <div className="space-y-2.5">
                        {/* Pay Online (Paystack) */}
                        <label
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                            formData.paymentMethod === 'paystack'
                              ? 'border-primary bg-blue-50/50 ring-2 ring-blue-100'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={formData.paymentMethod === 'paystack'}
                              onChange={() => setFormData({ ...formData, paymentMethod: 'paystack' })}
                              className="text-primary"
                            />
                            <div>
                              <strong className="text-sm font-bold text-gray-900 block">Pay Online (Card / Bank Transfer / USSD)</strong>
                              <span className="text-xs text-gray-500">Fast, instant confirmation via secure Paystack gateway</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-blue-600">Secure</span>
                        </label>

                        {/* Pay on Delivery (For Home Delivery) */}
                        {formData.fulfillmentType === 'home_delivery' && (
                          <label
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                              formData.paymentMethod === 'pay_on_delivery'
                                ? 'border-primary bg-blue-50/50 ring-2 ring-blue-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="paymentMethod"
                                checked={formData.paymentMethod === 'pay_on_delivery'}
                                onChange={() => setFormData({ ...formData, paymentMethod: 'pay_on_delivery' })}
                                className="text-primary"
                              />
                              <div>
                                <strong className="text-sm font-bold text-gray-900 block">Pay on Delivery (Cash / POS)</strong>
                                <span className="text-xs text-gray-500">Pay when the dispatcher arrives at your doorstep</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-600">Flexible</span>
                          </label>
                        )}

                        {/* Pay on Collection (For Facility Pickup) */}
                        {formData.fulfillmentType === 'facility_collection' && (
                          <label
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                              formData.paymentMethod === 'pay_on_collection'
                                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="paymentMethod"
                                checked={formData.paymentMethod === 'pay_on_collection'}
                                onChange={() => setFormData({ ...formData, paymentMethod: 'pay_on_collection' })}
                                className="text-emerald-600"
                              />
                              <div>
                                <strong className="text-sm font-bold text-gray-900 block">Pay on Collection (At Facility Counter)</strong>
                                <span className="text-xs text-gray-500">Pay via Cash, POS, or Transfer at our pharmacy desk upon pickup</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-600">At Counter</span>
                          </label>
                        )}
                      </div>

                      {/* Order Summary Recap */}
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mt-4 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>Items Subtotal ({cartItemCount} items):</span>
                          <span className="font-semibold text-gray-800">₦{cartSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery Fee ({formData.fulfillmentType === 'home_delivery' ? 'Doorstep' : 'Facility Pickup'}):</span>
                          <span className="font-semibold text-gray-800">{deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                          <span>Total to Pay:</span>
                          <span className="text-primary text-base">₦{orderTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {!token && (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs mt-3">
                          <div className="flex items-center gap-2 text-amber-900">
                            <AlertTriangle size={18} className="shrink-0 text-amber-600" />
                            <div>
                              <strong className="block font-bold">Authentication Required</strong>
                              <span>Sign in or register to complete and track your order.</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setPendingCheckoutLogin(true); setShowLogin(true); }}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shrink-0 cursor-pointer text-xs shadow-xs"
                          >
                            Sign In / Register
                          </button>
                        </div>
                      )}

                      <div className="pt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(hasRxItem ? 3 : 2)}
                          className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          disabled={submittingOrder}
                          onClick={handlePlaceOrder}
                          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm transition cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                          {submittingOrder ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Placing Order...
                            </>
                          ) : (
                            <>
                              Confirm & Place Order <Check size={18} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────── Drug Clinical Detail Modal ──────────────── */}
      {selectedDrug && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            <div className="relative p-6 sm:p-8">
              <button
                onClick={() => setSelectedDrug(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Drug Image */}
                <div className="w-full sm:w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center p-4 shrink-0">
                  <img
                    src={selectedDrug.image}
                    alt={selectedDrug.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Main Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedDrug.requiresPrescription ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Prescription Required (Rx)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Over-the-Counter (OTC)
                      </span>
                    )}

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-primary border border-blue-200">
                      {selectedDrug.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 leading-snug">
                    {selectedDrug.name}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Generic: <span className="font-semibold text-gray-700">{selectedDrug.genericName}</span> • Strength: <span className="font-semibold text-gray-700">{selectedDrug.strength}</span>
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Dosage Form: <span className="text-gray-700">{selectedDrug.dosageForm}</span> • Pack Size: <span className="text-gray-700">{selectedDrug.packSize}</span>
                  </p>

                  {selectedDrug.nafdacRegNumber && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      NAFDAC Reg: {selectedDrug.nafdacRegNumber}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-2xl font-black text-gray-900">
                      ₦{selectedDrug.price.toLocaleString()}
                    </span>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      selectedDrug.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedDrug.stock > 0 ? `In Stock (${selectedDrug.stock} available)` : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedDrug, 1);
                        setSelectedDrug(null);
                        setIsCartOpen(true);
                      }}
                      disabled={selectedDrug.stock <= 0}
                      className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Medical Information Tabs / Sections */}
              <div className="mt-8 border-t border-gray-100 pt-6 space-y-4 text-xs">
                {selectedDrug.description && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedDrug.description}</p>
                  </div>
                )}

                {selectedDrug.indications && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Clinical Indications</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedDrug.indications}</p>
                  </div>
                )}

                {selectedDrug.dosageInstructions && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Dosage & Administration</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedDrug.dosageInstructions}</p>
                  </div>
                )}

                {selectedDrug.sideEffects && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Possible Side Effects</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedDrug.sideEffects}</p>
                  </div>
                )}

                {selectedDrug.storageInstructions && (
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Storage Instructions</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedDrug.storageInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── Real-Time Order Tracking Modal ──────────────── */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 my-auto animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-primary rounded-xl">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Track Pharmacy Order</h3>
                  <p className="text-xs text-gray-500">Live order status and dispatch updates</p>
                </div>
              </div>
              <button
                onClick={() => setIsTrackingOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

              {/* Order lookup input */}
              <div className="mt-5 flex gap-2">
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="Enter Order Number (e.g. ED-PH-123456)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono uppercase focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button
                  onClick={() => trackOrder()}
                  disabled={trackingLoading}
                  className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer disabled:opacity-50"
                >
                  {trackingLoading ? 'Checking...' : 'Track'}
                </button>
              </div>

              {/* Tracked Order Details */}
              {trackedOrder && (
                <div className="mt-6 space-y-6">
                  {/* Status Banner */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Order Number</span>
                      <strong className="text-sm font-mono text-gray-900">{trackedOrder.orderNumber}</strong>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trackedOrder.orderStatus === 'Delivered' || trackedOrder.orderStatus === 'Collected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : trackedOrder.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-primary'
                      }`}>
                        {trackedOrder.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Visual Timeline Tracker */}
                  <div className="relative py-4">
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />
                    {[
                      { step: 1, title: 'Order Placed', desc: 'Order received and logged in system' },
                      { step: 2, title: 'Pharmacist Processing', desc: 'Medications checked and packaged' },
                      { step: 3, title: trackedOrder.fulfillmentType === 'home_delivery' ? 'Out for Delivery' : 'Ready for Collection', desc: trackedOrder.fulfillmentType === 'home_delivery' ? 'Courier dispatched with your order' : 'Ready for pickup at our facility counter' },
                      { step: 4, title: trackedOrder.fulfillmentType === 'home_delivery' ? 'Delivered' : 'Collected', desc: 'Order successfully fulfilled' }
                    ].map((item) => {
                      const currentStep = getTrackingStepIndex(trackedOrder.orderStatus);
                      const isComplete = currentStep >= item.step;
                      const isCurrent = currentStep === item.step;

                      return (
                        <div key={item.step} className="relative flex items-start gap-4 mb-6 last:mb-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                            isComplete
                              ? 'bg-emerald-500 text-white shadow-md'
                              : isCurrent
                              ? 'bg-primary text-white ring-4 ring-blue-100 shadow-md animate-pulse'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {isComplete ? <Check size={20} /> : <span className="font-bold text-xs">{item.step}</span>}
                          </div>

                          <div className="pt-2">
                            <h5 className={`text-sm font-bold ${isComplete || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                              {item.title}
                            </h5>
                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Courier / Collection details */}
                  {(trackedOrder.courierInfo?.courierName || trackedOrder.courierInfo?.courierPhone || trackedOrder.courierInfo?.trackingCode) && (
                    <div className="bg-blue-50 p-3.5 rounded-xl text-xs text-blue-900 border border-blue-200 space-y-1.5">
                      <div>
                        <strong>Courier Dispatched:</strong> {trackedOrder.courierInfo.courierName || 'eDokta Rider'} • Tracking: {trackedOrder.courierInfo.trackingCode || 'N/A'}
                      </div>
                      {trackedOrder.courierInfo.courierPhone && (
                        <div className="pt-1 border-t border-blue-100 flex items-center justify-between">
                          <span className="text-gray-600 font-medium">Rider Contact:</span>
                          <a
                            href={`tel:${trackedOrder.courierInfo.courierPhone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition"
                          >
                            <Phone size={12} /> Call: {trackedOrder.courierInfo.courierPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {trackedOrder.fulfillmentType === 'facility_collection' && (
                    <div className="bg-emerald-50 p-3.5 rounded-xl text-xs text-emerald-900 border border-emerald-200">
                      <strong>Collection Facility:</strong> {trackedOrder.collectionFacility?.facilityName || 'eDokta Central Pharmacy Hub'}
                      <p className="text-gray-600 mt-0.5">{trackedOrder.collectionFacility?.facilityAddress}</p>
                    </div>
                  )}

                  {/* Order Items Summary */}
                  <div className="border-t border-gray-100 pt-4 text-xs space-y-2">
                    <p className="font-bold text-gray-700">Order Items ({trackedOrder.items?.length}):</p>
                    {trackedOrder.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-gray-600">
                        <span>{it.name} (x{it.quantity})</span>
                        <span className="font-semibold text-gray-800">₦{(it.price * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                      <span>Total Amount:</span>
                      <span className="text-primary">₦{trackedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="p-3 border-t border-gray-100 bg-white shrink-0">
              <button
                onClick={() => setIsTrackingOpen(false)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close Tracking Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
