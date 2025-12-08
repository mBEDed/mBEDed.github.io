/**
 * Native Carousel - A lightweight vanilla JavaScript carousel
 * Replaces Owl Carousel with native implementation
 * Features: seamless infinite loop, autoplay, navigation, touch/drag support with live feedback
 */
class NativeCarousel {
    constructor(element, options = {}) {
        this.container = typeof element === 'string' ? document.querySelector(element) : element;
        if (!this.container) return;

        // Default options
        this.options = {
            items: 1,
            loop: true,
            autoplay: false,
            autoplayTimeout: 5000,
            nav: false,
            dots: false,
            navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
            responsive: {},
            animationDuration: 500,
            touchEnabled: true,
            dragThreshold: 50,
            ...options
        };

        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchCurrentX = 0;
        this.isDragging = false;
        this.dragOffset = 0;

        this.init();
    }

    init() {
        this.setupStructure();
        this.setupResponsive();
        this.setupNavigation();
        this.setupTouch();
        this.setupAutoplay();
        this.updateSlidePosition(false);

        window.addEventListener('resize', () => this.handleResize());
    }

    setupStructure() {
        // Get original slides
        this.originalSlides = Array.from(this.container.children);
        this.totalSlides = this.originalSlides.length;

        // Create wrapper structure
        this.container.classList.add('native-carousel');

        // Create track
        this.track = document.createElement('div');
        this.track.className = 'native-carousel-track';

        // For seamless loop, we need to clone slides
        if (this.options.loop && this.totalSlides > 1) {
            // Clone last slide and put at beginning
            const lastClone = this.originalSlides[this.totalSlides - 1].cloneNode(true);
            lastClone.classList.add('native-carousel-slide', 'clone');
            this.track.appendChild(lastClone);

            // Add original slides
            this.originalSlides.forEach(slide => {
                slide.classList.add('native-carousel-slide');
                this.track.appendChild(slide);
            });

            // Clone first slide and put at end
            const firstClone = this.originalSlides[0].cloneNode(true);
            firstClone.classList.add('native-carousel-slide', 'clone');
            this.track.appendChild(firstClone);

            // Start at index 1 (first real slide, after the clone)
            this.currentIndex = 1;
            this.slides = Array.from(this.track.children);
        } else {
            // No loop - just add slides normally
            this.originalSlides.forEach(slide => {
                slide.classList.add('native-carousel-slide');
                this.track.appendChild(slide);
            });
            this.slides = this.originalSlides;
        }

        // Create stage wrapper
        this.stage = document.createElement('div');
        this.stage.className = 'native-carousel-stage';
        this.stage.appendChild(this.track);

        this.container.appendChild(this.stage);
    }

    setupResponsive() {
        this.currentItems = this.options.items;

        if (Object.keys(this.options.responsive).length > 0) {
            const breakpoints = Object.keys(this.options.responsive)
                .map(Number)
                .sort((a, b) => a - b);

            const windowWidth = window.innerWidth;

            for (const breakpoint of breakpoints) {
                if (windowWidth >= breakpoint) {
                    const settings = this.options.responsive[breakpoint];
                    if (settings.items !== undefined) this.currentItems = settings.items;
                    if (settings.nav !== undefined) this.showNav = settings.nav;
                    if (settings.loop !== undefined) this.options.loop = settings.loop;
                }
            }
        }

        this.updateSlideWidths();
    }

