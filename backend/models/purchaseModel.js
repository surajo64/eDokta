import mongoose from "mongoose";


const purchaseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: String, ref: 'user', required: true },
  amount: { type: Number, required: true },
  attendanceType: { type: String, enum: ['Physical', 'Virtual'], default: 'Physical' },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },

}, { timestamps: true, minimize: false })

const Purchase = mongoose.model('Purchase', purchaseSchema)

export default Purchase;