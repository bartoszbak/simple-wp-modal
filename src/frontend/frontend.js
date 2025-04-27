document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple Modal: Initializing...');
    
    // Initialize all modals
    const modals = document.querySelectorAll('.simple-modal');
    console.log('Simple Modal: Found', modals.length, 'modals');
    
    // Keep track of active modal
    let activeModal = null;
    
    // Create a map of modal IDs to their corresponding modal elements
    const modalMap = new Map();
    
    // Function to handle URL hash for direct modal opening
    const handleHash = () => {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash && modalMap.has(hash)) {
            console.log('Simple Modal: Opening modal from URL hash:', hash);
            const modal = modalMap.get(hash);
            // Small delay to ensure proper rendering
            setTimeout(() => {
                const modalContent = modal.querySelector('.simple-modal-content');
                
                // Reset any existing animation classes
                modal.classList.remove('closing', 'active');
                modalContent.classList.remove('closing', 'active');
                
                // Show modal and prepare for animation
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                modal.setAttribute('aria-hidden', 'false');
                
                // Trigger reflow
                modal.offsetHeight;
                
                // Start entrance animation
                requestAnimationFrame(() => {
                    modal.classList.add('active');
                    modalContent.classList.add('active');
                });
                
                activeModal = modal;
            }, 100);
        }
    };
    
    // Single Escape key handler for all modals
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape' && activeModal) {
            console.log('Simple Modal: Escape key pressed');
            closeModal(activeModal);
        }
    };
    
    // Add single event listener for Escape key
    document.addEventListener('keydown', handleEscapeKey);
    
    modals.forEach(modal => {
        const modalId = modal.getAttribute('id');
        const closeOnOutsideClick = modal.getAttribute('data-close-on-outside-click') === 'true';
        const customCloseButtonId = modal.getAttribute('data-custom-close-button');
        
        if (modalId) {
            modalMap.set(modalId, modal);
        }
        
        const closeButton = modal.querySelector('.simple-modal-close');
        const modalContent = modal.querySelector('.simple-modal-content');
        
        // Set ARIA attributes for accessibility
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `${modalId}-title`);
        
        // Close modal when clicking the default close button
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                console.log('Simple Modal: Close button clicked');
                closeModal(modal);
            });
        }

        // Set up custom close button if specified
        if (customCloseButtonId) {
            const customCloseButton = document.getElementById(customCloseButtonId);
            if (customCloseButton) {
                customCloseButton.addEventListener('click', () => {
                    console.log('Simple Modal: Custom close button clicked');
                    closeModal(modal);
                });
            } else {
                console.warn(`Simple Modal: Custom close button with ID "${customCloseButtonId}" not found`);
            }
        }

        // Close modal when clicking outside (only if closeOnOutsideClick is true)
        if (closeOnOutsideClick) {
            const overlay = modal.querySelector('.simple-modal-overlay');
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    console.log('Simple Modal: Clicked outside modal');
                    closeModal(modal);
                }
            });
        }

        // Function to close modal with animation
        const closeModal = (modal) => {
            if (!modal) return;
            
            const content = modal.querySelector('.simple-modal-content');
            
            // Remove active classes first to ensure proper animation
            modal.classList.remove('active');
            content.classList.remove('active');
            
            // Add closing classes after a small delay to ensure proper animation
            requestAnimationFrame(() => {
                modal.classList.add('closing');
                content.classList.add('closing');
                
                // Set aria-hidden
                modal.setAttribute('aria-hidden', 'true');
                
                // Wait for animation to complete
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    activeModal = null;
                    
                    // Clean up all animation classes
                    modal.classList.remove('closing');
                    content.classList.remove('closing');
                }, 300);
            });
        };

        // Function to open modal with animation
        const openModal = (e) => {
            console.log('Simple Modal: Opening modal with ID:', modalId);
            e.preventDefault();
            
            // Close any active modal
            if (activeModal && activeModal !== modal) {
                closeModal(activeModal);
            }
            
            // Reset any existing animation classes
            modal.classList.remove('closing', 'active');
            modalContent.classList.remove('closing', 'active');
            
            // Show modal and prepare for animation
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            modal.setAttribute('aria-hidden', 'false');
            
            // Trigger reflow
            modal.offsetHeight;
            
            // Start entrance animation
            requestAnimationFrame(() => {
                modal.classList.add('active');
                modalContent.classList.add('active');
            });
            
            activeModal = modal;
        };

        // Store the openModal function for this modal
        modal.openModal = openModal;
    });
    
    // Add click event listeners to elements with matching id
    document.querySelectorAll('*').forEach(element => {
        const elementId = element.id;
        if (elementId && modalMap.has(elementId)) {
            const targetModal = modalMap.get(elementId);
            element.addEventListener('click', targetModal.openModal);
        }
    });
    
    // Check hash on page load and handle hash changes
    handleHash();
    window.addEventListener('hashchange', handleHash);
    
    // Cleanup function to remove event listeners when needed
    const cleanup = () => {
        document.removeEventListener('keydown', handleEscapeKey);
        window.removeEventListener('hashchange', handleHash);
    };
    
    // Clean up event listeners when the page is unloaded
    window.addEventListener('unload', cleanup);
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const header = modal.querySelector('.simple-modal-header');
    const title = modal.querySelector('.simple-modal-title');
    
    // Add titleless class if there's no title
    if (!title) {
        header.classList.add('titleless');
    }

    modal.classList.add('simple-modal-open');
    document.body.style.overflow = 'hidden';
} 