import { request } from "express";
import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  role: { type: String, default: "admin" },
  about: { type: String, default: "" },
  image: { type: String, default: "" },
  gender: { type: String, default: "" },
  dob: { type: String, default: "" },
  address: { type: String, default: "" },
  nin: { type: String, default: "" },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  isActive: { type: Boolean, default:true  },
  createdAt: { type: Date, default: Date.now }

}, { minimize: false })

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema)

export default adminModel