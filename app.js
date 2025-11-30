// app.js
// Main application file with Express server and authentication setup
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware - parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Session configuration - needed for passport authentication
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Serialize user - stores user info in session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user - retrieves user info from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`
},
(accessToken, refreshToken, profile, done) => {
    // Store user profile information
    const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google'
    };
    return done(null, user);
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}/auth/github/callback`
},
(accessToken, refreshToken, profile, done) => {
    // Store user profile information
    const user = {
        id: profile.id,
        name: profile.displayName || profile.username,
        email: profile.emails ? profile.emails[0].value : null,
        provider: 'github'
    };
    return done(null, user);
}));

// Authentication Routes

// Google Login
app.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

// Google Callback
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/assignments');
    }
);

// GitHub Login
app.get('/auth/github', passport.authenticate('github', { 
    scope: ['user:email'] 
}));

// GitHub Callback
app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/assignments');
    }
);

// Logout
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) console.error(err);
        res.redirect('/');
    });
});

// Make user available to all views
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routes
const routes = require('./routes/index');
app.use('/', routes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});