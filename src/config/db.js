const mongoose = require("mongoose");
const connectionDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI),
        console.log(`MONGODB CONNECTED: ${connectionDB.connection.host}`);
        } catch(error) {
            console.error("MONGODB CONNECTION FAILED",error.message);
            process.exit(1);

        }
};
module.exports= connectionDB;