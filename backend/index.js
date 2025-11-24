const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config()
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendence');
const leaveRoutes = require('./routes/leave');
const adminRoutes = require('./routes/admin');
const path = require('path');
const app = express();
const _dirname  =path.resolve();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/admin', adminRoutes);
app.use(express.static(path.join(_dirname,"frontend/react/dist")));
app.get((_, res) => {
   res.sendFile(path.resolve(_dirname,"frontend/react","dist","index.html"));
})

const connectDB = async()=>{
 const data = await mongoose.connect(process.env.MONGODB_URI)
 if(data){
    console.log("MongoDB is Connected")
 }
 else{
  console.log("Failed to Connected")
 }
}
connectDB()


const PORT = process.env.PORT ;
app.listen(PORT, () => console.log( `Server running on port http://localhost:${PORT}`));