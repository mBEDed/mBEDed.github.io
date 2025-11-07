document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.testimonial-wrapper');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');

    let currentSlide = 0;
    let autoplayInterval = null;
    const autoplayDelay = 5000; // 5 seconds

    // Create navigation dots
    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Update active state
    function updateSlideState() {
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateSlideState();
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlideState();
    }

    // Start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    // Initialize
    createDots();
    updateSlideState();
    startAutoplay();

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoplayInterval); // Stop autoplay on touch
    });

    wrapper.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        } else if (touchEndX - touchStartX > 50) {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlideState();
        }
        startAutoplay(); // Restart autoplay after touch
    });

    // Handle dot clicks
    dotsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('dot')) {
            const dots = Array.from(document.querySelectorAll('.dot'));
            const index = dots.indexOf(e.target);
            goToSlide(index);
        }
    });
});