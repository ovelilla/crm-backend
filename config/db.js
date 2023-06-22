import mongoose from "mongoose";

const connectToMongoDB = async () => {
    return await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth: {
            username: process.env.MONGO_USER,
            password: process.env.MONGO_PASS,
        },
    });
};

const connectDB = async (retryCount = 5, delay = 2000) => {
    mongoose.set("strictQuery", true);

    for (let retries = 0; retries < retryCount; retries++) {
        try {
            const conn = await connectToMongoDB();

            const url = `${conn.connection.host}:${conn.connection.port}`;
            console.log(`MongoDB connected on: ${url}`);
            return;
        } catch (error) {
            console.log(
                `Error: ${error.message}. Retrying in ${delay / 1000}seconds...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    console.log(
        `Error: Could not connect to MongoDB after ${retryCount} retries. Exiting process...`
    );
    process.exit(1);
};

export default connectDB;
