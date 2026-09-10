import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  genericName: { type: String, required: true, trim: true },
  brandName: { type: String, default: "", trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: [
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
    ],
    default: "Pain Relief & Analgesics"
  },
  dosageForm: { 
    type: String, 
    required: true,
    enum: [
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
    ],
    default: "Tablet"
  },
  strength: { type: String, required: true, trim: true }, // e.g., "500mg", "250mg/5ml"
  packSize: { type: String, required: true, trim: true }, // e.g., "Pack of 20 Tablets", "100ml Bottle"
  price: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, default: 0, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 10, min: 0 }, // Low stock alert threshold
  expiryDate: { type: Date, required: true },
  requiresPrescription: { type: Boolean, default: false }, // true = Rx, false = OTC
  nafdacRegNumber: { type: String, default: "", trim: true },
  image: { 
    type: String, 
    default: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop" 
  },
  description: { type: String, default: "" },
  indications: { type: String, default: "" },
  dosageInstructions: { type: String, default: "" },
  sideEffects: { type: String, default: "" },
  storageInstructions: { type: String, default: "Store below 25°C in a dry place away from direct sunlight." },
  manufacturer: { type: String, default: "eDokta Verified Partner" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Virtual to check if low stock
medicineSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.reorderLevel;
});

// Virtual to check expiry status
medicineSchema.virtual('expiryStatus').get(function() {
  const now = new Date();
  const diffDays = Math.ceil((this.expiryDate - now) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'expired';
  if (diffDays <= 30) return 'critical'; // < 30 days
  if (diffDays <= 90) return 'warning';  // < 90 days
  return 'good';
});

medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

const medicineModel = mongoose.models.medicine || mongoose.model("medicine", medicineSchema);

export default medicineModel;