    updateSlideWidths() {
        const slideWidth = 100 / this.currentItems;
        this.slides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}%`;
            slide.style.maxWidth = `${slideWidth}%`;
        });
    }

    setupNavigation() {
        if (this.options.nav) {
            this.prevBtn = document.createElement('button');
            this.prevBtn.className = 'native-carousel-prev';
            this.prevBtn.innerHTML = this.options.navText[0];
            this.prevBtn.addEventListener('click', () => this.prev());

            this.nextBtn = document.createElement('button');
            this.nextBtn.className = 'native-carousel-next';
            this.nextBtn.innerHTML = this.options.navText[1];
            this.nextBtn.addEventListener('click', () => this.next());

            this.container.appendChild(this.prevBtn);
            this.container.appendChild(this.nextBtn);
        }
    }

    setupTouch() {
        if (!this.options.touchEnabled) return;

        this.stage.addEventListener('touchstart', (e) => this.onDragStart(e.touches[0].clientX), { passive: true });
        this.stage.addEventListener('touchmove', (e) => this.onDragMove(e.touches[0].clientX), { passive: true });
        this.stage.addEventListener('touchend', () => this.onDragEnd());
        this.stage.addEventListener('touchcancel', () => this.onDragEnd());

        this.stage.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.onDragStart(e.clientX);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.onDragMove(e.clientX);
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.onDragEnd();
            }
        });

        this.stage.addEventListener('click', (e) => {
            if (this.wasDragging) {
                e.preventDefault();
                e.stopPropagation();
                this.wasDragging = false;
            }
        }, true);
    }

    onDragStart(clientX) {
        if (this.isAnimating) return;

        this.isDragging = true;
        this.wasDragging = false;
        this.touchStartX = clientX;
        this.touchCurrentX = clientX;
        this.dragOffset = 0;

        this.track.style.transition = 'none';
        this.pauseAutoplay();
    }

    onDragMove(clientX) {
        if (!this.isDragging) return;

        this.touchCurrentX = clientX;
        const diff = this.touchCurrentX - this.touchStartX;

        const containerWidth = this.stage.offsetWidth;
        this.dragOffset = (diff / containerWidth) * 100;

        const slideWidth = 100 / this.currentItems;
        const basePosition = -(this.currentIndex * slideWidth);
        const newPosition = basePosition + this.dragOffset;

        this.track.style.transform = `translateX(${newPosition}%)`;

        if (Math.abs(diff) > 5) {
            this.wasDragging = true;
        }
    }

    onDragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;

        const diff = this.touchCurrentX - this.touchStartX;
        const containerWidth = this.stage.offsetWidth;
        const dragPercent = Math.abs(diff / containerWidth) * 100;

        const slideChangeThreshold = 20;

        if (dragPercent > slideChangeThreshold) {
            if (diff < 0) {
                this.next();
            } else {
                this.prev();
            }
        } else {
            this.updateSlidePosition(true);
            this.resumeAutoplay();
        }

        this.touchStartX = 0;
        this.touchCurrentX = 0;
        this.dragOffset = 0;
    }

    setupAutoplay() {
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    startAutoplay() {
        if (this.autoplayInterval) return;
        this.autoplayInterval = setInterval(() => this.next(), this.options.autoplayTimeout);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resumeAutoplay() {
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    prev() {
        if (this.isAnimating) return;

        this.triggerEvent('translate');
        this.currentIndex--;
        this.updateSlidePosition(true);
        this.resetAutoplay();
    }

    next() {
        if (this.isAnimating) return;

        this.triggerEvent('translate');
        this.currentIndex++;
        this.updateSlidePosition(true);
        this.resetAutoplay();
    }

    resetAutoplay() {
        if (this.options.autoplay) {
            this.pauseAutoplay();
            this.startAutoplay();
        }
    }

    goTo(index) {
        if (this.isAnimating || index === this.currentIndex) return;

        this.triggerEvent('translate');
        this.currentIndex = this.options.loop ? index + 1 : index;
        this.updateSlidePosition(true);
        this.resetAutoplay();
    }

    updateSlidePosition(animate = true) {
        const slideWidth = 100 / this.currentItems;
        const translateX = -(this.currentIndex * slideWidth);

        if (animate) {
            this.isAnimating = true;
            this.track.style.transition = `transform ${this.options.animationDuration}ms ease`;
        } else {
            this.track.style.transition = 'none';
        }

        this.track.style.transform = `translateX(${translateX}%)`;

        if (animate) {
            setTimeout(() => {
                this.isAnimating = false;
                this.checkLoop();
                this.triggerEvent('translated');
            }, this.options.animationDuration);
        }
    }

    checkLoop() {
        if (!this.options.loop || this.totalSlides <= 1) return;

        // If we're at the clone of the last slide (index 0), jump to the real last slide
        if (this.currentIndex === 0) {
            this.track.style.transition = 'none';
            this.currentIndex = this.totalSlides;
            const slideWidth = 100 / this.currentItems;
            this.track.style.transform = `translateX(${-(this.currentIndex * slideWidth)}%)`;
        }
        // If we're at the clone of the first slide (index totalSlides + 1), jump to the real first slide
        else if (this.currentIndex === this.totalSlides + 1) {
            this.track.style.transition = 'none';
            this.currentIndex = 1;
            const slideWidth = 100 / this.currentItems;
            this.track.style.transform = `translateX(${-(this.currentIndex * slideWidth)}%)`;
        }
    }

    handleResize() {
        this.setupResponsive();
        this.updateSlidePosition(false);
    }

    triggerEvent(eventName) {
        const event = new CustomEvent(`carousel:${eventName}`, {
            detail: { carousel: this, currentIndex: this.getRealIndex() }
        });
        this.container.dispatchEvent(event);
    }

    getRealIndex() {
        if (!this.options.loop) return this.currentIndex;
        // Convert internal index to real index (accounting for clones)
        if (this.currentIndex === 0) return this.totalSlides - 1;
        if (this.currentIndex === this.totalSlides + 1) return 0;
        return this.currentIndex - 1;
    }

    destroy() {
        this.pauseAutoplay();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NativeCarousel;
}
