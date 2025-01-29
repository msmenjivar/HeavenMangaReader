// heavenmanga-backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection.
const authRoutes = require('./routes/auth.routes'); // Import authentication routes.
const app = express();
const bodyParser = require('body-parser');
const dbConfig = require('./config/db.config');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the 'public' directory.
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://moisesmenjivar:ZVHMc0sIPub4wEM5@heavenmangacluster.ocxnf.mongodb.net/?retryWrites=true&w=majority&appName=HeavenMangaCluster', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log('Connected to MongoDB');})
    .catch(err => {console.error('Could not connect to MongoDB', err);process.exit();});

// Use authentication routes for paths starting with /api/auth.
app.use('/api/auth', authRoutes);

// Example route for fetching manga.
app.get('/api/mangas', (req, res) =>{
    res.json([
        { _id: '1', title: 'Manga A', description: 'Description A', coverImage: 'http://localhost:5000/images/imageA.jpg' },
        { _id: '2', title: 'Manga B', description: 'Description B', coverImage: 'http://localhost:5000/images/imageB.jpg' },
        { _id: '3', title: 'Manga Fail', description: 'Test Image Fail', coverImage: 'http://localhost:5000/images/imageC.jpg'}
    ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});