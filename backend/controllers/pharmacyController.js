import medicineModel from "../models/medicineModel.js";
import pharmacyOrderModel from "../models/pharmacyOrderModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

// ─────────────────────────────────────────────
// PATIENT / PUBLIC CONTROLLERS
// ─────────────────────────────────────────────

/**
 * GET /api/pharmacy/medicines
 * Public catalog with search, category filter, prescription filter, sorting
 */
export const getPublicMedicines = async (req, res) => {
  try {
    const { search, category, prescriptionType, sort } = req.query;

    const query = { isActive: true };

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { genericName: regex },
        { brandName: regex },
        { indications: regex }
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (prescriptionType === "otc") {
      query.requiresPrescription = false;
    } else if (prescriptionType === "rx") {
      query.requiresPrescription = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "name_asc") sortOption = { name: 1 };

    const medicines = await medicineModel.find(query).sort(sortOption);

    return res.json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/pharmacy/medicine/:id
 */
export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await medicineModel.findById(id);

    if (!medicine || !medicine.isActive) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }

    return res.json({ success: true, medicine });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/pharmacy/order
 * Place a pharmacy order with fulfillment & payment selection
 */
export const createPharmacyOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items: itemsJson,
      fulfillmentType,
      deliveryAddress: deliveryAddressJson,
      collectionFacility: collectionFacilityJson,
      paymentMethod,
      userId // injected if logged in
    } = req.body;

    const items = typeof itemsJson === "string" ? JSON.parse(itemsJson) : itemsJson;
    const deliveryAddress = typeof deliveryAddressJson === "string" ? JSON.parse(deliveryAddressJson) : (deliveryAddressJson || {});
    const collectionFacility = typeof collectionFacilityJson === "string" ? JSON.parse(collectionFacilityJson) : (collectionFacilityJson || {});

    if (!customerName || !customerEmail || !customerPhone || !items || !items.length) {
      return res.status(400).json({ success: false, message: "Missing required order details" });
    }

    // Validate stock and build order items
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const med = await medicineModel.findById(item.medicineId);
      if (!med) {
        return res.status(400).json({ success: false, message: `Medicine not found: ${item.name}` });
      }
      if (med.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${med.name}. Only ${med.stock} available.` 
        });
      }

      subtotal += med.price * item.quantity;
      validatedItems.push({
        medicineId: med._id,
        name: med.name,
        price: med.price,
        quantity: item.quantity,
        dosageForm: med.dosageForm,
        strength: med.strength,
        image: med.image,
        requiresPrescription: med.requiresPrescription
      });
    }

    const deliveryFee = fulfillmentType === "home_delivery" ? 1500 : 0;
    const totalAmount = subtotal + deliveryFee;

    // Handle optional prescription image upload
    let prescriptionImage = null;
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "edokta_prescriptions",
        resource_type: "auto"
      });
      prescriptionImage = uploadRes.secure_url;
    }

    // Resolve user ID with multiple fallbacks (token decode, body, or customer phone/email)
    let resolvedUserId = req.userId || req.body?.userId || null;
    if (!resolvedUserId) {
      try {
        const userQuery = [];
        if (customerPhone) userQuery.push({ phone: customerPhone });
        if (customerEmail) userQuery.push({ email: customerEmail });
        if (userQuery.length > 0) {
          const matchedUser = await userModel.findOne({ $or: userQuery });
          if (matchedUser) {
            resolvedUserId = matchedUser._id;
          }
        }
      } catch (err) {
        console.error("Auto-resolving user for order failed:", err.message);
      }
    }

    const newOrder = new pharmacyOrderModel({
      orderNumber,
      userId: resolvedUserId || null,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      },
      items: validatedItems,
      subtotal,
      deliveryFee,
      totalAmount,
      fulfillmentType: fulfillmentType || "home_delivery",
      deliveryAddress: fulfillmentType === "home_delivery" ? deliveryAddress : {},
      collectionFacility: fulfillmentType === "facility_collection" ? collectionFacility : {},
      paymentMethod: paymentMethod || "pay_on_delivery",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      prescriptionImage,
      statusHistory: [
        {
          status: "Order Placed",
          note: `Order submitted via ${fulfillmentType === "home_delivery" ? "Home Delivery" : "Facility Collection"}. Payment method: ${paymentMethod}.`,
          timestamp: new Date()
        }
      ]
    });

    // Deduct stock immediately
    for (const item of validatedItems) {
      await medicineModel.findByIdAndUpdate(item.medicineId, {
        $inc: { stock: -item.quantity }
      });
    }

    // If online Paystack payment is chosen, initialize Paystack transaction
    if (paymentMethod === "paystack") {
      const paystackSecret = process.env.PAYSTACK_KEY_SECRET || process.env.PAYSTACK_SECRET_KEY;
      if (!paystackSecret) {
        // Fallback if secret not set in environment
        newOrder.paystackReference = `offline_ref_${Date.now()}`;
        await newOrder.save();
        return res.json({
          success: true,
          order: newOrder,
          message: "Order placed. Online gateway pending configuration, order registered."
        });
      }

      const reference = `paystack_ph_${newOrder._id}_${Date.now()}`;
      newOrder.paystackReference = reference;
      await newOrder.save();

      try {
        const paystackResponse = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          {
            email: customerEmail,
            amount: totalAmount * 100, // Paystack expects Kobo
            reference,
            callback_url: `${req.headers.origin || "http://localhost:5173"}/digital-clinic/e-pharmacy?orderRef=${orderNumber}&payment=success`,
            metadata: {
              orderId: newOrder._id.toString(),
              orderNumber,
              customerName,
              phone: customerPhone
            }
          },
          {
            headers: {
              Authorization: `Bearer ${paystackSecret}`,
              "Content-Type": "application/json"
            }
          }
        );

        return res.json({
          success: true,
          order: newOrder,
          authorizationUrl: paystackResponse.data.data.authorization_url,
          accessCode: paystackResponse.data.data.access_code,
          reference
        });
      } catch (paystackError) {
        console.error("Paystack initialization failed:", paystackError.response?.data || paystackError.message);
        // Save order anyway so user doesn't lose their cart, allow them to pay on delivery
        return res.json({
          success: true,
          order: newOrder,
          warning: "Payment gateway busy. Order has been saved as Pay on Delivery/Collection.",
          message: "Order placed successfully!"
        });
      }
    }

    await newOrder.save();

    return res.json({
      success: true,
      order: newOrder,
      message: "Your pharmacy order has been placed successfully!"
    });
  } catch (error) {
    console.error("Error creating pharmacy order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to automatically query Paystack for any pending Paystack order and reconcile it
export const reconcilePaystackPayment = async (order) => {
  if (!order || order.paymentMethod !== "paystack" || order.paymentStatus === "Paid" || !order.paystackReference) {
    return order;
  }

  const paystackSecret = process.env.PAYSTACK_KEY_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecret) return order;

  try {
    const { data } = await axios.get(`https://api.paystack.co/transaction/verify/${order.paystackReference}`, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
      timeout: 5000
    });

    if (data.data && data.data.status === "success") {
      order.paymentStatus = "Paid";
      if (order.orderStatus === "Pending") {
        order.orderStatus = "Confirmed";
      }
      order.statusHistory.push({
        status: "Payment Confirmed",
        note: `Online payment of ₦${order.totalAmount.toLocaleString()} verified successfully via Paystack.`,
        timestamp: new Date()
      });
      await order.save();
    }
  } catch (err) {
    // Ignore verification errors during background poll
  }
  return order;
};

