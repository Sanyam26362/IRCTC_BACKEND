const mongoose=require("mongoose");
const AvailSchema = new mongoose.Schema({
    trainId: {type:mongoose.Schema.Types.ObjectId,ref:"Train",required:true},
    date:{type:String,required:true},
    class:{type:String,required:true},
    seatsAvailable:{type:Number,required:true}
},{timestamps:true});
AvailSchema.index=({trainId:1,date:1,class:1},{unique:true});
module.exports=mongoose.model("Availability".AvailSchema);