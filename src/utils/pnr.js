const {v4:uuidv4 }=require("uuid");
function generatePNR() {
    // CRITICAL FIX: Call uuidv4() to get the string before calling replace().
    return 'PNR' + uuidv4().replace(/-/g,'').slice(0,10).toUpperCase(); 
}

module.exports={generatePNR};
