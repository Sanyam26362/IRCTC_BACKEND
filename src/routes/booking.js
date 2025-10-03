const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { createBooking, getUserBookings, cancelBooking } = require("../controllers/bookingController");

router.post("/", auth, createBooking);
router.get("/", auth, getUserBookings);
router.post("/:id/cancel", auth, cancelBooking);

module.exports = router;