/**
 * POST /api/pharmacy/verify-payment
 * Verify Paystack payment for an order
 */
export const verifyPharmacyPayment = async (req, res) => {
  try {
    const { reference, orderNumber } = req.body;
    const paystackSecret = process.env.PAYSTACK_KEY_SECRET || process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecret) {
      return res.status(400).json({ success: false, message: "Paystack secret key missing" });
    }

    let order = null;
    if (orderNumber) {
      order = await pharmacyOrderModel.findOne({ orderNumber: orderNumber.toUpperCase().trim() });
    }
    if (!order && reference) {
      order = await pharmacyOrderModel.findOne({ paystackReference: reference });
    }

    const payRef = reference || order?.paystackReference;
    if (!payRef) {
      return res.status(400).json({ success: false, message: "No payment reference found for verification" });
    }

    const { data } = await axios.get(`https://api.paystack.co/transaction/verify/${payRef}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`
      }
    });

    if (data.data && data.data.status === "success") {
      if (!order) {
        order = await pharmacyOrderModel.findOne({ 
          $or: [{ paystackReference: payRef }, { orderNumber }] 
        });
      }

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found for verification" });
      }

      order.paymentStatus = "Paid";
      if (order.orderStatus === "Pending") {
        order.orderStatus = "Confirmed";
      }
      order.statusHistory.push({
        status: "Payment Confirmed",
        note: `Online payment of ₦${order.totalAmount.toLocaleString()} verified successfully via Paystack.`,
        timestamp: new Date()
      });
      await order.save();

      return res.json({ success: true, order, message: "Payment verified successfully!" });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/pharmacy/my-orders
 * List logged-in user's pharmacy orders
 */
