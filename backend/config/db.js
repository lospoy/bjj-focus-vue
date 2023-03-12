const mongoose = require('mongoose') 
mongoose.set('strictQuery', true)

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://carlos:KUw4BwEw4fSjJ3J5HUA9@clusterbjj.o8jxer4.mongodb.net/?retryWrites=true&w=majority')
        
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB