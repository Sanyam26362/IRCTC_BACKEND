const Availability= require("../models/Availability");
const Train=require("../models/Train");
const getAvailability = async(req,res,next)=>{
    try{
        const {trainId} = req.params;
        const {date,class:cls} = req.query;
        if(!date||!cls) return res.status(400).json({message:"date and class required"});
        const avail = await Availability.findOne({trainId,date,class:cls});
        res.json(avail||{seatsAvailable: 0});
    } catch (err){next(err);}
};
const seedAvailabilityForTrainDate = async(req,res,next) =>{
    try{
        const {trainId,date} =req.body;
        if(!trainId||!date) return res.status(400).json({message:"Train Id & Date required"});
        const train = await Train.findById(trainId);
        if(!train) return res.status(404).json({message:"Train Not found"});
        const ops = train.classes.map(cls=>({
            updateOne: {
                filter: {trainId,date,class:cls},
                update: {$setOnInsert:{trainId,date,class:cls,seatsAvailable:train.totalSeats?.[cls]||0}},
                upsert:true
            }
        }));
        await Availability.bulkWrite(ops);
        res.json({message:"Seeded Availability"});
    } catch(err) {next(err);}
};
module.exports={getAvailability,seedAvailabilityForTrainDate}

