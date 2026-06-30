import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const SEAL_IMAGE_URL = "https://res.cloudinary.com/dyii5iyqq/image/upload/v1756986671/logo_arebic.png";
const TEMPLATE_URL = "https://res.cloudinary.com/dyii5iyqq/image/upload/v1756987767/background_qvwsuz.png";

/**
 * Upload PDF buffer to Cloudinary and update progress
 */
export const uploadCertificateToCloudinary = (pdfBuffer, progress, certificateId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "certificates",
        public_id: `cert_${certificateId}`,
        resource_type: "raw", // Stores PDF file format securely
      },
      async (error, result) => {
        if (error) {
          return reject(error);
        }
        try {
          progress.certificateUrl = result.secure_url;
          await progress.save();
          resolve(result.secure_url);
        } catch (saveError) {
          reject(saveError);
        }
      }
    );
    streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
  });
};

/**
 * Helper to draw a programmatically generated red starburst/stamp seal at the bottom center
 */
const drawRedSeal = (doc, cx, cy, r, points = 48) => {
  doc.save();
  doc.fillColor("#b91c1c"); // Red stamp color
  const angleStep = Math.PI / points;
  for (let i = 0; i < 2 * points; i++) {
    const angle = i * angleStep;
    const currR = i % 2 === 0 ? r : r - 6;
    const x = cx + Math.cos(angle) * currR;
    const y = cy + Math.sin(angle) * currR;
    if (i === 0) {
      doc.moveTo(x, y);
    } else {
      doc.lineTo(x, y);
    }
  }
  doc.closePath();
  doc.fill();
  doc.restore();
};

/**
 * Build certificate layout on the PDF document
 */
export const buildCertificateContent = async (doc, user, course, certificateId, today) => {
  try {
    // Fetch template background
    const bgResponse = await axios.get(TEMPLATE_URL, { responseType: "arraybuffer" });
    const bgBuffer = Buffer.from(bgResponse.data, "binary");
    doc.image(bgBuffer, 0, 0, { width: 841.89, height: 595.28 });

    // Fetch logo image
    const logoResponse = await axios.get(SEAL_IMAGE_URL, { responseType: "arraybuffer" }).catch(() => null);
    const logoBuffer = logoResponse ? Buffer.from(logoResponse.data, "binary") : null;

    if (logoBuffer) {
      doc.image(logoBuffer, 841.89 / 2 - 35, 30, { width: 70 });
    }

    // Header Title
    doc.fontSize(22)
       .font("Helvetica-Bold")
       .fillColor("#0A1D66")
       .text("KANO INDEPENDENT RESEARCH CENTRE TRUST(KIRCT)", 0, 115, { align: "center" });

    // Header Subtitle
    doc.fontSize(18)
       .font("Helvetica-Oblique")
       .fillColor("#2563eb")
       .text("National Bioinformatics Workshop Series", 0, 145, { align: "center" });

    // Certifies text
    doc.fontSize(14)
       .font("Times-Italic")
       .fillColor("#475569")
       .text("On the Recommendation of the Faculty Certifies that", 0, 185, { align: "center" });

    // Candidate Name
    doc.fontSize(36)
       .font("Times-BoldItalic")
       .fillColor("#0f172a")
       .text(user.name, 0, 220, { align: "center" });

    // Underline below Name
    doc.strokeColor("#2563eb")
       .lineWidth(2)
       .moveTo(841.89 / 2 - 190, 265)
       .lineTo(841.89 / 2 + 190, 265)
       .stroke();

    // Has successfully completed...
    doc.fontSize(14)
       .font("Helvetica")
       .fillColor("#334155")
       .text("Has successfully completed the one-week professional training course", 0, 290, { align: "center" });

    // Course Title
    doc.fontSize(18)
       .font("Helvetica-Bold")
       .fillColor("#0f172a")
       .text(`" ${course.courseTitle.toUpperCase()} "`, 0, 320, { align: "center" });

    // Assessment text
    doc.fontSize(14)
       .font("Helvetica")
       .fillColor("#334155")
       .text("and Passed the end of Course Assessment.", 0, 350, { align: "center" });

    // Location
    const location = course.courseAddress || "KIRCT Conference Room";
    doc.fontSize(14)
       .font("Helvetica-Bold")
       .fillColor("#334155")
       .text(`Held at ${location}`, 0, 375, { align: "center" });

    // Date (Formatted as "Month Year.")
    const dateStr = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) + ".";
    doc.fontSize(14)
       .font("Helvetica-Bold")
       .fillColor("#334155")
       .text(dateStr, 0, 400, { align: "center" });

    // Left Signature
    doc.strokeColor("#475569")
       .lineWidth(1)
       .moveTo(100, 465)
       .lineTo(340, 465)
       .stroke();
    doc.fontSize(11)
       .font("Helvetica-Bold")
       .fillColor("#0f172a")
       .text("Dr. Basheer Isah Waziri (MBBS, PhD)", 100, 475, { align: "center", width: 240 });
    doc.fontSize(9)
       .font("Helvetica")
       .fillColor("#475569")
       .text("Program Coordinator", 100, 490, { align: "center", width: 240 });

    // Right Signature
    doc.strokeColor("#475569")
       .lineWidth(1)
       .moveTo(500, 465)
       .lineTo(740, 465)
       .stroke();
    doc.fontSize(11)
       .font("Helvetica-Bold")
       .fillColor("#0f172a")
       .text("Prof. Hamisu Salihu (M.D, PhD)", 500, 475, { align: "center", width: 240 });
    doc.fontSize(9)
       .font("Helvetica")
       .fillColor("#475569")
       .text("CEO/Director General", 500, 490, { align: "center", width: 240 });

    // Mask the gold seal and ribbons from the background template
    doc.save();
    doc.fillColor("#ffffff");
    doc.circle(841.89 / 2, 475, 62).fill();
    doc.rect(350, 475, 140, 105).fill();
    doc.restore();

    // Center Red Starburst Seal
    drawRedSeal(doc, 841.89 / 2, 475, 55, 48);

    // Certificate ID metadata bottom left
    doc.fontSize(8)
       .font("Helvetica")
       .fillColor("#94a3b8")
       .text(`Certificate ID: ${certificateId}`, 40, 550);

  } catch (error) {
    console.error("buildCertificateContent Error:", error);
    throw error;
  }
};
