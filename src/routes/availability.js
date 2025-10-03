const router = require("express").Router();
const { getAvailability, seedAvailabilityForTrainDate } = require("../controllers/availabilityController");
const { auth, adminOnly } = require("../middlewares/auth");

router.get("/:trainId", getAvailability);
router.post("/seed", auth, adminOnly, seedAvailabilityForTrainDate);

module.exports = router;
