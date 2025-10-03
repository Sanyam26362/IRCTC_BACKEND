const mongoose=require("mongoose");
const Train = require("./Train");
const BookingSchema = new mongoose.Schema({
    pnr:{type:String,required:true,unique:true},
    idempotencyKey:{type:String,index:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    TrainId:{type:mongoose.Schema.Types.ObjectId,ref:"Train",required:true},
    date:{type:String,required:true},
    class:{type:String,required:true},
    passengers:[{name:String,age:Number,gender:String}],
    seatsCount:{type:Number,required:true},
    amount:{type:Number,default:0},
    status:{type:String,enum:["PENDING","CONFIRMED","CANCELLED"],default:"PENDING"}
},{timestamps:true});
module.exports=mongoose.model("Booking",BookingSchema);