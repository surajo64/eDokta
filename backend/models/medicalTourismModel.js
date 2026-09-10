import mongoose from "mongoose";

const medicalTourismSchema = new mongoose.Schema({
  // Patient Info
  patientName:        { type: String, required: true },
  patientEmail:       { type: String, required: true },
  patientPhone:       { type: String, required: true },
  userId:             { type: String, default: null },   // linked user account if logged in

  // Medical Details
  medicalCondition:   { type: String, required: true },
  treatmentSought:    { type: String, required: true },
  urgency:            { type: String, enum: ['Urgent (< 1 month)', 'Within 3 months', 'Flexible'], default: 'Flexible' },
  additionalNotes:    { type: String, default: '' },

  // Preferences
  preferredCountry:   { type: String, required: true },
  budgetRange:        { type: String, default: 'Not specified' },
  travelTimeline:     { type: String, default: '' },

  // Uploaded Documents (Cloudinary URLs)
  medicalDocuments:   { type: [String], default: [] },

  // Admin Management Fields
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  adminNotes:           { type: String, default: '' },
  assignedHospital:     { type: String, default: '' },
  assignedCountry:      { type: String, default: '' },
  hospitalAddress:      { type: String, default: '' },
  assignedCoordinator:  { type: String, default: '' },
  estimatedCost:        { type: String, default: '' },
  estimatedTravelDate:  { type: String, default: '' },

  date: { type: Date, default: Date.now }
}, { minimize: false });

const medicalTourismModel = mongoose.models.medicalTourism || mongoose.model('medicalTourism', medicalTourismSchema);

export default medicalTourismModel;
