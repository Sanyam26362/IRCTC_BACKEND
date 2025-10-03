require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Train = require("../models/Train");
const User = require("../models/User");
const Availability = require("../models/Availability");

(async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB connected");

    console.log("Clearing old data...");
    await Train.deleteMany({});
    await User.deleteMany({});
    await Availability.deleteMany({});

    console.log("Creating admin user...");
    const salt = await bcrypt.genSalt(10);
    await User.create({
      name: "Sanyam",
      email: "sanyam2410147@akgec.ac.in",
      passwordHash: await bcrypt.hash("adminpass", salt),  
      role: "admin"
    });

    console.log("Inserting sample trains...");
    const trains = [
      {
        number: "12345",
        name: "Shatabdi Express",
        route: [
          { stationCode: "NDLS", stationName: "New Delhi", arrival: "00:00", departure: "06:00", index: 0 },
          { stationCode: "LKO", stationName: "Lucknow", arrival: "10:00", departure: "10:10", index: 1 }
        ],
        classes: ["SL","3A"],
        totalSeats: { SL: 100, "3A": 72 }
      },
      {
        number: "54321",
        name: "Intercity Express",
        route: [
          { stationCode: "NDLS", stationName: "New Delhi", arrival: "00:00", departure: "07:00", index: 0 },
          { stationCode: "GWL", stationName: "Gwalior", arrival: "08:30", departure: "08:40", index: 1 },
          { stationCode: "BPL", stationName: "Bhopal", arrival: "12:00", departure: "12:15", index: 2 }
        ],
        classes: ["SL","3A","2A"],
        totalSeats: { SL: 120, "3A": 72, "2A": 40 }
      }
    ];
    await Train.insertMany(trains);

    console.log("Seeding availability for next 7 days for each train/class...");
    const trainsDb = await Train.find({});
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().split("T")[0];
    });

    const availabilityDocs = [];
    for (const t of trainsDb) {
      for (const date of dates) {
        for (const cls of t.classes) {
          availabilityDocs.push({
            trainId: t._id,
            date,
            class: cls,
            seatsAvailable: t.totalSeats[cls] || 0
          });
        }
      }
    }
    await Availability.insertMany(availabilityDocs);

    console.log(" Seed complete.");
    console.log(" Login with: sanyam2410147@akgec.ac.in / adminpass");

    process.exit(0);
  } catch (err) {
    console.error(" Seed error", err);
    process.exit(1);
  }
})();
