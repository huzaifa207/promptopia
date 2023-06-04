import mongoose from "mongoose";

let isConnected = false

export const connectDB = async () => {
    mongoose.set('strictQuery', true)

    if(isConnected) {
        console.log("MongoDb is already connected!");
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "promptopia",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        isConnected = true
        console.log("MongoDB connected");
    } catch (error) {
        console.error(error)
    }
}