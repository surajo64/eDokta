import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'medicine', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  dosageForm: { type: String, default: "" },
  strength: { type: String, default: "" },
  image: { type: String, default: "" },
  requiresPrescription: { type: Boolean, default: false }
}, { _id: false });

const pharmacyOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  fulfillmentType: { 
    type: String, 
    enum: ['home_delivery', 'facility_collection'], 
    default: 'home_delivery' 
  },
  deliveryAddress: {
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    deliveryNotes: { type: String, default: "" }
  },
  collectionFacility: {
    facilityName: { type: String, default: "eDokta Central Pharmacy & Clinic Hub" },
    facilityAddress: { type: String, default: "Plot 14 Healthcare Avenue, Phase 2, Abuja / Kano Central Dispensary" },
    pickupInstructions: { type: String, default: "Bring a valid ID and this Order Number when picking up." }
  },
  paymentMethod: { 
    type: String, 
    enum: ['paystack', 'pay_on_delivery', 'pay_on_collection'], 
    default: 'pay_on_delivery' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed'], 
    default: 'Pending' 
  },
  paystackReference: { type: String, default: null },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Processing', 'In Transit', 'Ready for Collection', 'Delivered', 'Collected', 'Cancelled'], 
    default: 'Pending' 
  },
  prescriptionImage: { type: String, default: null },
  prescriptionVerified: { type: Boolean, default: false },
  trackingNotes: { type: String, default: "" },
  courierInfo: {
    courierName: { type: String, default: "" },
    courierPhone: { type: String, default: "" },
    trackingCode: { type: String, default: "" },
    estimatedDelivery: { type: String, default: "" }
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      note: { type: String, default: "" },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const pharmacyOrderModel = mongoose.models.pharmacyOrder || mongoose.model("pharmacyOrder", pharmacyOrderSchema);

export default pharmacyOrderModel;
