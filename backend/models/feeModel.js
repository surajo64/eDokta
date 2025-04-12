import { request } from "express";
import mongoose from "mongoose";


const specialitySchema = new mongoose.Schema({
  speciality: { type: String, required: true, unique: true},
  fee: { type: Number, required: true },
  feePercentage: { type: Number, required: true },
  doctorFee: { type: Number, required: true }, // Updated name
  createdAt: { type: Date, default: Date.now }
}, { minimize: false })

const specialityModel = mongoose.models.speciality || mongoose.model('speciality', specialitySchema)

export default specialityModel