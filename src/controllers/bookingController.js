const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Availability = require("../models/Availability");
const { generatePNR } = require("../utils/pnr");

const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const idempotencyKey = req.headers["idempotency-key"] || req.body.idempotencyKey;
    const { trainId, date, class: cls, seatsCount, passengers } = req.body;

    if (!trainId || !date || !cls || !seatsCount || !passengers) {
      return res.status(400).json({ message: "Missing fields" });
    }

    
    if (idempotencyKey) {
      const existing = await Booking.findOne({ idempotencyKey, userId: req.user._id });
      if (existing) return res.json(existing);
    }

    session.startTransaction();

    const avail = await Availability.findOneAndUpdate(
      { trainId, date, class: cls, seatsAvailable: { $gte: seatsCount } },
      { $inc: { seatsAvailable: -seatsCount } },
      { new: true, session }
    );
    if (!avail) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Not enough seats" });
    }

    const pnr = generatePNR();
    const booking = new Booking({
      pnr,
      idempotencyKey,
      userId: req.user._id,
      trainId, date, class: cls,
      seatsCount, passengers,
      amount: 0, 
      status: "CONFIRMED"
    });

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(booking);
  } catch (err) {
    await session.abortTransaction().catch(()=>{});
    session.endSession();
    next(err);
  }
};


const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate("trainId");
    res.json(bookings);
  } catch (err) { next(err); }
};


const cancelBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const booking = await Booking.findById(req.params.id).session(session);
    if (!booking) { await session.abortTransaction(); return res.status(404).json({ message: "Not found" }); }
    if (String(booking.userId) !== String(req.user._id) && req.user.role !== "admin") {
      await session.abortTransaction(); return res.status(403).json({ message: "Not allowed" });
    }
    if (booking.status === "CANCELLED") { await session.abortTransaction(); return res.json(booking); }

   
    const avail = await Availability.findOneAndUpdate(
      { trainId: booking.trainId, date: booking.date, class: booking.class },
      { $inc: { seatsAvailable: booking.seatsCount } },
      { session }
    );
 
    booking.status = "CANCELLED";
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.json(booking);
  } catch (err) {
    await session.abortTransaction().catch(()=>{});
    session.endSession();
    next(err);
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking };
