const mongoose = require('mongoose') 
mongoose.set('strictQuery', true)
const mongoURI = process.env.VITE_MONGO_URI

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoURI)
        
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB