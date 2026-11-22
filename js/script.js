/**
 * ============================================================================
 * ATIRR PERSONAL PORTFOLIO — CORE SCRIPT
 * Identity: Muhammad Fatir Dohmie (Atirr)
 * Scope: Interactive UI, Audio Controller, Lightbox, Filters, Animations
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 01. PRELOADER & LOADING SCREEN
  // ==========================================================================
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderStatus = document.getElementById('preloader-status');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 18) + 12;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderStatus) preloaderStatus.textContent = '100% - INITIALIZED';
      
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
        }
      }, 350);
    } else {
      if (preloaderBar) preloaderBar.style.width = `${loadProgress}%`;
      if (preloaderStatus) preloaderStatus.textContent = `${loadProgress}%`;
    }
  }, 45);

  // Fallback safety timeout: always remove preloader after 1.8 seconds max
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
      }
    }, 600);
  });


  // ==========================================================================
  // 02. SCROLL PROGRESS INDICATOR
  // ==========================================================================
  const scrollProgressBar = document.getElementById('scroll-progress');

  const updateScrollProgress = () => {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    } else {
      scrollProgressBar.style.width = '0%';
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();


  // ==========================================================================
  // 03. STICKY NAVBAR & SCROLL ELEVATION
  // ==========================================================================
  const header = document.querySelector('.header');

  const handleNavbarScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  // ==========================================================================
  // 04. RESPONSIVE MOBILE NAVIGATION
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    if (!hamburgerBtn || !mobileMenu) return;
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    } else {
      mobileMenu.classList.add('open');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
  };

  const closeMobileMenu = () => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu if clicked outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });


  // ==========================================================================
  // 05. ACTIVE NAVIGATION INDICATOR & SCROLL SPY
  // ==========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 160;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Desktop nav links
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        // Mobile nav links
        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  // ==========================================================================
  // 06. SCROLL REVEAL VIA INTERSECTION OBSERVER
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-visible'));
  }


  // ==========================================================================
  // 07. ANIMATED METRIC COUNTERS
  // ==========================================================================
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  const animateMetrics = () => {
    if (metricsAnimated) return;
    metricNumbers.forEach(metric => {
      const target = parseInt(metric.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      
      let count = 0;
      const duration = 1200;
      const stepTime = Math.max(Math.floor(duration / target), 60);

      const timer = setInterval(() => {
        count += 1;
        metric.textContent = count;
        if (count >= target) {
          metric.textContent = target;
          clearInterval(timer);
        }
      }, stepTime);
    });
    metricsAnimated = true;
  };

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection && 'IntersectionObserver' in window) {
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateMetrics();
          metricObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    metricObserver.observe(metricsSection);
  } else {
    // Trigger immediately if no observer or already visible
    setTimeout(animateMetrics, 800);
  }


  // ==========================================================================
  // 08. CUSTOM CURSOR (DESKTOP)
  // ==========================================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth lag animation for outer ring
    const animateCursor = () => {
      const ease = 0.18;
      outlineX += (mouseX - outlineX) * ease;
      outlineY += (mouseY - outlineY) * ease;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .achievement-img-box, .filter-btn, .ach-filter-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('cursor-hover');
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });
  }


  // ==========================================================================
  // 09. PROJECT CATEGORY FILTERING
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  // ==========================================================================
  // 10. ACHIEVEMENTS CATEGORY FILTERING
  // ==========================================================================
  const achFilterBtns = document.querySelectorAll('.ach-filter-btn');
  const achievementCards = document.querySelectorAll('.achievement-card');

  achFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      achFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      achievementCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  // ==========================================================================
  // 11. IMAGE LIGHTBOX MODAL
  // ==========================================================================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTriggers = document.querySelectorAll('.achievement-img-box');

  const openLightbox = (src, title, caption) => {
    if (!lightboxModal || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = title || 'Achievement Preview';
    if (lightboxTitle) lightboxTitle.textContent = title || 'Achievement Preview';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  lightboxTriggers.forEach(trigger => {
    const handleTrigger = () => {
      const src = trigger.getAttribute('data-lightbox-src');
      const title = trigger.getAttribute('data-title');
      const caption = trigger.getAttribute('data-caption');
      if (src) {
        openLightbox(src, title, caption);
      }
    };

    trigger.addEventListener('click', handleTrigger);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger();
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  // Escape key closes lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
      closeMobileMenu();
    }
  });


  // ==========================================================================
  // 12. BACKGROUND MUSIC CONTROLLER
  // ==========================================================================
  const bgAudio = document.getElementById('bg-audio');
  const musicToggleBtn = document.getElementById('music-toggle');
  const musicLabel = document.getElementById('music-label');

  if (bgAudio && musicToggleBtn) {
    // Requirements: Loop enabled, volume set to 25% (0.25)
    bgAudio.loop = true;
    bgAudio.volume = 0.25;

    const setPlayingState = (isPlaying) => {
      if (isPlaying) {
        musicToggleBtn.classList.add('playing');
        if (musicLabel) musicLabel.textContent = 'AUDIO: ON (25%)';
        musicToggleBtn.setAttribute('aria-label', 'Pause background music');
      } else {
        musicToggleBtn.classList.remove('playing');
        if (musicLabel) musicLabel.textContent = 'AUDIO: OFF';
        musicToggleBtn.setAttribute('aria-label', 'Play background music');
      }
    };

    // Synchronize button state with actual audio playback events
    bgAudio.addEventListener('play', () => setPlayingState(true));
    bgAudio.addEventListener('pause', () => setPlayingState(false));

    // Manual toggle
    musicToggleBtn.addEventListener('click', () => {
      if (bgAudio.paused) {
        bgAudio.play().then(() => {
          setPlayingState(true);
        }).catch(err => {
          console.warn('Audio playback restriction:', err);
          setPlayingState(false);
        });
      } else {
        bgAudio.pause();
        setPlayingState(false);
      }
    });

    // Autoplay attempt with graceful fallback handling
    const attemptAutoplay = () => {
      bgAudio.play().then(() => {
        setPlayingState(true);
      }).catch(() => {
        // Expected behavior in modern browsers: autoplay with sound is blocked
        setPlayingState(false);
      });
    };

    // Run autoplay check once DOM is ready
    attemptAutoplay();

    // Optional seamless unlock on first user gesture
    const startAudioOnFirstInteraction = () => {
      if (bgAudio.paused && !sessionStorage.getItem('atirr_audio_muted_by_user')) {
        bgAudio.play().then(() => {
          setPlayingState(true);
        }).catch(() => {
          // Keep paused if user blocked or device restricted
        });
      }
      document.removeEventListener('click', startAudioOnFirstInteraction);
      document.removeEventListener('keydown', startAudioOnFirstInteraction);
    };

    // Keep user's intentional pause remembered
    musicToggleBtn.addEventListener('click', () => {
      if (bgAudio.paused) {
        sessionStorage.setItem('atirr_audio_muted_by_user', 'true');
      } else {
        sessionStorage.removeItem('atirr_audio_muted_by_user');
      }
    });
  }


  // ==========================================================================
  // 13. BACK TO TOP FUNCTIONALITY
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ==========================================================================
  // 14. DYNAMIC COPYRIGHT YEAR
  // ==========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    const year = new Date().getFullYear();
    yearElement.textContent = year >= 2026 ? year : 2026;
  }

});
