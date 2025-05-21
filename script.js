
if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded. Animations may not work.');
} else {
    gsap.registerPlugin(ScrollTrigger);
}

// Remove no-js class
document.documentElement.classList.remove('no-js');

// Loading Screen
document.addEventListener('DOMContentLoaded', () => {
    try {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    initializeAnimations();
                }, 500);
            }, 1000);
        } else {
            console.warn('Loading screen element not found.');
            initializeAnimations();
        }
    } catch (error) {
        console.error('Error hiding loading screen:', error);
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'none';
        initializeAnimations();
    }
});

// Fetch Menu Data
async function fetchMenuData() {
    try {
        console.log('Fetching menu data from http://localhost:3000/api/menu');
        const response = await fetch('http://localhost:3000/api/menu');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Menu data received:', data);
        // Log price types
        ['breakfast', 'lunch', 'dinner'].forEach(tab => {
            if (data[tab]) {
                data[tab].forEach(item => {
                    console.log(`Item: ${item.name}, Price: ${item.price}, Type: ${typeof item.price}`);
                });
            }
        });
        return data;
    } catch (error) {
        console.error('Error fetching menu data:', error.message);
        return null;
    }
}

// Preload Images
function preloadImages(menuData) {
    if (!menuData) return;
    ['breakfast', 'lunch', 'dinner'].forEach(tab => {
        if (menuData[tab]) {
            menuData[tab].forEach(item => {
                const img = new Image();
                img.src = item.image;
            });
        }
    });
}

// Render Menu Items
function renderMenuItems(tabId, items) {
    console.log(`Rendering items for tab: ${tabId}`, items);
    const menuItemsContainer = document.querySelector(`#${tabId} .menu-items`);
    if (!menuItemsContainer) {
        console.warn(`Menu items container not found for #${tabId}`);
        return;
    }

    // Clear existing content
    menuItemsContainer.innerHTML = '';

    // Render new items
    menuItemsContainer.innerHTML = items.map(item => {
        // Ensure price is a number, fallback to 0 if invalid
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        return `
            <div class="menu-item">
                <div class="item-img">
                    <img src="${item.image}" alt="${item.name}" onload="console.log('Image loaded: ${item.name}')" onerror="console.error('Image failed to load: ${item.name}')">
                </div>
                <div class="item-content">
                    <h4>${item.name} <span>$${price.toFixed(2)}</span></h4>
                    <p>${item.description}</p>
                    <a href="${item.orderLink}" class="order-btn" target="_blank">Order via WhatsApp</a>
                </div>
            </div>
        `;
    }).join('');
}

// Header Scroll Effect
function initializeHeaderScroll() {
    try {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                header.classList.toggle('scrolled', window.scrollY > 50);
            }
        });
    } catch (error) {
        console.error('Error in header scroll effect:', error);
    }
}

// Mobile Menu
function initializeMobileMenu() {
    try {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav ul');
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                nav.classList.toggle('active');
            });
        } else {
            console.warn('Mobile menu elements not found.');
        }
    } catch (error) {
        console.error('Error in mobile menu:', error);
    }
}

// Hero Slider
function initializeHeroSlider() {
    try {
        const slides = document.querySelectorAll('.slide');
        const sliderNavItems = document.querySelectorAll('.slider-nav-item');
        if (slides.length === 0 || sliderNavItems.length === 0) {
            console.warn('Hero slider elements not found.');
            return;
        }

        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
                sliderNavItems[i].classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        const slideInterval = setInterval(nextSlide, 5000);

        sliderNavItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                clearInterval(slideInterval);
                currentSlide = index;
                showSlide(index);
            });
        });
    } catch (error) {
        console.error('Error in hero slider:', error);
    }
}

