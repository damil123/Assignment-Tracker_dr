// Wait for page to load completely
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all delete buttons
    const deleteButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
    
    // Add click event to each delete button
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Log to console for debugging
            console.log('Delete button clicked');
        });
    });
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            // Fade out alert
            alert.style.opacity = '0';
            // Remove from page after fade
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
    
    // Set minimum date for due date input to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        // Only set min date if input is empty (for add form, not edit)
        if (!input.value) {
            input.min = today;
        }
    });
    
});

// Function to confirm delete (backup if modal doesn't work)
function confirmDelete(assignmentTitle) {
    return confirm(`Are you sure you want to delete "${assignmentTitle}"? This cannot be undone.`);
}