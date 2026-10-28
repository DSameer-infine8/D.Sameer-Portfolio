/**
 * Sameer Portfolio - Master Animation Engine (Cinematic Intro & Brand Preloader)
 * GSAP 3 + ScrollTrigger
 * 60fps Zero-Lag Hardware-Accelerated Architecture
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check if intro has already been viewed or bypassed in this session
  const urlParams = new URLSearchParams(window.location.search);
  const isBypassed = urlParams.get('loaded') === 'true' || sessionStorage.getItem('sameer_loaded') === 'true' || (window.location.hash && window.location.hash.length > 1);
  const introWrapper = document.getElementById("intro-stage-wrapper");
  const curtain = document.getElementById("curtain-wipe");

  if (isBypassed) {
    if (introWrapper) introWrapper.style.display = "none";
    if (curtain) curtain.style.display = "none";
    return;
  }

  // Ensure window is strictly locked at top (0, 0) during loading animation
  window.scrollTo(0, 0);

  // Register GSAP plugins
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Set initial viewport height fix
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };
  setVh();
  window.addEventListener('resize', setVh);

  // Cache DOM Elements
  const preloader = document.getElementById("preloader");
  const introFill = document.getElementById("intro-fill");
  const nameStroke = document.getElementById("name-stroke");
  const dStage = document.getElementById("d-stage-container");
  const dEmblem = document.getElementById("d-emblem");
  const heroSection = document.getElementById("hero-section");
  const heroNav = document.getElementById("hero-nav");
  const heroPortrait = document.getElementById("hero-portrait");
  const hoodieAnchor = document.getElementById("hoodie-target");
  const heroSig = document.getElementById("hero-sig");
  const sigStroke = document.getElementById("sig-mask-stroke");
  const heroMarquee = document.getElementById("hero-marquee");
  const marqueeTrack = document.getElementById("marquee-track");
  const exploreBtn = document.getElementById("explore-btn");
  const curtainCols = gsap.utils.toArray(".curtain-col");
  const customCursor = document.getElementById("custom-cursor");

  // Initial curtain position (hidden off-screen at bottom)
  gsap.set(curtainCols, { yPercent: 100, y: 0 });

  // ==========================================================================
  // CUSTOM INTERACTIVE CURSOR
  // ==========================================================================
  if (customCursor) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(customCursor, { opacity: 1, duration: 0.3 });
    });

    gsap.ticker.add(() => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      gsap.set(customCursor, { x: cursorX, y: cursorY });
    });

    // Hover effect on interactive items
    document.querySelectorAll("a, button, .hero-scroll-pill").forEach((el) => {
      el.addEventListener("mouseenter", () => customCursor.classList.add("active"));
      el.addEventListener("mouseleave", () => customCursor.classList.remove("active"));
    });
  }

  // ==========================================================================
  // SVG CURSIVE NAME STROKE SETUP
  // ==========================================================================
  let nameLength = 2500;
  if (nameStroke) {
    try {
      nameLength = nameStroke.getTotalLength();
    } catch (e) {
      nameLength = 2500;
    }
    gsap.set(nameStroke, {
      strokeDasharray: nameLength,
      strokeDashoffset: nameLength
    });
  }

  // ==========================================================================
  // SVG SIGNATURE STROKE SETUP
  // ==========================================================================
  let sigLength = 1800;
  if (sigStroke) {
    try {
      sigLength = sigStroke.getTotalLength();
    } catch (e) {
      sigLength = 1800;
    }
    gsap.set(sigStroke, {
      strokeDasharray: sigLength,
      strokeDashoffset: sigLength
    });
  }

  // ==========================================================================
  // ASSET PRELOADER (Ensures 60fps execution with zero dropped frames)
  // ==========================================================================
  const assetsToPreload = [
    'assets/sameer_white.png',
    'assets/sameer_charcoal.png',
    'assets/signature_orange.png',
    'assets/hero_back-removebg-preview.png',
    'assets/d_shape.svg',
    'assets/1.png',
    'assets/2.png'
  ];

  const preloadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(src); // don't block on error
      img.src = src;
    });
  };

  Promise.all([
    document.fonts.ready,
    ...assetsToPreload.map(preloadImage)
  ]).then(() => {
    // Assets ready: unlock page and start Master Timeline
    document.body.classList.remove("loading");
    initMasterTimeline();
  });

  let masterTL = null;

  function initMasterTimeline() {
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" }
    });
    masterTL = tl;
    window.masterTL = tl;
    initScrollTransitions();
    tl.eventCallback("onComplete", () => {
      ScrollTrigger.refresh();
      // Stage 3 is fully visible: auto-trigger Stage 4 after 1.5 seconds
      scheduleAutoStage4(1500);
    });

    // ------------------------------------------------------------------------
    // STAGE 1: Cursive Writing Preloader (Natural Handwriting Animation)
    // ------------------------------------------------------------------------
    tl.set(preloader, { opacity: 1, visibility: "visible" });

    // Animate cursive SVG stroke mask from left to right (drawing the word)
    if (nameStroke) {
      tl.to(nameStroke, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.inOut"
      }, "+=0.15");
    }

    // Brief settling pause once handwritten text is fully visible
    tl.to({}, { duration: 0.35 });

    // Fade out preloader wrapper
    tl.to(preloader, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(preloader, { display: "none" });
      }
    });

    // ------------------------------------------------------------------------
    // STAGE 2: Background Shrink to "D" Logo (1.png)
    // ------------------------------------------------------------------------
    tl.addLabel("stage2_d", "-=0.25");

    tl.set(dStage, { opacity: 1, visibility: "visible" }, "stage2_d");
    tl.fromTo(dEmblem,
      {
        scale: 4.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.15,
        ease: "power3.inOut"
      },
      "stage2_d"
    );

    // Settle pause on centered D emblem
    tl.to({}, { duration: 0.4 });

    // ------------------------------------------------------------------------
    // STAGE 3: Logo Scale-Down & Hero Section Reveal (2.png)
    // ------------------------------------------------------------------------
    tl.addLabel("stage3_hero", "+=0.1");

    // Reveal hero section white background
    tl.to(heroSection, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut"
    }, "stage3_hero");

    // Move & scale D emblem to hoodie chest target
    if (hoodieAnchor) {
      tl.call(() => {
        dockLogoToHoodie(tl);
      }, null, "stage3_hero");
    }

    // Reveal portrait of Sameer
    if (heroPortrait) {
      tl.to(heroPortrait, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out"
      }, "stage3_hero+=0.15");
    }

    // Write orange signature across top
    if (heroSig && sigStroke) {
      tl.set(heroSig, { opacity: 1 }, "stage3_hero+=0.3");
      tl.to(sigStroke, {
        strokeDashoffset: 0,
        duration: 1.25,
        ease: "power2.inOut"
      }, "stage3_hero+=0.35");
    }

    // Slide up massive marquee
    if (heroMarquee) {
      tl.to(heroMarquee, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out"
      }, "stage3_hero+=0.45");
    }

    // Reveal Skip / Explore Button
    if (exploreBtn) {
      tl.to(exploreBtn, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "stage3_hero+=0.6");
    }

    // Start Infinite Marquee Loop
    initInfiniteMarquee();
  }

  // ==========================================================================
  // D EMBLEM DOCKING ENGINE (Pixel-accurate across all screen sizes)
  // ==========================================================================
  function dockLogoToHoodie(timeline) {
    if (!hoodieAnchor || !dEmblem) return;
    const hoodieRect = hoodieAnchor.getBoundingClientRect();
    const emblemRect = dEmblem.getBoundingClientRect();

    const targetCenterX = hoodieRect.left + hoodieRect.width / 2;
    const targetCenterY = hoodieRect.top + hoodieRect.height / 2;
    const currentCenterX = window.innerWidth / 2;
    const currentCenterY = window.innerHeight / 2;

    const deltaX = targetCenterX - currentCenterX;
    const deltaY = targetCenterY - currentCenterY;
    const targetScale = hoodieRect.width / emblemRect.width;

    gsap.to(dEmblem, {
      x: deltaX,
      y: deltaY,
      scale: Math.max(targetScale, 0.28),
      duration: 1.15,
      ease: "power3.inOut"
    });
  }

  // Re-dock D emblem on window resize so it stays locked to the hoodie
  window.addEventListener("resize", () => {
    if (hoodieAnchor && dEmblem && heroPortrait && heroPortrait.style.opacity === "1") {
      const hoodieRect = hoodieAnchor.getBoundingClientRect();
      const emblemRect = dEmblem.getBoundingClientRect();
      const deltaX = (hoodieRect.left + hoodieRect.width / 2) - (window.innerWidth / 2);
      const deltaY = (hoodieRect.top + hoodieRect.height / 2) - (window.innerHeight / 2);
      const targetScale = hoodieRect.width / (emblemRect.width / (gsap.getProperty(dEmblem, "scale") || 1));

      gsap.set(dEmblem, {
        x: deltaX,
        y: deltaY,
        scale: Math.max(targetScale, 0.28)
      });
    }
  });

  // ==========================================================================
  // CONTINUOUS INFINITE SCROLLING MARQUEE (60fps GSAP Ticker)
  // ==========================================================================
  let marqueeTween = null;
  function initInfiniteMarquee() {
    if (!marqueeTrack) return;

    marqueeTween = gsap.to(marqueeTrack, {
      xPercent: -50,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    if (heroMarquee) {
      heroMarquee.addEventListener("mouseenter", () => {
        gsap.to(marqueeTween, { timeScale: 1.8, duration: 0.5 });
      });
      heroMarquee.addEventListener("mouseleave", () => {
        gsap.to(marqueeTween, { timeScale: 1, duration: 0.5 });
      });
    }
  }

  // ==========================================================================
  // STAGE 4: STAGGERED BLOCK SLIDE CURTAIN REVEAL (Seamless In-Page Reveal)
  // ==========================================================================
  let stage4Timeout = null;
  function scheduleAutoStage4(delayMs = 1500) {
    if (stage4Timeout) clearTimeout(stage4Timeout);
    stage4Timeout = setTimeout(() => {
      if (typeof window.triggerStage4Reveal === "function") {
        window.triggerStage4Reveal();
      }
    }, delayMs);
  }

  function initScrollTransitions() {
    let hasRevealed = false;

    const triggerReveal = () => {
      if (hasRevealed) return;
      hasRevealed = true;
      if (stage4Timeout) clearTimeout(stage4Timeout);

      // Fast-forward hero timeline if user scrolled or clicked early
      if (masterTL && masterTL.progress() < 1) {
        masterTL.progress(1);
      }

      // Staggered geometric block curtain transition
      const curtainTL = gsap.timeline({
        onComplete: () => {
          // Store loaded flag in sessionStorage
          try {
            sessionStorage.setItem('sameer_loaded', 'true');
          } catch (e) { }

          // Hide intro overlay completely
          const intro = document.getElementById("intro-stage-wrapper");
          if (intro) {
            intro.style.display = "none";
          }

          // Trigger hero page entrance and curtain slide-up
          if (typeof window.playHeroMotion === "function") {
            window.playHeroMotion();
          } else {
            // Fallback: animate curtain up and out
            gsap.to(curtainCols, {
              yPercent: -100,
              duration: 0.75,
              stagger: 0.08,
              ease: "power4.inOut",
              onComplete: () => {
                const c = document.getElementById("curtain-wipe");
                if (c) c.style.display = "none";
              }
            });
          }
        }
      });

      // Hide D stage container as curtain covers
      if (dStage) {
        curtainTL.to(dStage, {
          opacity: 0,
          duration: 0.3
        }, 0.2);
      }

      // Panels slide up to cover screen from bottom (staggered from left to right)
      curtainTL.to(curtainCols, {
        yPercent: 0,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.inOut"
      }, 0);
    };

    window.triggerStage4Reveal = triggerReveal;

    // Trigger on Explore Button click (early skip)
    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        triggerReveal();
      });
    }

    // Trigger on scroll or wheel event (early skip)
    let scrollAccumulator = 0;
    window.addEventListener("wheel", (e) => {
      if (!hasRevealed && e.deltaY > 20) {
        scrollAccumulator += e.deltaY;
        if (scrollAccumulator > 60) {
          triggerReveal();
        }
      }
    }, { passive: true });

    // Touch swipe support for mobile (early skip)
    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      if (!hasRevealed) {
        const touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 50) {
          triggerReveal();
        }
      }
    }, { passive: true });
  }
});
