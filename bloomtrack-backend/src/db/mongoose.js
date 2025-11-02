// const mongoose = require('mongoose')
// // not 
// mongoose.set("strictQuery", true);

// const db = mongoose.connect(process.env.MONGOOSE_CONNECTION_URL,
//     {
//         useNewUrlParser: true,
//         autoIndex:true,
//         useUnifiedTopology: true
//     })
// console.log("mongo connect")
// module.exports = db

const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB Connected Successfully");
  } catch (err) {
    console.error(" Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
