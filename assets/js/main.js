// ============================================
// SUNSHINE SCHOOLS WEBSITE
// main.js - Core JavaScript functionality
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // 1. MOBILE NAVIGATION TOGGLE
    // ============================================
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');
    const body = document.body;

    if (navToggle && nav) {
        navToggle.addEventListener('click', function () {
            const isOpen = nav.classList.toggle('nav--open');
            navToggle.classList.toggle('nav__toggle--active');
            navToggle.setAttribute('aria-expanded', isOpen);

            // Prevent body scroll when menu is open
            if (isOpen) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close nav when a link is clicked
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('nav--open');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        });

        // Close nav when clicking outside
        document.addEventListener('click', function (event) {
            if (
                nav.classList.contains('nav--open') &&
                !nav.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                nav.classList.remove('nav--open');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });

        // Close nav on Escape key
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
                nav.classList.remove('nav--open');
                navToggle.classList.remove('nav__toggle--active');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                navToggle.focus();
            }
        });
    }


    // ============================================
    // 2. STICKY HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    let lastScrollY = 0;

    function handleHeaderScroll() {
        const currentScrollY = window.scrollY;

        if (header) {
            if (currentScrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });


    // ============================================
    // 3. BACK TO TOP BUTTON
    // ============================================
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('back-to-top--visible');
            } else {
                backToTopBtn.classList.remove('back-to-top--visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ============================================
    // 4. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');

            // Skip if href is just "#"
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                // Offset for sticky header
                const headerHeight = header ? header.offsetHeight : 90;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ============================================
    // 5. STATS COUNTER ANIMATION (Intersection Observer)
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-item__number[data-target]');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2500; // milliseconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const counter = setInterval(function () {
            current += step;
            if (current >= target) {
                element.textContent = target + (target === 98 ? '%' : '+');
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current) + (target === 98 ? '%' : '+');
            }
        }, 16);
    }

    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(function (stat) {
            statsObserver.observe(stat);
        });
    }


    // ============================================
    // 6. FADE-IN-UP SCROLL ANIMATIONS
    // ============================================
    const fadeElements = document.querySelectorAll('.fade-in-up');

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up--visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function (el) {
            fadeObserver.observe(el);
        });
    }


    // ============================================
    // 7. TESTIMONIALS CAROUSEL
    // ============================================
    const testimonialsTrack = document.getElementById('testimonials-track');
    const testimonialsDots = document.getElementById('testimonials-dots');

    if (testimonialsTrack && testimonialsDots) {
        const slides = testimonialsTrack.querySelectorAll('.testimonial-card');
        const dots = testimonialsDots.querySelectorAll('.carousel__dot');
        let currentSlide = 0;
        let autoSlideInterval;

        function goToSlide(index) {
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
            currentSlide = index;

            testimonialsTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

            // Update dots
            dots.forEach(function (dot, i) {
                dot.classList.toggle('carousel__dot--active', i === currentSlide);
            });
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        // Dot click events
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'), 10);
                goToSlide(index);
                resetAutoSlide();
            });
        });

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Pause on hover
        testimonialsTrack.parentElement.addEventListener('mouseenter', function () {
            clearInterval(autoSlideInterval);
        });

        testimonialsTrack.parentElement.addEventListener('mouseleave', function () {
            startAutoSlide();
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialsTrack.addEventListener('touchstart', function (event) {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsTrack.addEventListener('touchend', function (event) {
            touchEndX = event.changedTouches[0].screenX;
            const swipeThreshold = 50;

            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left
                nextSlide();
                resetAutoSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right
                goToSlide(currentSlide - 1);
                resetAutoSlide();
            }
        });

        // Start auto-sliding
        if (slides.length > 1) {
            startAutoSlide();
        }
    }


    // ============================================
    // 8. NEWSLETTER FORM SUBMISSION
    // ============================================
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                // Show success feedback (in production, this would POST to a server)
                const btn = this.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Subscribed!';
                btn.style.backgroundColor = '#28A745';
                btn.style.color = '#FFFFFF';
                emailInput.value = '';

                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }
        });
    }


    // ============================================
    // 9. FAQ ACCORDION (for admissions page)
    // ============================================
    const faqItems = document.querySelectorAll('.faq__item');

    if (faqItems.length > 0) {
        faqItems.forEach(function (item) {
            const question = item.querySelector('.faq__question');

            if (question) {
                question.addEventListener('click', function () {
                    const isActive = item.classList.contains('faq__item--active');

                    // Close all items
                    faqItems.forEach(function (otherItem) {
                        otherItem.classList.remove('faq__item--active');
                    });

                    // Open clicked item if it wasn't already open
                    if (!isActive) {
                        item.classList.add('faq__item--active');
                    }
                });
            }
        });
    }


    // ============================================
    // 10. GALLERY FILTER (for gallery page)
    // ============================================
    const filterBtns = document.querySelectorAll('.gallery__filter-btn');
    const galleryItems = document.querySelectorAll('.gallery__item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                // Update active button
                filterBtns.forEach(function (b) {
                    b.classList.remove('gallery__filter-btn--active');
                });
                this.classList.add('gallery__filter-btn--active');

                const filter = this.getAttribute('data-filter');

                // Filter items
                galleryItems.forEach(function (item) {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(function () {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(function () {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }


    // ============================================
    // 11. LIGHTBOX (for gallery page)
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxTriggers = document.querySelectorAll('.gallery__item[data-full-image]');

    if (lightbox && lightboxImage && lightboxTriggers.length > 0) {
        let lightboxItems = [];
        let currentLightboxIndex = 0;

        // Collect all lightbox items
        lightboxTriggers.forEach(function (trigger, index) {
            lightboxItems.push({
                src: trigger.getAttribute('data-full-image'),
                alt: trigger.querySelector('img') ? trigger.querySelector('img').alt : ''
            });

            trigger.addEventListener('click', function () {
                currentLightboxIndex = index;
                openLightbox(currentLightboxIndex);
            });
        });

        function openLightbox(index) {
            lightboxImage.src = lightboxItems[index].src;
            lightboxImage.alt = lightboxItems[index].alt;
            lightbox.classList.add('lightbox--active');
            body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('lightbox--active');
            body.style.overflow = '';
        }

        function prevImage() {
            currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
            lightboxImage.src = lightboxItems[currentLightboxIndex].src;
            lightboxImage.alt = lightboxItems[currentLightboxIndex].alt;
        }

        function nextImage() {
            currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
            lightboxImage.src = lightboxItems[currentLightboxIndex].src;
            lightboxImage.alt = lightboxItems[currentLightboxIndex].alt;
        }

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', prevImage);
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', nextImage);
        }

        // Close on clicking background
        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function (event) {
            if (!lightbox.classList.contains('lightbox--active')) return;

            switch (event.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        });
    }


    // ============================================
    // 12. CONTACT FORM VALIDATION (for contact/admissions pages)
    // ============================================
    const contactForms = document.querySelectorAll('.form[data-form-type="contact"], .form[data-form-type="admissions"], .form[data-form-type="careers"]');

    contactForms.forEach(function (form) {
        const inputs = form.querySelectorAll('.form__input, .form__textarea, .form__select');
        const submitBtn = form.querySelector('.form__submit');
        const successMessage = form.querySelector('.form__success-message');

        // Live validation on blur
        inputs.forEach(function (input) {
            input.addEventListener('blur', function () {
                validateInput(input);
            });

            input.addEventListener('input', function () {
                if (input.classList.contains('form__input--error')) {
                    validateInput(input);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            let isValid = true;

            inputs.forEach(function (input) {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid && submitBtn) {
                // Simulate form submission
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // In production, submit to Formspree or similar
                // For demo, simulate success after 1.5 seconds
                setTimeout(function () {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;

                    if (successMessage) {
                        successMessage.classList.add('form__success-message--visible');
                        // Hide after 5 seconds
                        setTimeout(function () {
                            successMessage.classList.remove('form__success-message--visible');
                        }, 5000);
                    }

                    form.reset();
                }, 1500);
            }
        });
    });

    function validateInput(input) {
        const errorElement = input.parentElement.querySelector('.form__error-message');
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (input.hasAttribute('required') && value === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Email check
        if (isValid && input.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Phone check
        if (isValid && input.type === 'tel' && value !== '') {
            const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }

        // Update UI
        if (!isValid) {
            input.classList.add('form__input--error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('form__error-message--visible');
            }
        } else {
            input.classList.remove('form__input--error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('form__error-message--visible');
            }
        }

        return isValid;
    }


    // ============================================
    // 13. CAMPUS TABS (for contact page)
    // ============================================
    const campusTabs = document.querySelectorAll('.campus-tab');
    const campusPanels = document.querySelectorAll('.campus-panel');

    if (campusTabs.length > 0 && campusPanels.length > 0) {
        campusTabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const targetId = this.getAttribute('data-campus');

                // Update active tab
                campusTabs.forEach(function (t) {
                    t.classList.remove('campus-tab--active');
                });
                this.classList.add('campus-tab--active');

                // Show target panel
                campusPanels.forEach(function (panel) {
                    panel.style.display = 'none';
                });
                const targetPanel = document.getElementById(targetId + '-panel');
                if (targetPanel) {
                    targetPanel.style.display = 'block';
                }
            });
        });
    }


    // ============================================
    // 14. CURRENT YEAR AUTO-UPDATE
    // ============================================
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();

    yearElements.forEach(function (el) {
        el.textContent = currentYear;
    });


    // ============================================
    // 15. ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    function highlightActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link');

        navLinks.forEach(function (link) {
            link.classList.remove('nav__link--active');
            const linkPath = link.getAttribute('href');

            if (linkPath && currentPath.includes(linkPath.replace('./', '')) && linkPath !== 'index.html') {
                link.classList.add('nav__link--active');
            } else if (linkPath === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html'))) {
                link.classList.add('nav__link--active');
            }
        });
    }

    highlightActiveNavLink();

}); // End DOMContentLoaded