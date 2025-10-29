document.addEventListener('DOMContentLoaded', () => {

    // --- Intersection Observer for fade-in animations ---
    const fadeInElements = document.querySelectorAll('.fade-in-element');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        fadeInElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers
        fadeInElements.forEach(element => {
            element.classList.add('is-visible');
        });
    }

    // --- Modal Handling ---
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloseButtons = document.querySelectorAll('.modal-close-btn, .modal-overlay');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
             // Close only if the overlay itself is clicked, not its children (the modal content)
            if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('modal-close-btn')) {
                 const modal = button.closest('.modal-overlay');
                 if(modal) {
                    modal.classList.remove('active');
                 }
            }
        });
    });
    
     // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

});
