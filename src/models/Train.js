const mongoose=require("mongoose");
const RoutePoint = new mongoose.Schema({
    stationCode: String,
    stationName: String,
    arrival:String,
    departure:String,
    index:Number
},{_id:false});
const TrainSchema = new mongoose.Schema({
    number: {type:String,required:true,unique:true},
    name:{type:String,required:true},
    route:{type:[RoutePoint],required:true},
    classes:[String],
    totalSeats:mongoose.Schema.Types.Mixed
},{timestamps:true});
TrainSchema.index({"route.StationCode":1});
module.exports = mongoose.model("Train",TrainSchema);
