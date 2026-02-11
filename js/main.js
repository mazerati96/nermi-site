// ===== NERMI WEBSITE - MAIN JAVASCRIPT =====
// Handles: Parallax scrolling, scroll animations, mobile menu, navigation state

// ===== PARALLAX SCROLLING =====
function initParallax() {
    // Only run parallax on desktop/tablet (not mobile)
    if (window.innerWidth > 768) {
        const parallaxBg = document.querySelector('.parallax-bg');
    
        if (parallaxBg) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                // Move background slower than scroll (20% speed difference)
                parallaxBg.style.transform = `translateY(${scrolled * 0.2}px)`;
            });
        }
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
    
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
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
        anchor.addEventListener('click', function(e) {
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

// ===== INITIALIZE EVERYTHING ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initScrollReveal();
    initNavScroll();
    initMobileMenu();
    initSmoothScroll();
    initStaggerAnimation();
  
    console.log('NerMI website loaded successfully');
});

// ===== HANDLE WINDOW RESIZE =====
let resizeTimer;
window.addEventListener('resize', () => {
    // Debounce resize event
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize parallax if needed
        if (window.innerWidth <= 768) {
            const parallaxBg = document.querySelector('.parallax-bg');
            if (parallaxBg) {
                parallaxBg.style.transform = 'none';
            }
        }
    }, 250);
});