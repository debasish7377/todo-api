const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');

const connectDB = async() => {
    const conn = await mongoose.connect(process.env.MONGO_IRI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    console.log(`MongoDB Connected ${conn.connection.host}`.cyan.bold)
}

module.exports = connectDB