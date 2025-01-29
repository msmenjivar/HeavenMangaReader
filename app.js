//Import required modules
const express = require('express');
const session = require('express-session'); // For managing sessions.
const passport = require('passport'); // Main Passport.js library.
const LocalStrategy = require('passport-local').Strategy; // Local strategy for username/password.
const bcrypt = require('bcrypt'); // For hashing passwords.
const flash = require('connect-flash'); // For displaying flash messages.
const mongoose = require('mongoose'); // Add mongoose for MongoDB connection.
const User = require('./models/User');
const Manga = require('./models/Manga'); // Import Manga model.

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection.
mongoose.connect('mongodb+srv://moisesmenjivar:ZVHMc0sIPub4wEM5@heavenmangacluster.ocxnf.mongodb.net/?retryWrites=true&w=majority&appName=HeavenMangaCluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Middleware to parse incoming request bodies (needed for form submissions).
app.use(express.urlencoded({ extended: false }));

// Set up session management with Express-Session.
app.use(session({
    secret: 'yourSecretKey', // Replace with a strong secret key for production.
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and configure it to use sessions.
app.use(passport.initialize());
app.use(passport.session());

// Use connect-flash for flash messages.
app.use(flash());

// Define a route to display all mangas.
app.get('/mangas', (req, res) => {
    Manga.find({}, (err, mangas) => {
        if (err) {
            return res.send('Error fetching manga list.');
        }
        res.send(mangas.map(mangas => `<h3>${manga.title}</h3><p>${manga.description}</p>`).join(''));
    });
});

// Define a route to add a new manga.
app.post('/mangas', (req, res) => {
    const { title, description, author } = req.body;

    // Create a new manga document.
    const newManga = new Manga({
        title,
        description,
        author,
        chapters: [], // Start with no chapters.
    });

    // Save the new manga to the database.
    newManga.save((err) => {
        if (err) {
            req.flash('error', 'Error adding manga.');
            return res.redirect('/mangas');
        }
        res.redirect('/mangas');
    });
});

// Define a route to read a specific manga chapter.
app.get('/manga/:title/chapter/:number', (req, res) => {
    const { title, number } = req.params;

    // Find the manga and the specific chapter.
    Manga.findOne({ title }, (err, manga) => {
        if (err || !manga) {
            return res.send('Manga not found.');
        }

        const chapter = manga.chapters.find(chap => chap.chapterNumber === parseInt(number, 10));

        if (!chapter) {
            return res.send('Chapter not found.');
        }

        // Display the chapter pages (you can replace this with a proper rendering of pages)
        res.send(chapter.pages.map(page => `< img scr = "${page}" alt = "Manga page" >`).join(''));
    });
});

// Configure Passport to use the local strategy.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // Find the user in the users array.
        const user = users.find(u => u.username === username);
        if (!user) {
            // If user is not found, authentication fails.
            return done(null, false, { message: 'Incorrect username.' });
        }

        // Compare the password using bcrypt.
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return done(err);
            if (!result) {
                // Passwords do not match.
                return done(null, false, { message: 'Incorrect password.' });
            }
            // Successful authentication.
            return done(null, user);
        });
    }));

// Serialize user instance to the session.
passport.serializeUser((user, done) => {
    done(null, user.username);
});

// Deserialize user instance from the session.
passport.deserializeUser((username, done) => {
    const user = users.find(u => u.username === username);
    done(null, user);
});

// Route to show a simple login form with feedback messages.
app.get('/login', (req, res) => {
            // Retrieve flash messages from the session.
            const errorMessages = req.flash('error');
            res.send(`
		<form action = "/login"method = "POST" >
			<div>
				<label> Username: </label>
				<input type = "text" name = "username" required>
			</div>
			<div>
				<label> Password: </label>
				<input type = "password" name = "password" required>
			</div>
			<button type = "submit"> Login </button>
			${errorMessages.length > 0 ? `<p style = "color:red;"> ${errorMessages.join('<br>')}</p>`:''}
		</form>
         	`);
});

// Route to handle login POST requests with feedback on failure.
app.post('/login', passport.authenticate('local', {
    successRedirect: '/success', // Redirect here if login is successful.
    failureRedirect: '/login', // Redirect back to login on failure.
    failureFlash: true // Enable flash messages for failures.
}));

// Route to handle successful login.
app.get('/success', (req, res) => {
    if(req.isAuthenticated()){
        res.send('Login successful! Welcome ' + req.user.username);}
    else{
        res.redirect('/login');}
});

// Route to handle logout.
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

// Route to handle user registration (sign-up) with error feedback.
app.get('/register', (req, res) => {
    // Retrieve flash messages for errors
    const errorMessages = req.flash('error');
    res.send(`
	<form action = "/register" method = "POST">
		<div>
			<label> Username: </label>
		    <input type = "text" name = "username" required>
		</div>
		<div>
            <label> Password: </label>
			<input type = "password" name = "password" required>
		</div>
		<button type = "submit"> Register </button>
        ${errorMessages.length > 0 ? `<p style="color:red;">${errorMessages.join('<br>')}</p>`: '' }
	</form>
	`);
});

// Handle registration form submissions with error handling.
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already taken.
    const existingUser = users.find(u => u.username === username);
    if(existingUser){
        // Add flash message and render the registration form with error.
        req.flash('error', 'Username already exists.');
        return res.redirect('/register'); // Corrected to redirect properly to register.
    }
    
    // Hash the password before storing.
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            req.flash('error', 'Error register user.');
            return res.redirect('/register.'); // Redirect to registration with error feedback.
        }

        // Add the new user to the in-memory user store.
        users.push({
            username,
            password: hashedPassword
        });
        res.redirect('/login');
    });
});

// Test route to add a manga and retrieve it.
app.get('/test-manga', async (req, res)=>{
    try{
        // Create a new manga instance.
        const newManga = new Manga({
            title: 'Test Manga',
            description: 'A test manga for verification purposes.',
            author: 'Test Author',
            chapters:[
                {
                    chapterNumber:1,
                    title:'Chapter 1',
                    pages:['https://example.com/page1.jpg', 'https://example.com/page2.jpg'],
                },
            ],
        });

        // Save the manga to the database.
        await newManga.save();

        // Retrieve the saved manga from the database.
        const manga = await Manga.findOne({title:'Test Manga'});

        // Send the retrieved manga as a response.
        res.send(manga);
    } catch(err){
        console.error('Error testing Manga model:', error);
        res.status(500).send('Error testing Manga model');
    }
});

// Start the server.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});