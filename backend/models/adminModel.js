import { request } from "express";
import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  isActive: { type: Boolean, default:true  },
  createdAt: { type: Date, default: Date.now }

}, { minimize: false })

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema)

export default adminModel