import express from 'express';
import {config} from 'dotenv';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from "./controllers/clerkWebhooks.js";

config();
connectDB();

const app = express()
app.use(cors())


//Middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to clerkWebhooks
app.use("/api/clerk", clerkWebhooks);

app.get('/', (req,res)=> res.send("API is working"))

if (process.env.NODE_ENV !== 'production') {
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
}

export default app;
