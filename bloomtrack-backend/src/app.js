const express = require('express')
require("./db/mongoose")
const userProfile = require("./routes/userProfileRoutes")
const products = require('./routes/productRoutes')
const orders = require('./routes/orderRoutes')
// const Grid = require('gridfs-stream') 
// const mongoose = require('mongoose')
const auth = require('./routes/authRoutes')
const upload = require('./routes/upload')
const { connect } = require('http2')

const cors = require("cors");

const app = express()
const corsOptions = {
    origin: "*", // or specify your allowed origin
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"]
};


app.listen(3500, () => {
    console.log("Server is running on port 3500");
});


app.use(cors(corsOptions));
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin','*')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.use(express.json())
app.use(userProfile)
app.use(products)
app.use(orders)
app.use(auth)
app.use(upload)




module.exports = app