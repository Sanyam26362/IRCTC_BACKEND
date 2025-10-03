const Train = require("../models/Train");
const searchTrains = async(req,res,next)=>{
    try{
        const{from,to}=req.query;
        if(!from||!to) return res.status(400).json({message:"Provide from & to"});
        const trains = await Train.find({"route.stationCode":{$all:[from,to]}}).lean();
        const result = trains.filter(t=>{
            const idxFrom = t.route.findIndex(r=>r.stationCode===from);
            const idxTo = t.route.findIndex(r=>r.stationCode===to);
            return idxFrom >=0 && idxTo>=0 && idxFrom<idxTo;
        }).map(t=> {
            return t;
        });
        res.json(result);
   } catch (err) {next(err);}
};
const createTrain = async(req,res,next) =>{
    try{
        const created = await Train.create(req.body);
        res.status(201).json(created);

    } catch (err) { next(err);}
};
module.exports = {searchTrains,createTrain};