// Menu Tabs
async function initializeMenuTabs() {
    try {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const tabLoading = document.querySelector('.tab-loading');
        if (tabButtons.length === 0 || tabContents.length === 0) {
            console.warn('Menu tab elements not found.');
            return;
        }

        // Fetch Menu data
        const menuData = await fetchMenuData();
        if (!menuData) {
            console.warn('No menu data available. Showing error message.');
            tabContents.forEach(content => {
                const errorMessage = content.querySelector('.error-message');
                if (errorMessage) errorMessage.style.display = 'block';
            });
            if (tabLoading) tabLoading.style.display = 'none';
            return;
        }

        // Preload images
        preloadImages(menuData);

        // Render Breakfast tab on load
        if (menuData.breakfast) {
            renderMenuItems('breakfast', menuData.breakfast);
        } else {
            console.warn('No breakfast data found.');
            const errorMessage = document.querySelector('#breakfast .error-message');
            if (errorMessage) errorMessage.style.display = 'block';
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log(`Tab clicked: ${button.dataset.tab}`);
                if (button.classList.contains('active')) return;

                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    const errorMessage = content.querySelector('.error-message');
                    if (errorMessage) errorMessage.style.display = 'none';
                });
                if (tabLoading) tabLoading.style.display = 'block';
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                const tabId = button.dataset.tab;
                const tabContent = document.getElementById(tabId);
                if (tabContent && menuData[tabId]) {
                    gsap.killTweensOf(tabContent.querySelectorAll('.menu-item'));
                    setTimeout(() => {
                        renderMenuItems(tabId, menuData[tabId]);
                        tabContent.classList.add('active');
                        if (tabLoading) tabLoading.style.display = 'none';
                        gsap.from(tabContent.querySelectorAll('.menu-item'), {
                            scale: 0.8,
                            opacity: 0,
                            duration: 0.5,
                            stagger: 0.2,
                            ease: 'power2.out'
                        });
                    }, 200);
                } else {
                    console.warn(`Tab content or data for ${tabId} not found.`);
                    if (tabContent) {
                        const errorMessage = tabContent.querySelector('.error-message');
                        if (errorMessage) errorMessage.style.display = 'block';
                    }
                    if (tabLoading) tabLoading.style.display = 'none';
                }
            });

            // Keyboard support
            button.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });

        // Ensure Breakfast tab is active
        const breakfastTab = document.querySelector('.tab-btn[data-tab="breakfast"]');
        const breakfastContent = document.getElementById('breakfast');
        if (breakfastTab && breakfastContent) {
            breakfastTab.classList.add('active');
            breakfastTab.setAttribute('aria-selected', 'true');
            breakfastContent.classList.add('active');
        } else {
            console.warn('Breakfast tab or content not found.');
            tabContents[0].classList.add('active');
            tabButtons[0].classList.add('active');
            tabButtons[0].setAttribute('aria-selected', 'true');
        }
    } catch (error) {
        console.error('Error initializing menu tabs:', error);
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'block';
            const errorMessage = content.querySelector('.error-message');
            if (errorMessage) errorMessage.style.display = 'block';
        });
        if (document.querySelector('.tab-loading')) {
            document.querySelector('.tab-loading').style.display = 'none';
        }
    }
}

// Testimonials Slider
function initializeTestimonialsSlider() {
    try {
        const testimonials = document.querySelectorAll('.testimonial');
        const testimonialNavItems = document.querySelectorAll('.testimonial-nav-item');
        if (testimonials.length === 0 || testimonialNavItems.length === 0) {
            console.warn('Testimonials slider elements not found.');
            return;
        }

        let currentTestimonial = 0;

        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
                testimonialNavItems[i].classList.toggle('active', i === index);
            });
        }

        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }

        const testimonialInterval = setInterval(nextTestimonial, 7000);

        testimonialNavItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                clearInterval(testimonialInterval);
                currentTestimonial = index;
                showTestimonial(index);
            });
        });
    } catch (error) {
        console.error('Error in testimonials slider:', error);
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    try {
        const nav = document.querySelector('.nav ul');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                if (nav && nav.classList.contains('active') && mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                    nav.classList.remove('active');
                }
            });
        });
    } catch (error) {
        console.error('Error in smooth scrolling:', error);
    }
}

// Scroll Top Button
function initializeScrollTop() {
    try {
        const scrollTop = document.querySelector('.scroll-top');
        if (scrollTop) {
            window.addEventListener('scroll', () => {
                scrollTop.classList.toggle('active', window.scrollY > 300);
            });

            scrollTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        } else {
            console.warn('Scroll top button not found.');
        }
    } catch (error) {
        console.error('Error in scroll top button:', error);
    }
}

// GSAP Animations
function initializeGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP animations skipped due to missing libraries.');
        return;
    }

    try {
        // Gallery Item Animations
        gsap.utils.toArray('.gallery-item').forEach(item => {
            gsap.from(item, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Hero Parallax Effect
        gsap.to('.slide', {
            backgroundPosition: '50% 60%',
            scrollTrigger: {
                trigger: '.hero',
                scrub: true,
                start: 'top top',
                end: 'bottom top'
            }
        });

        // Button Hover Animations
        document.querySelectorAll('.order-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { scale: 1.1, duration: 0.3 });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { scale: 1, duration: 0.3 });
            });
        });
    } catch (error) {
        console.error('Error in GSAP animations:', error);
    }
}

// Contact Form Submission
function initializeContactForm() {
    try {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', e => {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            });
        } else {
            console.warn('Contact form not found.');
        }
    } catch (error) {
        console.error('Error in contact form:', error);
    }
}

// Newsletter Form Submission
function initializeNewsletterForm() {
    try {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', e => {
                e.preventDefault();
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            });
        } else {
            console.warn('Newsletter form not found.');
        }
    } catch (error) {
        console.error('Error in newsletter form:', error);
    }
}

// Initialize all features
function initializeAnimations() {
    initializeHeaderScroll();
    initializeMobileMenu();
    initializeHeroSlider();
    initializeMenuTabs();
    initializeTestimonialsSlider();
    initializeSmoothScrolling();
    initializeScrollTop();
    initializeGSAPAnimations();
    initializeContactForm();
    initializeNewsletterForm();
}