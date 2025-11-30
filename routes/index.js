// Main routes file for the Assignment Tracker
// Handles all pages + CRUD actions for assignments

const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// Basic middleware to check if a user is logged in
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/'); // send them back to home if not logged in
}

/* ---------------- HOME PAGE ---------------- */
// GET / — main landing page
router.get('/', (req, res) => {
    res.render('home');
});

/* ---------------- READ: VIEW ALL ASSIGNMENTS ---------------- */
// GET /assignments — anyone can view the list
router.get('/assignments', async (req, res) => {
    try {
        // load all assignments sorted by due date (earlier first)
        const assignments = await Assignment.find().sort({ dueDate: 1 });
        res.render('list', { assignments });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).send('Error loading assignments');
    }
});

/* ---------------- CREATE: ADD ASSIGNMENT ---------------- */
// GET /assignments/add — show form (login required)
router.get('/assignments/add', isAuthenticated, (req, res) => {
    res.render('add');
});

// POST /assignments/add — save new assignment to DB
router.post('/assignments/add', isAuthenticated, async (req, res) => {
    try {
        // create assignment using form data
        const newAssignment = new Assignment({
            courseName: req.body.courseName,
            title: req.body.title,
            dueDate: req.body.dueDate,
            status: req.body.status,
            priority: req.body.priority,
            description: req.body.description,
            createdBy: req.user.name // track who created it
        });

        await newAssignment.save(); // save in database
        res.redirect('/assignments'); // go back to list
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).send('Error creating assignment');
    }
});

/* ---------------- UPDATE: EDIT ASSIGNMENT ---------------- */
// GET /assignments/edit/:id — show edit form
router.get('/assignments/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).send('Assignment not found');
        }

        res.render('edit', { assignment });
    } catch (error) {
        console.error('Error loading assignment:', error);
        res.status(500).send('Error loading assignment');
    }
});

// POST /assignments/edit/:id — update in DB
router.post('/assignments/edit/:id', isAuthenticated, async (req, res) => {
    try {
        await Assignment.findByIdAndUpdate(req.params.id, {
            courseName: req.body.courseName,
            title: req.body.title,
            dueDate: req.body.dueDate,
            status: req.body.status,
            priority: req.body.priority,
            description: req.body.description
        });

        res.redirect('/assignments');
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).send('Error updating assignment');
    }
});

/* ---------------- DELETE: REMOVE ASSIGNMENT ---------------- */
// POST /assignments/delete/:id — delete from DB
router.post('/assignments/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        res.redirect('/assignments');
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).send('Error deleting assignment');
    }
});

// export routes to be used in app.js
module.exports = router;
