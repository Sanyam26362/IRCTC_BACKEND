const router=require("express").Router();
const {getAvailabilty,seedAvailabiltyForTrainDate} = require("../controllers/availabilityController");
const {auth,adminOnly} = require("../middlewares/auth");
router.get("/:trainId",getAvailabilty);
router.post("/seed",auth,adminOnly,seedAvailabiltyForTrainDate);
module.exports=router;
