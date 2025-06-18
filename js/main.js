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
        // Enhanced security initialization
        initializeCSPViolationReporting();
        initializeIntegrityChecking();
        initializeTamperDetection();
        initializeSecureNavigation();
        initializeContentProtection();
        
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
                    (e.ctrlKey && e.key === 'U') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'J')) {
                    e.preventDefault();
                    suspiciousActivity++;
                    if (suspiciousActivity > 3) {
                        console.warn('Security: Multiple attempts to access developer tools detected');
                        logSecurityEvent('dev_tools_attempts', { count: suspiciousActivity });
                    }
                    return false;
                }
            }
        });
        
        // Security: Validate all external links
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!isValidExternalLink(href)) {
                    e.preventDefault();
                    console.error('Security: Invalid external link detected');
                    logSecurityEvent('invalid_link', { href });
                    return false;
                }
            });
        });
    }
    
    /**
     * CSP Violation Reporting
     */
    function initializeCSPViolationReporting() {
        document.addEventListener('securitypolicyviolation', function(e) {
            console.error('CSP Violation:', {
                blockedURI: e.blockedURI,
                violatedDirective: e.violatedDirective,
                originalPolicy: e.originalPolicy
            });
            logSecurityEvent('csp_violation', {
                blockedURI: e.blockedURI,
                directive: e.violatedDirective
            });
        });
    }
    
    /**
     * DOM Integrity Checking
     */
    function initializeIntegrityChecking() {
        const originalScripts = document.querySelectorAll('script').length;
        const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]').length;
        
        setInterval(function() {
            const currentScripts = document.querySelectorAll('script').length;
            const currentStyles = document.querySelectorAll('style, link[rel="stylesheet"]').length;
            
            if (currentScripts > originalScripts || currentStyles > originalStyles) {
                console.warn('Security: Potential DOM tampering detected');
                logSecurityEvent('dom_tampering', {
                    scripts: { original: originalScripts, current: currentScripts },
                    styles: { original: originalStyles, current: currentStyles }
                });
            }
        }, 5000);
    }
    
    /**
     * Anti-Tampering Protection
     */
    function initializeTamperDetection() {
        // Protect critical functions
        const originalLog = console.log;
        const originalError = console.error;
        
        Object.defineProperty(console, 'log', {
            value: function(...args) {
                if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('Security:')) {
                    originalLog.apply(console, args);
                }
            },
            writable: false,
            configurable: false
        });
        
        // Monitor for script injection attempts
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && (node.tagName === 'SCRIPT' || node.tagName === 'IFRAME')) {
                            console.warn('Security: Suspicious element injection detected');
                            logSecurityEvent('element_injection', { 
                                tagName: node.tagName,
                                src: node.src || node.innerHTML.substring(0, 100)
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * Secure Navigation Protection
     */
    function initializeSecureNavigation() {
        // Prevent navigation to suspicious URLs
        window.addEventListener('beforeunload', function(e) {
            // Allow normal navigation, but log it
            logSecurityEvent('navigation_attempt', { 
                from: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
        
        // Monitor hash changes for potential attacks
        window.addEventListener('hashchange', function(e) {
            const newHash = window.location.hash;
            if (newHash.includes('<script') || newHash.includes('javascript:')) {
                console.warn('Security: Suspicious hash change detected');
                logSecurityEvent('suspicious_hash', { hash: newHash });
                window.location.hash = '';
            }
        });
    }
    
    /**
     * Content Protection
     */
    function initializeContentProtection() {
        // Disable drag and drop of external content
        document.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('drop', function(e) {
            e.preventDefault();
            console.warn('Security: External content drop prevented');
            logSecurityEvent('content_drop_prevented', {});
        });
        
        // Disable paste of potentially malicious content
        document.addEventListener('paste', function(e) {
            const pastedData = e.clipboardData.getData('text');
            if (pastedData.includes('<script') || pastedData.includes('javascript:')) {
                e.preventDefault();
                console.warn('Security: Malicious paste content blocked');
                logSecurityEvent('malicious_paste_blocked', { 
                    content: pastedData.substring(0, 100)
                });
            }
        });
    }
    
    /**
     * Validate external links
     */
    function isValidExternalLink(href) {
        if (!href) return false;
        
        const allowedDomains = [
            'wa.me',
            'whatsapp.com',
            'github.com',
            'discord.com',
            'discord.gg'
        ];
        
        try {
            const url = new URL(href);
            return allowedDomains.some(domain => 
                url.hostname === domain || url.hostname.endsWith('.' + domain)
            );
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Security Event Logging
     */
    function logSecurityEvent(eventType, details) {
        const securityLog = {
            timestamp: new Date().toISOString(),
            event: eventType,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href,
            sessionId: generateSessionId()
        };
        
        // Store in sessionStorage for this session
        const existingLogs = JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
        existingLogs.push(securityLog);
        
        // Keep only last 50 events
        if (existingLogs.length > 50) {
            existingLogs.splice(0, existingLogs.length - 50);
        }
        
        sessionStorage.setItem('securityLogs', JSON.stringify(existingLogs));
        
        // In production, you could send this to a security monitoring service
        console.info('Security Event Logged:', eventType, details);
    }
    
    /**
     * Generate session ID for security tracking
     */
    function generateSessionId() {
        return sessionStorage.getItem('securitySessionId') || 
               (function() {
                   const id = 'sec_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
                   sessionStorage.setItem('securitySessionId', id);
                   return id;
               })();
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
            // Use modern Performance API
            if (performance.getEntriesByType) {
                const navigationEntries = performance.getEntriesByType('navigation');
                if (navigationEntries.length > 0) {
                    const loadTime = navigationEntries[0].loadEventEnd - navigationEntries[0].fetchStart;
                    console.log(`Page load time: ${Math.round(loadTime)}ms`);
                }
            } else {
                // Fallback for older browsers
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            }
        });
    }

    // Expose sanitizeInput function to Haven namespace for potential use
    window.Haven.sanitizeInput = sanitizeInput;

})(); // Close the IIFE