export const getUserPharmacyOrders = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required" });
    }

    const user = await userModel.findById(userId);
    const queryConditions = [{ userId }];

    if (user?.phone) {
      queryConditions.push({ "customer.phone": user.phone });
    }
    if (user?.email) {
      queryConditions.push({ "customer.email": user.email });
    }

    // Auto-link any matching unlinked orders to this user's account for permanent consistency
    if (user) {
      const matchCriteria = [];
      if (user.phone) matchCriteria.push({ "customer.phone": user.phone });
      if (user.email) matchCriteria.push({ "customer.email": user.email });

      if (matchCriteria.length > 0) {
        await pharmacyOrderModel.updateMany(
          {
            $and: [
              { $or: [{ userId: null }, { userId: { $exists: false } }] },
              { $or: matchCriteria }
            ]
          },
          { $set: { userId: user._id } }
        );
      }
    }

    const orders = await pharmacyOrderModel.find({ $or: queryConditions }).sort({ createdAt: -1 });

    // Auto-reconcile any pending Paystack payments in the background
    for (const ord of orders) {
      if (ord.paymentMethod === "paystack" && ord.paymentStatus === "Pending") {
        await reconcilePaystackPayment(ord);
      }
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user pharmacy orders:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/pharmacy/track-order/:orderNumber
 * Public or user tracking of a specific order
 */
export const trackPharmacyOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await pharmacyOrderModel.findOne({ 
      orderNumber: orderNumber.toUpperCase().trim() 
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "No order found with this reference number." 
      });
    }

    // Auto-reconcile with Paystack if still pending
    await reconcilePaystackPayment(order);

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// ADMIN CONTROLLERS
// ─────────────────────────────────────────────

/**
 * GET /api/pharmacy/admin/medicines
 * Admin inventory list with stock alerts, expiry alerts, and stats
 */
