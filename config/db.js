const mongoose = require("mongoose")
require('dotenv').config();
// Function to connect to the MonngoDB databse

mongoose.connect(
    process.env.DATABASE_URL 
).then(() => {
    console.log("Connected to MongoDB")
}).catch((error) => {
    console.error("Connection error:", error);
});

module.exports = mongoose ;
