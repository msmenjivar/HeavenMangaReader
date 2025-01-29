// models/Manga.js.
const mongoose = require('mongoose');

// Define the Manga schema.
const mangaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    chapters: [{
        chapterNumber: Number,
        title: String,
        pages: [String], // Array of image URLs or page content.
    }, ],
});

// Create the Manga model
const Manga = mongoose.model('Manga', mangaSchema);

module.exports = Manga;