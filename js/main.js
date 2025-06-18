/**
 * Haven Programming Community Landing Page
 * Main JavaScript file for interactive functionality
 */

// Security: Strict mode
'use strict';

// Security: Prevent external script injection
(function() {
    // Create a secure namespace
    window.Haven = window.Haven || {};
    
    // Security: Input validation and sanitization
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>'"&]/g, function(match) {
            const entityMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return entityMap[match];
        });
    }
    
    // Security: Rate limiting for navigation clicks
    let lastNavClick = 0;
    const NAV_CLICK_THROTTLE = 100; // 100ms between clicks
    
    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        // Security: Verify DOM integrity before initialization
        if (document.body && document.head) {
            initializeNavigation();
            initializeSmoothScrolling();
            initializeFormHandling();
            initializeAnimations();
            initializeScrollEffects();
            initializeSecurity();
        }
    });
    
    /**
     * Initialize security measures
     */
    function initializeSecurity() {
        // Prevent right-click context menu in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        }
        
        // Prevent text selection on non-content elements
        const nonSelectableElements = document.querySelectorAll('.navbar, .btn, .nav-toggle');
        nonSelectableElements.forEach(el => {
            el.style.userSelect = 'none';
            el.style.webkitUserSelect = 'none';
            el.style.mozUserSelect = 'none';
        });
        
        // Security: Monitor for suspicious activity
        let suspiciousActivity = 0;
        document.addEventListener('keydown', function(e) {
            // Disable F12, Ctrl+Shift+I, Ctrl+U in production
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    suspiciousActivity++;
                    if (suspiciousActivity > 3) {
                        console.warn('Security: Multiple attempts to access developer tools detected');
                    }
                    return false;
                }
            }
        });
        
        // Security: Validate external links
        const externalLinks = document.querySelectorAll('a[href^="https://wa.me"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href.startsWith('https://wa.me/')) {
                    e.preventDefault();
                    console.error('Security: Invalid WhatsApp link detected');
                    return false;
                }
            });
        });
    }

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
        
        // Close mobile menu when clicking on a nav link (with rate limiting)
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const now = Date.now();
                if (now - lastNavClick < NAV_CLICK_THROTTLE) {
                    e.preventDefault();
                    return false;
                }
                lastNavClick = now;
                
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

    // Expose sanitizeInput function to Haven namespace for potential use
    window.Haven.sanitizeInput = sanitizeInput;

})(); // Close the IIFE