export const getAdminMedicines = async (req, res) => {
  try {
    const { search, category, filter } = req.query;

    const query = {};

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { genericName: regex },
        { brandName: regex },
        { nafdacRegNumber: regex }
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const allMeds = await medicineModel.find(query).sort({ createdAt: -1 });

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    // Filter if requested
    let filteredMeds = allMeds;
    if (filter === "low_stock") {
      filteredMeds = allMeds.filter(m => m.stock <= m.reorderLevel);
    } else if (filter === "expiring_soon") {
      filteredMeds = allMeds.filter(m => m.expiryDate > now && m.expiryDate <= in90Days);
    } else if (filter === "expired") {
      filteredMeds = allMeds.filter(m => m.expiryDate <= now);
    }

    // Compute global metrics
    const totalCount = allMeds.length;
    const lowStockCount = allMeds.filter(m => m.stock <= m.reorderLevel).length;
    const expiredCount = allMeds.filter(m => m.expiryDate <= now).length;
    const expiringSoonCount = allMeds.filter(m => m.expiryDate > now && m.expiryDate <= in90Days).length;
    const totalStockQty = allMeds.reduce((acc, curr) => acc + (curr.stock || 0), 0);

    return res.json({
      success: true,
      metrics: {
        totalCount,
        lowStockCount,
        expiredCount,
        expiringSoonCount,
        totalStockQty
      },
      medicines: filteredMeds
    });
  } catch (error) {
    console.error("Admin medicines fetch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/pharmacy/admin/add-medicine
 */
export const addMedicine = async (req, res) => {
  try {
    const {
      name,
      genericName,
      brandName,
      category,
      dosageForm,
      strength,
      packSize,
      price,
      costPrice,
      stock,
      reorderLevel,
      expiryDate,
      requiresPrescription,
      nafdacRegNumber,
      description,
      indications,
      dosageInstructions,
      sideEffects,
      storageInstructions,
      manufacturer,
      imageUrl
    } = req.body;

    if (!name || !genericName || !category || !dosageForm || !strength || !packSize || !price || !expiryDate) {
      return res.status(400).json({ success: false, message: "Please fill in all mandatory medicine details." });
    }

    let finalImageUrl = imageUrl || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop";

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "edokta_pharmacy"
      });
      finalImageUrl = uploadRes.secure_url;
    }

    const medicine = new medicineModel({
      name,
      genericName,
      brandName: brandName || "",
      category,
      dosageForm,
      strength,
      packSize,
      price: Number(price),
      costPrice: costPrice ? Number(costPrice) : 0,
      stock: Number(stock) || 0,
      reorderLevel: Number(reorderLevel) || 10,
      expiryDate: new Date(expiryDate),
      requiresPrescription: requiresPrescription === "true" || requiresPrescription === true,
      nafdacRegNumber: nafdacRegNumber || "",
      image: finalImageUrl,
      description: description || "",
      indications: indications || "",
      dosageInstructions: dosageInstructions || "",
      sideEffects: sideEffects || "",
      storageInstructions: storageInstructions || "Store below 25°C away from moisture and direct sunlight.",
      manufacturer: manufacturer || "eDokta Verified Partner"
    });

    await medicine.save();

    return res.json({ success: true, medicine, message: "Medicine added to inventory successfully!" });
  } catch (error) {
    console.error("Add medicine error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/pharmacy/admin/update-medicine
 */
export const updateMedicine = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Medicine ID is required" });
    }

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "edokta_pharmacy"
      });
      updateData.image = uploadRes.secure_url;
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.costPrice) updateData.costPrice = Number(updateData.costPrice);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);
    if (updateData.reorderLevel !== undefined) updateData.reorderLevel = Number(updateData.reorderLevel);
    if (updateData.expiryDate) updateData.expiryDate = new Date(updateData.expiryDate);
    if (updateData.requiresPrescription !== undefined) {
      updateData.requiresPrescription = updateData.requiresPrescription === "true" || updateData.requiresPrescription === true;
    }

    const updatedMedicine = await medicineModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMedicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }

    return res.json({ success: true, medicine: updatedMedicine, message: "Inventory updated successfully!" });
  } catch (error) {
    console.error("Update medicine error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/pharmacy/admin/delete-medicine
 */
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.body;
    await medicineModel.findByIdAndDelete(id);
    return res.json({ success: true, message: "Medicine removed from inventory." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/pharmacy/admin/orders
 * Admin list of orders with filters
 */
export const getAdminPharmacyOrders = async (req, res) => {
  try {
    const { status, fulfillment, paymentStatus, search } = req.query;

    const query = {};

    if (status && status !== "All") {
      query.orderStatus = status;
    }

    if (fulfillment && fulfillment !== "All") {
      query.fulfillmentType = fulfillment;
    }

    if (paymentStatus && paymentStatus !== "All") {
      query.paymentStatus = paymentStatus;
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { orderNumber: regex },
        { "customer.name": regex },
        { "customer.phone": regex },
        { "customer.email": regex }
      ];
    }

    const orders = await pharmacyOrderModel.find(query).sort({ createdAt: -1 });

    // Auto-reconcile any pending Paystack payments so admin sees real-time status
    for (const ord of orders) {
      if (ord.paymentMethod === "paystack" && ord.paymentStatus === "Pending") {
        await reconcilePaystackPayment(ord);
      }
    }

    const totalOrders = await pharmacyOrderModel.countDocuments();
    const pendingOrders = await pharmacyOrderModel.countDocuments({ orderStatus: "Pending" });
    const processingOrders = await pharmacyOrderModel.countDocuments({ orderStatus: "Processing" });
    const inTransitOrders = await pharmacyOrderModel.countDocuments({ orderStatus: { $in: ["In Transit", "Ready for Collection"] } });
    const completedOrders = await pharmacyOrderModel.countDocuments({ orderStatus: { $in: ["Delivered", "Collected"] } });

    return res.json({
      success: true,
      metrics: {
        totalOrders,
        pendingOrders,
        processingOrders,
        inTransitOrders,
        completedOrders
      },
      orders
    });
  } catch (error) {
    console.error("Fetch admin orders error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/pharmacy/admin/update-order-status
 * Process order: change status, update courier, verify prescription, toggle payment
 */
export const updatePharmacyOrderStatus = async (req, res) => {
  try {
    const {
      orderId,
      orderStatus,
      paymentStatus,
      trackingNotes,
      courierName,
      courierPhone,
      trackingCode,
      estimatedDelivery,
      prescriptionVerified,
      statusNote
    } = req.body;

    const order = await pharmacyOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        note: statusNote || `Order status updated to ${orderStatus}.`,
        timestamp: new Date()
      });
    } else if (statusNote && statusNote.trim() !== "") {
      order.statusHistory.push({
        status: order.orderStatus,
        note: statusNote.trim(),
        timestamp: new Date()
      });
    }

    if (statusNote && statusNote.trim() !== "") {
      order.trackingNotes = statusNote.trim();
    } else if (trackingNotes !== undefined) {
      order.trackingNotes = trackingNotes;
    }

    if (paymentStatus) {
      if (order.paymentStatus === "Paid" && paymentStatus !== "Paid") {
        return res.status(400).json({
          success: false,
          message: "Payment for this order is already confirmed as Paid and cannot be altered."
        });
      }
      order.paymentStatus = paymentStatus;
    }

    if (prescriptionVerified !== undefined) {
      order.prescriptionVerified = prescriptionVerified;
    }

    if (courierName !== undefined || courierPhone !== undefined || trackingCode !== undefined || estimatedDelivery !== undefined) {
      order.courierInfo = {
        courierName: courierName !== undefined ? courierName : (order.courierInfo?.courierName || ""),
        courierPhone: courierPhone !== undefined ? courierPhone : (order.courierInfo?.courierPhone || ""),
        trackingCode: trackingCode !== undefined ? trackingCode : (order.courierInfo?.trackingCode || ""),
        estimatedDelivery: estimatedDelivery !== undefined ? estimatedDelivery : (order.courierInfo?.estimatedDelivery || "")
      };
    }

    await order.save();

    return res.json({
      success: true,
      order,
      message: "Order details updated successfully!"
    });
  } catch (error) {
    console.error("Order update error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
