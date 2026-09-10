import express from "express";
import {
  getPublicMedicines,
  getMedicineById,
  createPharmacyOrder,
  verifyPharmacyPayment,
  getUserPharmacyOrders,
  trackPharmacyOrder,
  getAdminMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getAdminPharmacyOrders,
  updatePharmacyOrderStatus
} from "../controllers/pharmacyController.js";
import authAdmin from "../middlewares/authAdmin.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
import jwt from "jsonwebtoken";

const pharmacyRouter = express.Router();

// Middleware to extract user ID if token is provided, without blocking guests
const extractUser = (req, res, next) => {
  const token = req.headers.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      if (!req.body) req.body = {};
      req.body.userId = decoded.id;
    } catch (e) {
      console.log("extractUser notice:", e.message);
    }
  }
  next();
};

// ─────────────────────────────────────────────
// Public / Patient Storefront Routes
// ─────────────────────────────────────────────
pharmacyRouter.get("/medicines", getPublicMedicines);
pharmacyRouter.get("/medicine/:id", getMedicineById);
pharmacyRouter.post("/order", upload.single("prescription"), extractUser, createPharmacyOrder);
pharmacyRouter.post("/verify-payment", verifyPharmacyPayment);
pharmacyRouter.get("/track-order/:orderNumber", trackPharmacyOrder);

// Authenticated Patient Order History
pharmacyRouter.get("/my-orders", authUser, (req, res, next) => {
  // Ensure req.userId is set even if authUser only set req.body.userId
  if (!req.userId && req.body && req.body.userId) {
    req.userId = req.body.userId;
  }
  next();
}, getUserPharmacyOrders);

// ─────────────────────────────────────────────
// Admin Inventory & Order Management Routes
// ─────────────────────────────────────────────
pharmacyRouter.get("/admin/medicines", authAdmin, getAdminMedicines);
pharmacyRouter.post("/admin/add-medicine", authAdmin, upload.single("image"), addMedicine);
pharmacyRouter.post("/admin/update-medicine", authAdmin, upload.single("image"), updateMedicine);
pharmacyRouter.post("/admin/delete-medicine", authAdmin, deleteMedicine);
pharmacyRouter.get("/admin/orders", authAdmin, getAdminPharmacyOrders);
pharmacyRouter.post("/admin/update-order-status", authAdmin, updatePharmacyOrderStatus);

export default pharmacyRouter;
