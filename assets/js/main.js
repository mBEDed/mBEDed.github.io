(function ($) {
    "use strict";

    $(document).ready(function ($) {

        // stikcy js
        $("#sticker").sticky({
            topSpacing: 0
        });

        //mean menu
        $('.main-menu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: "992"
        });

        // search form
        $(".search-bar-icon").on("click", function () {
            $(".search-area").addClass("search-active");
        });

        $(".close-btn").on("click", function () {
            $(".search-area").removeClass("search-active");
        });


        // Initialize Native Carousels
        if (typeof NativeCarousel !== 'undefined') {
            // Homepage slider
            const homepageSlider = new NativeCarousel('.homepage-slider', {
                items: 1,
                loop: true,
                autoplay: true,
                autoplayTimeout: 5000,
                nav: true,
                navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
                responsive: {
                    0: {
                        nav: false
                    },
                    600: {
                        nav: true
                    },
                    1000: {
                        nav: true
                    }
                }
            });

            // Homepage slider animation events
            const sliderEl = document.querySelector('.homepage-slider');
            if (sliderEl) {
                sliderEl.addEventListener('carousel:translate', function () {
                    $(".hero-text-tablecell .subtitle").removeClass("animated fadeInUp").css({ 'opacity': '0' });
                    $(".hero-text-tablecell h1").removeClass("animated fadeInUp").css({ 'opacity': '0', 'animation-delay': '0.3s' });
                    $(".hero-btns").removeClass("animated fadeInUp").css({ 'opacity': '0', 'animation-delay': '0.5s' });
                });

                sliderEl.addEventListener('carousel:dragmove', function () {
                    $(".hero-text-tablecell .subtitle").removeClass("animated fadeInUp").css({ 'opacity': '0' });
                    $(".hero-text-tablecell h1").removeClass("animated fadeInUp").css({ 'opacity': '0', 'animation-delay': '0.3s' });
                    $(".hero-btns").removeClass("animated fadeInUp").css({ 'opacity': '0', 'animation-delay': '0.5s' });
                });

                sliderEl.addEventListener('carousel:translated', function () {
                    $(".hero-text-tablecell .subtitle").addClass("animated fadeInUp").css({ 'opacity': '0' });
                    $(".hero-text-tablecell h1").addClass("animated fadeInUp").css({ 'opacity': '0', 'animation-delay': '0.3s' });
                    $(".hero-btns").addClass("animated fadeInUp").css({ 'opacity': '0', 'animation-delay': '0.5s' });
                });
            }

            // Testimonial slider - uses fade effect instead of slide
            const testimonialEl = document.querySelector('.testimonial-sliders');
            if (testimonialEl) {
                initTestimonialCarousel(testimonialEl);
            }
        }

        // Custom testimonial carousel with fade effect
        function initTestimonialCarousel(container) {
            const slides = container.querySelectorAll('.single-testimonial-slider');
            if (slides.length === 0) return;

            let currentIndex = 0;
            const autoplayTimeout = 5000;
            let autoplayInterval = null;
            let isPaused = false;

            // Calculate the tallest slide height and set container height
            function setContainerHeight() {
                let maxHeight = 0;
                slides.forEach(slide => {
                    slide.style.position = 'relative';
                    slide.style.visibility = 'hidden';
                    slide.style.display = 'block';
                    const height = slide.offsetHeight;
                    if (height > maxHeight) maxHeight = height;
                });
                container.style.height = maxHeight + 'px';

                // Reset slides to initial state
                slides.forEach((slide, index) => {
                    slide.style.visibility = '';
                    slide.style.position = 'absolute';
                    slide.style.opacity = index === 0 ? '1' : '0';
                    slide.style.top = '0';
                    slide.style.left = '0';
                    slide.style.width = '100%';
                    slide.style.transition = 'opacity 800ms ease';
                    if (index === 0) {
                        slide.classList.add('active');
                        slide.style.position = 'relative';
                    }
                });
            }

            // Container needs relative positioning
            container.style.position = 'relative';
            container.style.overflow = 'hidden';

            // Set initial height
            setContainerHeight();

            // Recalculate on resize
            window.addEventListener('resize', setContainerHeight);

            function nextSlide() {
                if (isPaused) return;

                slides[currentIndex].style.opacity = '0';
                slides[currentIndex].style.position = 'absolute';
                slides[currentIndex].classList.remove('active');

                currentIndex = (currentIndex + 1) % slides.length;

                slides[currentIndex].style.opacity = '1';
                slides[currentIndex].style.position = 'relative';
                slides[currentIndex].classList.add('active');
            }

            function startAutoplay() {
                if (autoplayInterval) return;
                autoplayInterval = setInterval(nextSlide, autoplayTimeout);
            }

            function pauseAutoplay() {
                isPaused = true;
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                }
            }

            function resumeAutoplay() {
                isPaused = false;
                startAutoplay();
            }

            // Pause on hover for testimonials
            container.addEventListener('mouseenter', pauseAutoplay);
            container.addEventListener('mouseleave', resumeAutoplay);

            startAutoplay();
        }



        // industries carousel
        function initIndustriesCarousel(container) {
            const slides = container.querySelectorAll('.single-industry-slider');
            if (slides.length === 0) return;

            let currentIndex = 0;
            const autoplayTimeout = 5000;
            let autoplayInterval = null;
            let isPaused = false;

            // Calculate the tallest slide height and set container height
            function setContainerHeight() {
                let maxHeight = 0;
                slides.forEach(slide => {
                    slide.style.position = 'relative';
                    slide.style.visibility = 'hidden';
                    slide.style.display = 'block';
                    const height = slide.offsetHeight;
                    if (height > maxHeight) maxHeight = height;
                });
                container.style.height = maxHeight + 'px';

                // Reset slides to initial state
                slides.forEach((slide, index) => {
                    slide.style.visibility = '';
                    slide.style.position = 'absolute';
                    slide.style.opacity = index === 0 ? '1' : '0';
                    slide.style.top = '0';
                    slide.style.left = '0';
                    slide.style.width = '100%';
                    slide.style.transition = 'opacity 800ms ease';
                    if (index === 0) {
                        slide.classList.add('active');
                        slide.style.position = 'relative';
                    }
                });
            }

            // Container needs relative positioning
            container.style.position = 'relative';
            container.style.overflow = 'hidden';

            // Set initial height
            setContainerHeight();

            // Recalculate on resize
            window.addEventListener('resize', setContainerHeight);

            function nextSlide() {
                if (isPaused) return;

                slides[currentIndex].style.opacity = '0';
                slides[currentIndex].style.position = 'absolute';
                slides[currentIndex].classList.remove('active');

                currentIndex = (currentIndex + 1) % slides.length;

                slides[currentIndex].style.opacity = '1';
                slides[currentIndex].style.position = 'relative';
                slides[currentIndex].classList.add('active');
            }

            function startAutoplay() {
                if (autoplayInterval) return;
                autoplayInterval = setInterval(nextSlide, autoplayTimeout);
            }

            function pauseAutoplay() {
                isPaused = true;
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                }
            }

            function resumeAutoplay() {
                isPaused = false;
                startAutoplay();
            }

            // Pause on hover for testimonials
            container.addEventListener('mouseenter', pauseAutoplay);
            container.addEventListener('mouseleave', resumeAutoplay);

            startAutoplay();
        }

        // count up - animate when elements come into view
        const animationDuration = 2500; // Slightly longer for smoother feel

        // Smooth easing function (ease-out-cubic for more natural feel)
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        const animateCountUp = el => {
            const countTo = parseInt(el.getAttribute('data-count') || el.innerHTML, 10);
            const startTime = performance.now();
            el.innerHTML = '0'; // Start from 0

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);

                // Apply smooth easing
                const easedProgress = easeOutCubic(progress);
                const currentCount = Math.round(countTo * easedProgress);

                // Update display
                el.innerHTML = currentCount;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Ensure final value is exact
                    el.innerHTML = countTo;
                    el.classList.add('animated'); // Mark as animated
                }
            };

            requestAnimationFrame(updateCount);
        };

        // Intersection Observer for scroll-triggered animations
        const countupEls = document.querySelectorAll('.timer');

        // Store original values
        countupEls.forEach(el => {
            if (!el.getAttribute('data-count')) {
                el.setAttribute('data-count', el.innerHTML);
            }
            el.innerHTML = '0'; // Start with 0
        });

        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    animateCountUp(entry.target);
                }
            });
        }, {
            threshold: 0.5, // Trigger when 50% of element is visible
            rootMargin: '0px 0px -100px 0px' // Trigger a bit before fully visible
        });

        // Observe all counter elements
        countupEls.forEach(el => observer.observe(el));


    });


    jQuery(window).on("load", function () {
        jQuery(".loader").fadeOut(1000);
    });


}(jQuery));