import medicalTourismModel from "../models/medicalTourismModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary';

// ─────────────────────────────────────────────
//  USER / PATIENT CONTROLLERS
// ─────────────────────────────────────────────

/**
 * POST /api/user/submit-tourism-request
 * Patient submits a medical tourism consultation request.
 * Works for both logged-in users and guest inquiries.
 */
const submitTourismRequest = async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      medicalCondition,
      treatmentSought,
      urgency,
      additionalNotes,
      preferredCountry,
      budgetRange,
      travelTimeline,
      userId // injected by authUser middleware if logged in (optional route)
    } = req.body;

    // Validate required fields
    if (!patientName || !patientEmail || !patientPhone || !medicalCondition || !treatmentSought || !preferredCountry) {
      return res.json({ success: false, message: 'Please fill in all required fields.' });
    }

    // Handle optional file uploads (up to 3 documents)
    let medicalDocuments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: 'auto',
          folder: 'eDokta_medical_tourism'
        });
        medicalDocuments.push(result.secure_url);
      }
    }

    const request = new medicalTourismModel({
      patientName,
      patientEmail,
      patientPhone,
      userId: userId || null,
      medicalCondition,
      treatmentSought,
      urgency: urgency || 'Flexible',
      additionalNotes: additionalNotes || '',
      preferredCountry,
      budgetRange: budgetRange || 'Not specified',
      travelTimeline: travelTimeline || '',
      medicalDocuments,
      status: 'Pending'
    });

    await request.save();

    res.json({
      success: true,
      message: 'Your medical tourism request has been submitted successfully! Our team will review and contact you within 24-48 hours.',
      requestId: request._id
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * GET /api/user/my-tourism-requests
 * Patient views their own submitted requests (requires login).
 */
const getUserTourismRequests = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "Authentication required" });
    }

    // Also fetch user to support any request previously submitted with their email/phone
    const user = await userModel.findById(userId);
    const queryConditions = [{ userId }];

    if (user?.email) {
      queryConditions.push({ patientEmail: user.email });
      queryConditions.push({ patientEmail: user.email.toLowerCase() });
    }
    if (user?.phone) {
      queryConditions.push({ patientPhone: user.phone });
    }

    // Auto-link any previous unlinked requests with matching email or phone
    if (user?.email || user?.phone) {
      const orClauses = [];
      if (user.email) {
        orClauses.push({ patientEmail: user.email });
        orClauses.push({ patientEmail: user.email.toLowerCase() });
      }
      if (user.phone) {
        orClauses.push({ patientPhone: user.phone });
      }
      await medicalTourismModel.updateMany(
        { userId: null, $or: orClauses },
        { $set: { userId } }
      );
    }

    const requests = await medicalTourismModel
      .find({ $or: queryConditions })
      .sort({ date: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
//  ADMIN CONTROLLERS
// ─────────────────────────────────────────────

/**
 * GET /api/admin/tourism-requests
 * Admin fetches all medical tourism requests.
 */
const getAllTourismRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'All' ? { status } : {};
    const requests = await medicalTourismModel
      .find(filter)
      .sort({ date: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/tourism-request/:id
 * Admin fetches a single request by ID.
 */
const getTourismRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await medicalTourismModel.findById(id);
    if (!request) {
      return res.json({ success: false, message: 'Request not found.' });
    }
    res.json({ success: true, request });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * POST /api/admin/update-tourism-request
 * Admin updates status and fills management fields.
 */
const updateTourismRequest = async (req, res) => {
  try {
    const {
      requestId,
      status,
      adminNotes,
      assignedHospital,
      assignedCountry,
      hospitalAddress,
      assignedCoordinator,
      estimatedCost,
      estimatedTravelDate
    } = req.body;

    if (!requestId) {
      return res.json({ success: false, message: 'Request ID is required.' });
    }

    const updateData = {};
    if (status)               updateData.status = status;
    if (adminNotes !== undefined)        updateData.adminNotes = adminNotes;
    if (assignedHospital !== undefined)  updateData.assignedHospital = assignedHospital;
    if (assignedCountry !== undefined)   updateData.assignedCountry = assignedCountry;
    if (hospitalAddress !== undefined)   updateData.hospitalAddress = hospitalAddress;
    if (assignedCoordinator !== undefined) updateData.assignedCoordinator = assignedCoordinator;
    if (estimatedCost !== undefined)     updateData.estimatedCost = estimatedCost;
    if (estimatedTravelDate !== undefined) updateData.estimatedTravelDate = estimatedTravelDate;

    const updated = await medicalTourismModel.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: 'Request not found.' });
    }

    res.json({ success: true, message: 'Request updated successfully.', request: updated });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * POST /api/admin/delete-tourism-request
 * Admin deletes a request.
 */
const deleteTourismRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    await medicalTourismModel.findByIdAndDelete(requestId);
    res.json({ success: true, message: 'Request deleted.' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  submitTourismRequest,
  getUserTourismRequests,
  getAllTourismRequests,
  getTourismRequestById,
  updateTourismRequest,
  deleteTourismRequest
};
