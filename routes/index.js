// Main routes file - handles all page routes and CRUD operations
const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// Middleware - Check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Redirect to home if not logged in
    res.redirect('/');
}

// ============= HOME PAGE =============
// GET / - Home page (splash page)
router.get('/', (req, res) => {
    res.render('home');
});

// ============= READ - VIEW ALL ASSIGNMENTS =============
// GET /assignments - Assignment list page (public - anyone can view)
router.get('/assignments', async (req, res) => {
    try {
        // Get all assignments from database, sorted by due date (earliest first)
        const assignments = await Assignment.find().sort({ dueDate: 1 });
        
        // Render list page with assignments
        res.render('list', { assignments });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).send('Error loading assignments');
    }
});

// ============= CREATE - ADD NEW ASSIGNMENT =============
// GET /assignments/add - Show add assignment form (protected - must be logged in)
router.get('/assignments/add', isAuthenticated, (req, res) => {
    res.render('add');
});

// POST /assignments/add - Create new assignment (protected)
router.post('/assignments/add', isAuthenticated, async (req, res) => {
    try {
        // Create new assignment object with form data
        const newAssignment = new Assignment({
            courseName: req.body.courseName,
            title: req.body.title,
            dueDate: req.body.dueDate,
            status: req.body.status,
            priority: req.body.priority,
            description: req.body.description,
            createdBy: req.user.name // Track who created it
        });

        // Save to database
        await newAssignment.save();
        
        // Redirect to assignment list
        res.redirect('/assignments');
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).send('Error creating assignment');
    }
});

// ============= UPDATE - EDIT ASSIGNMENT =============
// GET /assignments/edit/:id - Show edit form (protected)
router.get('/assignments/edit/:id', isAuthenticated, async (req, res) => {
    try {
        // Find assignment by ID
        const assignment = await Assignment.findById(req.params.id);
        
        // Check if assignment exists
        if (!assignment) {
            return res.status(404).send('Assignment not found');
        }
        
        // Render edit page with assignment data
        res.render('edit', { assignment });
    } catch (error) {
        console.error('Error loading assignment:', error);
        res.status(500).send('Error loading assignment');
    }
});

// POST /assignments/edit/:id - Update assignment (protected)
router.post('/assignments/edit/:id', isAuthenticated, async (req, res) => {
    try {
        // Update assignment with new data from form
        await Assignment.findByIdAndUpdate(req.params.id, {
            courseName: req.body.courseName,
            title: req.body.title,
            dueDate: req.body.dueDate,
            status: req.body.status,
            priority: req.body.priority,
            description: req.body.description
        });

        // Redirect back to assignment list
        res.redirect('/assignments');
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).send('Error updating assignment');
    }
});

// ============= DELETE - REMOVE ASSIGNMENT =============
// POST /assignments/delete/:id - Delete assignment (protected)
router.post('/assignments/delete/:id', isAuthenticated, async (req, res) => {
    try {
        // Delete assignment from database
        await Assignment.findByIdAndDelete(req.params.id);
        
        // Redirect back to assignment list
        res.redirect('/assignments');
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).send('Error deleting assignment');
    }
});

// Export router so app.js can use it
module.exports = router;