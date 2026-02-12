// ===== NERMI WEBSITE - MAIN JAVASCRIPT =====
// Handles: Card parallax effects, scroll animations, mobile menu, dropdown navigation, navigation state

// ===== CARD PARALLAX EFFECTS =====
function initCardParallax() {
    // Only run on desktop/tablet (not mobile)
    if (window.innerWidth > 768) {
        const cards = document.querySelectorAll('.card, .audience-card');

        window.addEventListener('scroll', () => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const cardTop = rect.top + scrolled;
                const windowHeight = window.innerHeight;

                // Only apply parallax when card is in viewport
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const offset = (scrolled - cardTop + windowHeight) * 0.05;
                    card.style.transform = `translateY(${offset}px)`;
                }
            });
        });
    }
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation (performance)
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-up or fade-in classes
    const fadeElements = document.querySelectorAll('.fade-up, .fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// ===== NAVIGATION SCROLL STATE =====
function initNavScroll() {
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ===== DROPDOWN MENU =====
function initDropdownMenu() {
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (!dropdown || !dropdownToggle || !dropdownMenu) return;

    // MOBILE ONLY (768px and below)
    if (window.innerWidth <= 768) {
        // Toggle dropdown on click
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent navigation
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Close dropdown AND hamburger menu after clicking a dropdown link
        dropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                dropdown.classList.remove('active');
                // Also close the hamburger menu
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) {
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }
}

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link (but NOT the dropdown toggle)
        const navLinks = navMenu.querySelectorAll('a:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== STAGGER ANIMATION FOR CARDS =====
function initStaggerAnimation() {
    const cards = document.querySelectorAll('.card, .audience-card, .value-item');

    cards.forEach((card, index) => {
        // Add increasing delay based on index
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ===== META SLIDER (Pitch Deck Slider) =====
function initMetaSlider() {
    const slider = document.querySelector('.metaslider');
    if (!slider) return; // Only run on pages with metaslider

    const slides = slider.querySelectorAll('.metaslide');
    const dots = document.querySelectorAll('.metaslider-dot');
    const prevBtn = slider.querySelector('.metaslider-prev');
    const nextBtn = slider.querySelector('.metaslider-next');

    let currentSlide = 0;
    let autoPlayInterval;
    let isPaused = false;

    // Show specific slide
    function showSlide(index) {
        // Wrap around
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // Next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // 5 seconds
    }

    // Stop auto-play
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            if (!isPaused) startAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            if (!isPaused) startAutoPlay();
        });
    }

    // Dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            if (!isPaused) startAutoPlay();
        });
    });

    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        isPaused = true;
        stopAutoPlay();
    });

    slider.addEventListener('mouseleave', () => {
        isPaused = false;
        startAutoPlay();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!slider.matches(':hover')) return; // Only work when hovering slider

        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            if (!isPaused) startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            if (!isPaused) startAutoPlay();
        }
    });

    // Start the auto-play
    startAutoPlay();
}

// ===== INITIALIZE EVERYTHING ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initCardParallax();
    initScrollReveal();
    initNavScroll();
    initDropdownMenu();
    initMobileMenu();
    initSmoothScroll();
    initStaggerAnimation();
    initMetaSlider();

    console.log('NerMI website loaded successfully!');
});

// ===== HANDLE WINDOW RESIZE =====
let resizeTimer;
window.addEventListener('resize', () => {
    // Debounce resize event
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reset card transforms on mobile
        if (window.innerWidth <= 768) {
            const cards = document.querySelectorAll('.card, .audience-card');
            cards.forEach(card => {
                card.style.transform = 'none';
            });
        }
    }, 250);
});