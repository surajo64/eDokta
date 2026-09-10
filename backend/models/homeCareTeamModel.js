import mongoose from "mongoose";

const homeCareTeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  speciality: { type: String, required: true },
  doctorId: { type: String, required: false },
  doctorName: { type: String, required: true },
  doctorTitle: { type: String, required: true },
  nurseName: { type: String, required: true },
  nurseTitle: { type: String, required: true },
  assistantName: { type: String, required: true },
  assistantTitle: { type: String, required: true },
  fees: { type: Number, required: true },
  image: { type: String, required: true },
  about: { type: String, required: true },
  location: { type: String, default: "Kano Metropolitan & Environs" },
  servicesIncluded: { type: Array, default: [] },
  available: { type: Boolean, default: true },
  slots_booked: { type: Object, default: {} },
  disabled_slots: { type: Object, default: {} },
  date: { type: Date, default: Date.now }
}, { minimize: false });

const homeCareTeamModel = mongoose.models.homeCareTeam || mongoose.model('homeCareTeam', homeCareTeamSchema);

export default homeCareTeamModel;
