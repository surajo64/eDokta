import { request } from "express";
import mongoose from "mongoose";


const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  cancelled: { type: Boolean, default: false  },
  payment: { type: Boolean,  default: false   },
  approve: { type: Boolean,  default: false   },
  type: { type: String, required: true },
  isCompleted: { type: Boolean, default: false  },
  clinicalNote: { type: String, default: "" },
  diagnosis: { type: String, default: "" },
  prescription: { type: String, default: "" },
  investigation:{ type: String, default: "" },
  createdAt: { type: Date, default: Date.now }

}, { minimize: false })

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel