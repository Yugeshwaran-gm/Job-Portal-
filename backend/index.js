import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;
const MONGOURL = process.env.MONGO_URL;

if (!MONGOURL) {
    console.error("MongoDB connection string (MONGO_URL) is not defined in environment variables.");
    process.exit(1);
}

// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors());
// app.use('/api/user', router);

mongoose.connect(MONGOURL)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
    });
