const mongoose = require("mongoose");
const TrainSchema =  new mongoose.Schema({
    number:String,
    name:String,
    route:[{
        stationCode: String,
        stationName: String,
        arrival: String,
        departure: String,
        index: number
    }],
    classes: [String],
    totalSeats: mongoose.Schema.Types.Mixed
});
module.exports = mongoose.model("Train",TrainSchema);

