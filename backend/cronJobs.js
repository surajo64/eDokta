import cron from 'node-cron';
import Appointment from './models/appointmentModel.js'; // Adjust path as needed
import mongoose from 'mongoose';

// Function to cancel unpaid appointments after 1 hour
const cancelUnpaidAppointments = async () => {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1); // Get time 1 hour ago

  try {
    const unpaidAppointments = await Appointment.find({
      payment: false, // Not paid
      canceled: false, // Not already canceled
      createdAt: { $lte: oneHourAgo } // Booked more than 1 hour ago
    });

    for (const appointment of unpaidAppointments) {
      await Appointment.findByIdAndUpdate(appointment._id, { canceled: true });
      console.log(`Canceled appointment: ${appointment._id}`);
    }
  } catch (error) {
    console.error("Error canceling appointments:", error);
  }
};

// Schedule this task to run every 5 minutes
cron.schedule('*/5 * * * *', cancelUnpaidAppointments);

console.log("Appointment cancellation job scheduled.");
