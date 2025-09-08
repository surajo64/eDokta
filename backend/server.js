import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRouter.js'
import './cronJobs.js'; // Import the cron job file
// app config

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// midlewares
app.use(express.json())
app.use(cors())

//API endpoint
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.get('/', (req, res) => {
  res.send('API IS WORKING PERFECT')
})
app.listen(port, () => console.log("Server Statrted", port))