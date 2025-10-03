const router = require("express").Router();
const {searchTrains,createTrain} = require("../controllers/trainController");
const{auth,adminOnly} = require("../middlewares/auth");
router.get("/search",searchTrains);
router.post("/",auth,adminOnly,createTrain);
module.exports=router;
