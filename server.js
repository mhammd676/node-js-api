const express = require('express') 
const cors = require('cors');
const database =  require('./config/db')
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRouter');
const userRoutes = require('./routes/userRoutes');
const encrollmentRoutes = require('./routes/enrollmentRoute')


const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/encrollment' , encrollmentRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
