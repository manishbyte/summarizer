const express = require("express");
const cookieParser = require('cookie-parser');
const scraperRoutes = require("./routes/scraperRoutes");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({
   origin:`${process.env.FRONTEND_URL}`,
   methods:['GET','POST','DELETE'],  
   credentials: true

}))
app.use(cookieParser());
// Database Connection
connectDB();
// Routes
app.use('/api/auth', authRoutes);
app.use("/api", scraperRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
