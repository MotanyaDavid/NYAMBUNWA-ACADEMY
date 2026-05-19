// ============================================
// NYAMBUNWA ACADEMY WEBSITE
// main.js - Core JavaScript functionality
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // 1. MOBILE NAVIGATION TOGGLE
  // ============================================
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");
  const body = document.body;

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("nav--open");
      navToggle.classList.toggle("nav__toggle--active");
      navToggle.setAttribute("aria-expanded", isOpen);

      // Prevent body scroll when menu is open
      if (isOpen) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "";
      }
    });

    // Close nav when a link is clicked
    const navLinks = nav.querySelectorAll(".nav__link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("nav--open");
        navToggle.classList.remove("nav__toggle--active");
        navToggle.setAttribute("aria-expanded", "false");
        body.style.overflow = "";
      });
    });

    // Close nav when clicking outside
    document.addEventListener("click", function (event) {
      if (
        nav.classList.contains("nav--open") &&
        !nav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        nav.classList.remove("nav--open");
        navToggle.classList.remove("nav__toggle--active");
        navToggle.setAttribute("aria-expanded", "false");
        body.style.overflow = "";
      }
    });

    // Close nav on Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("nav--open")) {
        nav.classList.remove("nav--open");
        navToggle.classList.remove("nav__toggle--active");
        navToggle.setAttribute("aria-expanded", "false");
        body.style.overflow = "";
        navToggle.focus();
      }
    });
  }

  // ============================================
  // 2. STICKY HEADER SCROLL EFFECT
  // ============================================
  const header = document.getElementById("header");
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;

    if (header) {
      if (currentScrollY > 50) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  // ============================================
  // 3. BACK TO TOP BUTTON
  // ============================================
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add("back-to-top--visible");
        } else {
          backToTopBtn.classList.remove("back-to-top--visible");
        }
      },
      { passive: true },
    );

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ============================================
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      // Skip if href is just "#"
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        // Offset for sticky header
        const headerHeight = header ? header.offsetHeight : 90;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================
  // 5. STATS COUNTER ANIMATION (Intersection Observer)
  // ============================================
  const statNumbers = document.querySelectorAll(
    ".stat-item__number[data-target]",
  );

  function animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"), 10);
    const duration = 2500; // milliseconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const counter = setInterval(function () {
      current += step;
      if (current >= target) {
        element.textContent = target + (target === 98 ? "%" : "+");
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(current) + (target === 98 ? "%" : "+");
      }
    }, 16);
  }

  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    statNumbers.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  }

  // ============================================
  // 6. FADE-IN-UP SCROLL ANIMATIONS
  // ============================================
  const fadeElements = document.querySelectorAll(".fade-in-up");

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up--visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // ============================================
  // 7. TESTIMONIALS CAROUSEL
  // ============================================
  const testimonialsTrack = document.getElementById("testimonials-track");
  const testimonialsDots = document.getElementById("testimonials-dots");

  if (testimonialsTrack && testimonialsDots) {
    const slides = testimonialsTrack.querySelectorAll(".testimonial-card");
    const dots = testimonialsDots.querySelectorAll(".carousel__dot");
    let currentSlide = 0;
    let autoSlideInterval;

    function goToSlide(index) {
      if (index < 0) {
        index = slides.length - 1;
      } else if (index >= slides.length) {
        index = 0;
      }
      currentSlide = index;

      testimonialsTrack.style.transform =
        "translateX(-" + currentSlide * 100 + "%)";

      // Update dots
      dots.forEach(function (dot, i) {
        dot.classList.toggle("carousel__dot--active", i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    // Dot click events
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"), 10);
        goToSlide(index);
        resetAutoSlide();
      });
    });

    // Pause button
    const pauseBtn = document.getElementById("testimonials-pause");
    let isPaused = false;

    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        isPaused = !isPaused;
        if (isPaused) {
          clearInterval(autoSlideInterval);
          pauseBtn.textContent = "▶ Play";
        } else {
          startAutoSlide();
          pauseBtn.textContent = "⏸ Pause";
        }
      });
    }

    function startAutoSlide() {
      if (!isPaused) {
        autoSlideInterval = setInterval(nextSlide, 5000);
      }
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    // Pause on hover
    testimonialsTrack.parentElement.addEventListener("mouseenter", function () {
      clearInterval(autoSlideInterval);
    });

    testimonialsTrack.parentElement.addEventListener("mouseleave", function () {
      startAutoSlide();
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsTrack.addEventListener(
      "touchstart",
      function (event) {
        touchStartX = event.changedTouches[0].screenX;
      },
      { passive: true },
    );

    testimonialsTrack.addEventListener("touchend", function (event) {
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
  const newsletterForms = document.querySelectorAll(".footer__newsletter-form");

  if (newsletterForms.length > 0) {
    newsletterForms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (email) {
          if (!email.includes("@") || !email.includes(".")) {
            alert("Please enter a valid email address.");
            return;
          }
          const btn = this.querySelector("button");
          const originalText = btn.textContent;
          btn.textContent = "Subscribing...";
          btn.disabled = true;

          fetch("http://localhost:5000/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              if (data.success) {
                btn.textContent = "Subscribed!";
                btn.style.backgroundColor = "#28A745";
                btn.style.color = "#FFFFFF";
                emailInput.value = "";
              } else {
                btn.textContent = "Error";
                btn.style.backgroundColor = "#DC3545";
                btn.style.color = "#FFFFFF";
              }
              setTimeout(function () {
                btn.textContent = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.disabled = false;
              }, 3000);
            })
            .catch(function () {
              btn.textContent = originalText;
              btn.disabled = false;
            });
        }
      });
    });
  }

  // ============================================
  // 9. FAQ ACCORDION (for admissions page)
  // ============================================
  const faqItems = document.querySelectorAll(".faq__item");

  if (faqItems.length > 0) {
    faqItems.forEach(function (item) {
      const question = item.querySelector(".faq__question");

      if (question) {
        question.addEventListener("click", function () {
          const isActive = item.classList.contains("faq__item--active");

          // Close all items
          faqItems.forEach(function (otherItem) {
            otherItem.classList.remove("faq__item--active");
          });

          // Open clicked item if it wasn't already open
          if (!isActive) {
            item.classList.add("faq__item--active");
          }
        });
      }
    });
  }

  // ============================================
  // 10. GALLERY FILTER (for gallery page)
  // ============================================
  const filterBtns = document.querySelectorAll(".gallery__filter-btn");
  const galleryItems = document.querySelectorAll(".gallery__item");

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        // Update active button
        filterBtns.forEach(function (b) {
          b.classList.remove("gallery__filter-btn--active");
        });
        this.classList.add("gallery__filter-btn--active");

        const filter = this.getAttribute("data-filter");

        // Filter items
        // Filter items
        let visibleCount = 0;
        galleryItems.forEach(function (item) {
          if (
            filter === "all" ||
            item.getAttribute("data-category") === filter
          ) {
            item.style.display = "block";
            setTimeout(function () {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, 10);
            visibleCount++;
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.8)";
            setTimeout(function () {
              item.style.display = "none";
            }, 300);
          }
        });

        // Show empty state if no results
        let emptyState = document.getElementById("gallery-empty");
        if (visibleCount === 0) {
          if (!emptyState) {
            emptyState = document.createElement("div");
            emptyState.id = "gallery-empty";
            emptyState.style.cssText =
              "text-align: center; padding: 3rem; grid-column: 1 / -1; color: var(--color-neutral-medium);";
            emptyState.innerHTML =
              '<p style="font-size: 1.1rem;">📷 No photos found in this category.</p><p style="font-size: 0.9rem;">Try selecting a different filter.</p>';
            document.getElementById("gallery-grid").appendChild(emptyState);
          }
          emptyState.style.display = "block";
        } else if (emptyState) {
          emptyState.style.display = "none";
        }
      });
    });
  }

  // ============================================
  // 11. LIGHTBOX (for gallery page)
  // ============================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxTriggers = document.querySelectorAll(
    ".gallery__item[data-full-image]",
  );

  if (lightbox && lightboxImage && lightboxTriggers.length > 0) {
    let lightboxItems = [];
    let currentLightboxIndex = 0;

    // Set up lightbox for accessibility
    if (lightbox) {
      lightbox.setAttribute("tabindex", "-1");
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-label", "Image viewer");
      lightbox.setAttribute("aria-hidden", "true");
    }

    // Collect all lightbox items
    lightboxTriggers.forEach(function (trigger, index) {
      lightboxItems.push({
        src: trigger.getAttribute("data-full-image"),
        alt: trigger.querySelector("img")
          ? trigger.querySelector("img").alt
          : "",
      });

      trigger.addEventListener("click", function () {
        currentLightboxIndex = index;
        openLightbox(currentLightboxIndex);
      });
    });

    function openLightbox(index) {
      lightboxImage.src = lightboxItems[index].src;
      lightboxImage.alt = lightboxItems[index].alt;
      lightbox.classList.add("lightbox--active");
      lightbox.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
      lightbox.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("lightbox--active");
      lightbox.setAttribute("aria-hidden", "true");
      body.style.overflow = "";
      if (lightboxTriggers[currentLightboxIndex]) {
        lightboxTriggers[currentLightboxIndex].focus();
      }
    }

    function prevImage() {
      currentLightboxIndex =
        (currentLightboxIndex - 1 + lightboxItems.length) %
        lightboxItems.length;
      lightboxImage.src = lightboxItems[currentLightboxIndex].src;
      lightboxImage.alt = lightboxItems[currentLightboxIndex].alt;
    }

    function nextImage() {
      currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
      lightboxImage.src = lightboxItems[currentLightboxIndex].src;
      lightboxImage.alt = lightboxItems[currentLightboxIndex].alt;
    }

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", prevImage);
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", nextImage);
    }

    // Close on clicking background
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    // Keyboard navigation with focus trap
    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("lightbox--active")) return;

      switch (event.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "Tab":
          // Trap focus inside lightbox
          const focusableElements = lightbox.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            firstElement.focus();
          }
          break;
      }
    });
  }

  // ============================================
  // 13. CAMPUS TABS (for contact page)
  // ============================================
  const campusTabs = document.querySelectorAll(".campus-tab");
  const campusPanels = document.querySelectorAll(".campus-panel");

  if (campusTabs.length > 0 && campusPanels.length > 0) {
    campusTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const targetId = this.getAttribute("data-campus");

        // Update active tab
        campusTabs.forEach(function (t) {
          t.classList.remove("campus-tab--active");
        });
        this.classList.add("campus-tab--active");

        // Show target panel
        campusPanels.forEach(function (panel) {
          panel.style.display = "none";
        });
        const targetPanel = document.getElementById(targetId + "-panel");
        if (targetPanel) {
          targetPanel.style.display = "block";
        }
      });
    });
  }

  // ============================================
  // 14. CURRENT YEAR AUTO-UPDATE
  // ============================================
  const yearElements = document.querySelectorAll("#current-year");
  const currentYear = new Date().getFullYear();

  yearElements.forEach(function (el) {
    el.textContent = currentYear;
  });

  // ============================================
  // 15. ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  function highlightActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav__link");

    navLinks.forEach(function (link) {
      link.classList.remove("nav__link--active");
      const linkPath = link.getAttribute("href");

      if (
        linkPath &&
        currentPath.includes(linkPath.replace("./", "")) &&
        linkPath !== "index.html"
      ) {
        link.classList.add("nav__link--active");
      } else if (
        linkPath === "index.html" &&
        (currentPath.endsWith("/") || currentPath.endsWith("/index.html"))
      ) {
        link.classList.add("nav__link--active");
      }
    });
  }

  highlightActiveNavLink();

  // ============================================
  // 16. ACCESSIBILITY FIXES
  // ============================================

  // Ensure all form inputs have proper labels
  document
    .querySelectorAll("input, textarea, select")
    .forEach(function (input) {
      // Find the label that references this input
      const label = document.querySelector('label[for="' + input.id + '"]');

      // If input has an ID but no label, add aria-label
      if (input.id && !label && !input.getAttribute("aria-label")) {
        const placeholder =
          input.getAttribute("placeholder") || input.name || "Form field";
        input.setAttribute("aria-label", placeholder);
      }

      // Add aria-required for required fields
      if (input.hasAttribute("required")) {
        input.setAttribute("aria-required", "true");
      }

      // Add aria-invalid for error states
      if (input.classList.contains("form__input--error")) {
        input.setAttribute("aria-invalid", "true");
      }

      // Add ARIA labels to gallery filter buttons
      document.querySelectorAll(".gallery__filter-btn").forEach(function (btn) {
        btn.setAttribute(
          "aria-pressed",
          btn.classList.contains("gallery__filter-btn--active")
            ? "true"
            : "false",
        );
      });

      // Add ARIA labels to carousel dots
      document
        .querySelectorAll(".carousel__dot")
        .forEach(function (dot, index) {
          dot.setAttribute("aria-label", "Go to testimonial " + (index + 1));
          dot.setAttribute("role", "tab");
          if (dot.classList.contains("carousel__dot--active")) {
            dot.setAttribute("aria-selected", "true");
          }
        });

      // Add ARIA labels to social media links
      document
        .querySelectorAll(".footer__social-link")
        .forEach(function (link) {
          const icon = link.querySelector("i");
          if (icon) {
            // Extract platform name from icon class
            const classes = icon.className;
            if (classes.includes("facebook"))
              link.setAttribute("aria-label", "Visit our Facebook page");
            if (classes.includes("twitter") || classes.includes("x-twitter"))
              link.setAttribute("aria-label", "Visit our X (Twitter) page");
            if (classes.includes("instagram"))
              link.setAttribute("aria-label", "Visit our Instagram page");
            if (classes.includes("youtube"))
              link.setAttribute("aria-label", "Visit our YouTube channel");
            if (classes.includes("linkedin"))
              link.setAttribute("aria-label", "Visit our LinkedIn page");
          }
        });
      // Add fallback alt text to images missing it
      document.querySelectorAll("img:not([alt])").forEach(function (img) {
        img.setAttribute("alt", "Nyambunwa Academy");
      });

      // Warn about generic alt text in console
      document.querySelectorAll('img[alt=""]').forEach(function (img) {
        console.warn("Image missing alt text:", img.src);
      });

      // Add role="navigation" to nav
      const nav = document.querySelector(".nav");
      if (nav) nav.setAttribute("role", "navigation");

      // Add aria-current to active nav link
      const activeNavLink = document.querySelector(".nav__link--active");
      if (activeNavLink) activeNavLink.setAttribute("aria-current", "page");

      // ============================================
      // 17. PERFORMANCE: LAZY LOADING
      // ============================================

      // Add lazy loading to images that don't have it
      document.querySelectorAll("img:not([loading])").forEach(function (img) {
        img.setAttribute("loading", "lazy");
      });

      // Add decoding="async" for off-screen images
      document.querySelectorAll("img:not([decoding])").forEach(function (img) {
        img.setAttribute("decoding", "async");
      });

      // ============================================
      // 18. PERFORMANCE: RESPONSIVE IMAGES
      // ============================================

      // Add srcset to gallery images for responsive loading
      document.querySelectorAll(".gallery__item img").forEach(function (img) {
        var src = img.getAttribute("src");
        if (src && !img.getAttribute("srcset")) {
          // Generate responsive sizes
          var baseName = src.replace(/\.(jpg|png|jpeg)$/, "");
          var extension = src.split(".").pop();

          img.setAttribute(
            "srcset",
            baseName +
              "-small." +
              extension +
              " 400w, " +
              baseName +
              "-medium." +
              extension +
              " 800w, " +
              src +
              " 1200w",
          );
          img.setAttribute(
            "sizes",
            "(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px",
          );
        }
      });

      // Add srcset to hero images
      document.querySelectorAll(".hero, .page-hero").forEach(function (hero) {
        var bgImage = getComputedStyle(hero).backgroundImage;
        if (bgImage && bgImage !== "none") {
          var url = bgImage.replace(/url\(['"]?/, "").replace(/['"]?\)/, "");
          // Set data attribute for potential JS-based responsive loading
          hero.setAttribute("data-bg", url);
        }
      });

      // ============================================
      // 19. PERFORMANCE: PREVENT LAYOUT SHIFT
      // ============================================

      // Add width/height to images missing dimensions
      document
        .querySelectorAll("img:not([width]):not([height])")
        .forEach(function (img) {
          // Set aspect ratio based on common image types
          if (img.closest(".gallery__item")) {
            img.setAttribute("width", "800");
            img.setAttribute("height", "800");
          } else if (img.closest(".hero") || img.closest(".page-hero")) {
            img.setAttribute("width", "1920");
            img.setAttribute("height", "600");
          } else if (img.closest(".news-card")) {
            img.setAttribute("width", "600");
            img.setAttribute("height", "400");
          } else if (img.closest(".program-card")) {
            img.setAttribute("width", "600");
            img.setAttribute("height", "330");
          }
        });

      // Add aspect ratio containers
      document
        .querySelectorAll(
          ".gallery__item, .news-card__image, .program-card__image",
        )
        .forEach(function (el) {
          if (!el.style.aspectRatio) {
            el.style.aspectRatio = el.closest(".gallery__item")
              ? "1 / 1"
              : "3 / 2";
          }
        });
    });

  // Fix footer newsletter input
  const newsletterInput = document.querySelector(".footer__newsletter-input");
  if (newsletterInput && !newsletterInput.getAttribute("aria-label")) {
    newsletterInput.setAttribute(
      "aria-label",
      "Email address for newsletter subscription",
    );
  }

  // Dyslexia-friendly font toggle
  const dyslexiaToggle = document.getElementById("dyslexia-toggle");
  if (dyslexiaToggle) {
    dyslexiaToggle.addEventListener("click", function () {
      document.body.classList.toggle("dyslexia-mode");
      const isActive = document.body.classList.contains("dyslexia-mode");
      localStorage.setItem("dyslexia-mode", isActive ? "on" : "off");
      dyslexiaToggle.textContent = isActive
        ? "📖 Normal Mode"
        : "📖 Dyslexic Mode";
    });

    // Check saved preference
    if (localStorage.getItem("dyslexia-mode") === "on") {
      document.body.classList.add("dyslexia-mode");
      dyslexiaToggle.textContent = "📖 Normal Mode";
    }
  }

  // ============================================
  // PAGE LOADER
  // ============================================
  window.addEventListener("load", function () {
    const loader = document.getElementById("page-loader");
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(function () {
        loader.remove();
      }, 500);
    }
  });

  // ============================================
  // DARK MODE TOGGLE
  // ============================================

  const darkModeToggle = document.getElementById("dark-mode-toggle");

  if (darkModeToggle) {
    // Check saved preference
    if (localStorage.getItem("dark-mode") === "on") {
      document.body.classList.add("dark-mode");
      darkModeToggle.textContent = "☀️ Light";
    }

    darkModeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("dark-mode", isDark ? "on" : "off");
      darkModeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    });
  }

  // ============================================
  // SEASONAL THEMES
  // ============================================

  (function () {
    const now = new Date();
    const month = now.getMonth(); // 0 = January, 11 = December
    const day = now.getDate();

    let theme = "default";
    let themeColor = "#1A3C6E";
    let themeAccent = "#F4B400";

    // Kenyan school terms (approximate)
    // Term 1: January - March
    // Term 2: May - July
    // Term 3: September - November
    // Holidays: April, August, December

    if (month === 0) {
      // January - Back to School
      theme = "term1";
      themeColor = "#1B5E20"; // Green for new beginnings
      themeAccent = "#FFC107";
    } else if (month === 3) {
      // April - Easter Holiday
      theme = "easter";
      themeColor = "#6A1B9A"; // Purple
      themeAccent = "#FFD54F";
    } else if (month === 7) {
      // August - Holiday
      theme = "holiday";
      themeColor = "#0277BD"; // Light blue
      themeAccent = "#FF9800";
    } else if (month === 11) {
      // December - Festive
      theme = "festive";
      themeColor = "#C62828"; // Red
      themeAccent = "#FFD700";
    } else if (month === 9 && day >= 20) {
      // Mashujaa Day (October 20)
      theme = "mashujaa";
      themeColor = "#000000";
      themeAccent = "#C62828";
    }

    // Apply theme
    if (theme !== "default") {
      document.documentElement.style.setProperty("--color-primary", themeColor);
      document.documentElement.style.setProperty(
        "--color-secondary",
        themeAccent,
      );
      document.documentElement.setAttribute("data-theme", theme);
    }
  })();

  // ============================================
  // L2: EVENT COUNTDOWN TIMER
  // ============================================

  function startCountdown() {
    // Get events from schoolData
    if (
      typeof schoolData === "undefined" ||
      !schoolData.upcomingEvents ||
      schoolData.upcomingEvents.length === 0
    ) {
      const countdownContainer = document.getElementById("event-countdown");
      if (countdownContainer) countdownContainer.style.display = "none";
      return;
    }

    const nextEvent = schoolData.upcomingEvents[0];
    const eventDate = new Date(
      nextEvent.date +
        "T" +
        (nextEvent.time ? nextEvent.time.split(" - ")[0] : "00:00"),
    );

    document.getElementById("countdown-event-name").textContent =
      nextEvent.title;

    function updateCountdown() {
      const now = new Date();
      const diff = eventDate - now;

      if (diff <= 0) {
        document.getElementById("countdown-days").textContent = "00";
        document.getElementById("countdown-hours").textContent = "00";
        document.getElementById("countdown-minutes").textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      document.getElementById("countdown-days").textContent = String(
        days,
      ).padStart(2, "0");
      document.getElementById("countdown-hours").textContent = String(
        hours,
      ).padStart(2, "0");
      document.getElementById("countdown-minutes").textContent = String(
        minutes,
      ).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
  }

  // Start countdown on load
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("event-countdown")) {
      startCountdown();
    }
  });

  // ============================================
  // M2: WHATSAPP CHAT WIDGET
  // ============================================

  const whatsappBtn = document.getElementById("whatsapp-btn");
  const whatsappPopup = document.getElementById("whatsapp-popup");
  const whatsappClose = document.getElementById("whatsapp-close");

  if (whatsappBtn && whatsappPopup) {
    whatsappBtn.addEventListener("click", function (e) {
      e.preventDefault();
      whatsappPopup.classList.toggle("whatsapp-popup--open");
    });

    if (whatsappClose) {
      whatsappClose.addEventListener("click", function () {
        whatsappPopup.classList.remove("whatsapp-popup--open");
      });
    }

    // Close when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !whatsappBtn.contains(e.target) &&
        !whatsappPopup.contains(e.target)
      ) {
        whatsappPopup.classList.remove("whatsapp-popup--open");
      }
    });
  }

  // ============================================
  // M1: SITE SEARCH
  // ============================================

  const searchInput = document.getElementById("site-search");
  const searchBtn = document.getElementById("search-btn");

  if (searchInput && searchBtn) {
    function performSearch() {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      // Define searchable pages and keywords
      const searchIndex = {
        admissions: {
          url: "admissions.html",
          keywords:
            "admissions, apply, enrollment, register, fees, admission, join",
        },
        about: {
          url: "about.html",
          keywords:
            "about, history, mission, vision, values, leadership, principal, staff",
        },
        contact: {
          url: "contact.html",
          keywords: "contact, phone, email, address, location, map, call",
        },
        gallery: {
          url: "gallery.html",
          keywords: "gallery, photos, pictures, images, videos, campus, sports",
        },
        downloads: {
          url: "downloads.html",
          keywords: "downloads, forms, pdf, documents, calendar, policies",
        },
        careers: {
          url: "careers.html",
          keywords:
            "careers, jobs, vacancies, apply, employment, work, teaching",
        },
        faq: {
          url: "admissions.html#faq",
          keywords: "faq, questions, answers, help",
        },
        fees: {
          url: "admissions.html#fees",
          keywords: "fees, fee structure, payment, cost, tuition",
        },
      };

      let found = false;
      for (const [key, value] of Object.entries(searchIndex)) {
        if (value.keywords.includes(query) || key.includes(query)) {
          window.location.href = value.url;
          found = true;
          break;
        }
      }

      if (!found) {
        alert(
          'No results found for "' +
            query +
            '". Try: admissions, fees, contact, gallery, careers, or about.',
        );
      }
    }

    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") performSearch();
    });
  }
}); // End DOMContentLoaded
