// Smooth scrolling for navigation links with snap support
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Use smooth scroll with snap alignment
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active navigation link based on scroll position
const allSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollPos = window.pageYOffset + 200;
    
    allSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Also trigger child animations
            const scrollItems = entry.target.querySelectorAll('.scroll-item');
            scrollItems.forEach(item => {
                item.classList.add('visible');
            });
        }
    });
}, observerOptions);

// Observe all scroll-reveal elements
document.querySelectorAll('.scroll-reveal').forEach(element => {
    observer.observe(element);
});

// Observe skill items separately for staggered animation
document.querySelectorAll('.skill-item').forEach(element => {
    observer.observe(element);
});

// Observe project items with staggered delay
document.querySelectorAll('.project-item').forEach((element, index) => {
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                projectObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    projectObserver.observe(element);
});

// Observe contact methods for staggered animation
document.querySelectorAll('.contact-method').forEach((element, index) => {
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                contactObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    contactObserver.observe(element);
});

// Parallax effect for scroll indicator
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    if (scrollIndicator) {
        const scrolled = window.pageYOffset;
        const opacity = Math.max(0, 1 - (scrolled / 300));
        scrollIndicator.style.opacity = opacity;
        scrollIndicator.style.transform = `translateX(-50%) translateY(${scrolled * 0.5}px)`;
    }
});

// Smooth reveal for title lines
window.addEventListener('load', () => {
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add hover effect for project items
document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.setProperty('--hover-scale', '1.02');
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.setProperty('--hover-scale', '1');
    });
});

// Cursor follower effect (optional - subtle effect)
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations for elements in viewport
    const initialElements = document.querySelectorAll('.scroll-reveal');
    initialElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            element.classList.add('visible');
        }
    });
});

// Scroll detection for optimization
let userIsScrolling = false;

window.addEventListener('wheel', (e) => {
    if (!userIsScrolling) {
        userIsScrolling = true;
        setTimeout(() => {
            userIsScrolling = false;
        }, 100);
    }
}, { passive: true });

// Performance optimization: Throttle scroll events
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

// Apply throttle to scroll handler
const throttledScroll = throttle(() => {
    updateActiveLink();
}, 100);

window.addEventListener('scroll', throttledScroll);

// Smooth automatic section scrolling
let isScrolling = false;
let scrollTimeout;
let currentSection = 0;
const sections = Array.from(document.querySelectorAll('section[id]'));

// Detect scroll direction and automatically snap to next/prev section
let lastScrollTop = 0;
let scrollDirection = 'down';

window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    scrollDirection = st > lastScrollTop ? 'down' : 'up';
    lastScrollTop = st <= 0 ? 0 : st;
}, false);

// Add wheel event for smoother automatic transitions
let wheelTimeout;
window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        autoScrollToNearestSection();
    }, 50);
}, { passive: true });

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
    if (isScrolling) return;
    
    touchEndY = e.changedTouches[0].screenY;
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        autoScrollToNearestSection();
    }, 50);
}, { passive: true });

function autoScrollToNearestSection() {
    if (isScrolling) return;
    
    const scrollPosition = window.pageYOffset + window.innerHeight / 3;
    let nearestSection = sections[0];
    let minDistance = Math.abs(sections[0].offsetTop - scrollPosition);
    
    sections.forEach(section => {
        const distance = Math.abs(section.offsetTop - scrollPosition);
        if (distance < minDistance) {
            minDistance = distance;
            nearestSection = section;
        }
    });
    
    // Only auto-scroll if we're not already very close to a section boundary
    const currentScroll = window.pageYOffset;
    const targetScroll = nearestSection.offsetTop;
    
    if (Math.abs(currentScroll - targetScroll) > 100) {
        isScrolling = true;
        smoothScrollTo(nearestSection.offsetTop, 800);
        
        setTimeout(() => {
            isScrolling = false;
        }, 900);
    }
}

function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function for smooth deceleration
        const easeInOutCubic = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

console.log('Portfolio loaded with smooth auto-scroll! 🚀');
