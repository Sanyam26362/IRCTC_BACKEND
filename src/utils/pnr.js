const {v4:uuidv4 }=require("uuid");
function generatePNR() {
    return 'PNR' + uuidv4.replace(/-/g,'').slice(0,10).toUpperCase();

}
module.exports={generatePNR};