import { request } from "express";
import mongoose from "mongoose";


const lectureSchema = new mongoose.Schema({
  lectureId: { type: String, require: true },
  lectureTitle: { type: String, require: true },
  lectureDuration: { type: Number, require: true },
  lectureOrder: { type: Number, require: true },
  lectureUrl: { type: String, require: true },
  isPreviewFree: { type: Boolean, require: true },
}, { _id: false })

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, require: true },
  chapterOrder: { type: Number, require: true },
  chapterTitle: { type: String, require: true },
  chapterContent: [lectureSchema]
}, { _id: false })

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseDescription: { type: String, required: true },
  courseThumbnail: { type: String },
  // We keep coursePrice as a fallback or base price, but prefer specific ones
  coursePrice: { type: Number, required: true },
  courseMode: { type: String, enum: ['Physical', 'Virtual', 'Both'], default: 'Both', required: true },
  coursePricePhysical: { type: Number, default: 0 },
  coursePriceVirtual: { type: Number, default: 0 },
  courseAddress: { type: String, default: '' },
  meetingUrl: { type: String, default: '' },
  classSchedule: { type: String, default: '' }, // e.g., "Mondays & Wednesdays 10:00 AM"
  discount: { type: Number, required: true },
  purchasePrice: { type: Number, default: 0 },
  purchasePricePhysical: { type: Number, default: 0 },
  purchasePriceVirtual: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  courseContent: [chapterSchema],
  courseRatings: [{ userId: { type: String }, rating: { type: Number, min: 1, max: 5 } }],
  educator: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]

}, { timestamps: true, minimize: false })

//🔹 Pre-save middleware to auto-calc purchasePrice

courseSchema.pre("save", function (next) {
  // Calculate default purchasePrice (legacy support)
  this.purchasePrice = Math.max(this.coursePrice - this.discount, 0);

  // Calculate Physical and Virtual Purchase Prices
  // If not explicitly set, they default to 0, so we check if they are > 0 before applying discount
  // If they are 0, we might want to default them to coursePrice, but for now let's respect the inputs.
  // Assuming discount applies to all prices equally (flat amount). 
  // If distinct discounts are needed, we'd need discountPhysical/Virtual. 
  // For now, applying the same flat discount to both.

  if (this.coursePricePhysical > 0) {
    this.purchasePricePhysical = Math.max(this.coursePricePhysical - this.discount, 0);
  }

  if (this.coursePriceVirtual > 0) {
    this.purchasePriceVirtual = Math.max(this.coursePriceVirtual - this.discount, 0);
  } else {
    // Logic: If virtual price is not set, maybe default to base price? 
    // For now, let's keep it clean. If 0, then 0.
  }

  next();
});


// 🔹 Pre-update middleware (so updates also recalc)

courseSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  // Check if any price or discount is being updated
  if (update.coursePrice !== undefined || update.discount !== undefined || update.coursePricePhysical !== undefined || update.coursePriceVirtual !== undefined) {

    // We need to access the NEW values preferably, or fallback to existing.
    // However, in findOneAndUpdate, we don't easily have 'this' referring to the doc before update unless we query.
    // Simplifying: We rely on the fact that if we update, we usually send all data or we accept that recalc might be tricky without full data.
    // A safer way is to just let the logic run if we have the data in 'update'.

    const discount = update.discount; // If discount changes, we need to recalc all

    if (discount !== undefined) {
      if (update.coursePrice !== undefined) update.purchasePrice = Math.max(update.coursePrice - discount, 0);
      if (update.coursePricePhysical !== undefined) update.purchasePricePhysical = Math.max(update.coursePricePhysical - discount, 0);
      if (update.coursePriceVirtual !== undefined) update.purchasePriceVirtual = Math.max(update.coursePriceVirtual - discount, 0);
    }
  }
  next();
});


const Course = mongoose.model('Course', courseSchema)

export default Course;