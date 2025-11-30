const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    // Course name (e.g., "INFR3120 - Web Scripting")
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    // Assignment title (e.g., "Final Project")
    title: {
        type: String,
        required: true,
        trim: true
    },
    // Due date
    dueDate: {
        type: Date,
        required: true
    },
    // Status: Not Started, In Progress, Completed
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    // Priority: Low, Medium, High
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    // Description of the assignment
    description: {
        type: String,
        default: ''
    },
    // Track who created this assignment
    createdBy: {
        type: String,
        default: 'Anonymous'
    },
    // Timestamp for when assignment was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});