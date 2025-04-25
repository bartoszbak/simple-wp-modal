document.addEventListener('DOMContentLoaded', function() {
    // Get all modals
    const modals = document.querySelectorAll('.simple-modal');
    
    modals.forEach(modal => {
        const modalId = modal.getAttribute('id');
        const closeOnOutsideClick = modal.getAttribute('data-close-on-outside-click') === 'true';
        const overlay = modal.querySelector('.simple-modal-overlay');
        const content = modal.querySelector('.simple-modal-content');
        
        // Add click event listener to the overlay
        if (closeOnOutsideClick) {
            overlay.addEventListener('click', function(e) {
                // Only close if clicking directly on the overlay
                if (e.target === overlay) {
                    closeModal(modalId);
                }
            });
        }
        
        // Prevent clicks inside the modal content from closing the modal
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Function to open modal
    window.openModal = function(modalId) {
        const modal = document.querySelector(`.simple-modal#${modalId}`);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };
    
    // Function to close modal
    window.closeModal = function(modalId) {
        const modal = document.querySelector(`.simple-modal#${modalId}`);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };
}); 