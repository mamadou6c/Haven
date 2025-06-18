/**
 * Haven Programming Community Landing Page
 * Main JavaScript file for interactive functionality
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeFormHandling();
    initializeAnimations();
    initializeScrollEffects();
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Handle escape key for mobile menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

/**
 * Update active navigation link based on current section
 */
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Form handling - No form in current structure
 */
function initializeFormHandling() {
    // No form elements to handle in current structure
    console.log('Form handling initialized - no forms found');
}

/**
 * Initialize scroll-based animations
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .growth-card, .learning-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
    let isScrolling = false;
    
    // Throttled scroll handler
    function handleScroll() {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                updateNavbarOnScroll();
                updateActiveNavOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial call
    updateNavbarOnScroll();
    updateActiveNavOnScroll();
}

/**
 * Update navbar appearance on scroll
 */
function updateNavbarOnScroll() {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    if (currentSection) {
        updateActiveNavLink(currentSection);
    }
}

/**
 * Utility function to debounce events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function to throttle events
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Error handling for JavaScript errors
 */
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    // Could send error to logging service in production
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

/**
 * Performance monitoring
 */
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    });
}
