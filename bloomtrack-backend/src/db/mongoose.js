const mongoose = require('mongoose')
mongoose.set("strictQuery", true);
const db = mongoose.connect(process.env.MONGOOSE_CONNECTION_URL,
    {
        useNewUrlParser: true,
        autoIndex:true,
        useUnifiedTopology: true
    })

module.exports = db