/**
 * D. Sameer — Hero Section Motion & Micro-Interactions
 * Powered by GSAP 3 (Hardware-Accelerated 60fps)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroMotion();
  initInteractiveGrid();
  initMobileNav();
  initRoleScroller();
  initPortraitGlitchHover();
  initMacDock();
  initGlossyLiquidBlack();
  initProjectCaseStudies();
  initWorksProjectHover();
  initGitHubCalendar();
  initLakesideWaterRipple();
});

/**
 * Rapid, Hardware-Accelerated Stage Entrance Timeline
 */
function initHeroMotion() {
  if (typeof gsap === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const isBypassed = urlParams.get('loaded') === 'true' || sessionStorage.getItem('sameer_loaded') === 'true' || (window.location.hash && window.location.hash.length > 1);
  const hasIntro = document.getElementById('intro-stage-wrapper') && !isBypassed;

  if (hasIntro) {
    // Hold reveal until intro curtain covers the screen; main.js calls window.playHeroMotion()
    window.playHeroMotion = () => {
      runHeroEntrance();
    };
    return;
  }

  // Intro bypassed / returning visitor: run immediately
  runHeroEntrance();
}

function runHeroEntrance() {
  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out'
    }
  });

  const curtain = document.getElementById('curtain-wipe');
  const curtainCols = gsap.utils.toArray('.curtain-col');

  if (curtain && curtainCols.length > 0) {
    gsap.set(curtain, { display: 'flex' });
    gsap.set(curtainCols, { yPercent: 0, y: 0 });
    tl.to(curtainCols, {
      yPercent: -100,
      duration: 0.75,
      stagger: 0.08,
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.set(curtain, { display: 'none' });
        // Enable and restore scroller once curtain reveals hero section
        document.documentElement.classList.remove('intro-active');
        document.body.classList.remove('intro-active');
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    }, 0);
  } else {
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
  }

  // 1. Header slides down
  tl.fromTo('#site-header', 
    { y: -20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.45, clearProps: 'transform,opacity' },
    0.2
  )
  // 2. Greeting
  .fromTo('#hero-greeting',
    { y: 14, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, clearProps: 'transform,opacity' },
    0.25
  )
  // 3. Headline
  .fromTo('#hero-headline .headline-main',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.45, clearProps: 'transform,opacity' },
    0.35
  )
  // 4. Bio
  .fromTo('#hero-bio',
    { y: 15, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, clearProps: 'transform,opacity' },
    0.45
  )
  // 5. Action CTAs
  .fromTo(['.cta-btn-primary', '.cta-btn-secondary'],
    { y: 14, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: 'power2.out', clearProps: 'transform,opacity' },
    0.55
  );
}

/**
 * Cyberpunk RGB Glitch & Horizontal Slice Motion on Hover
 * Replicating exact mechanics of animations/hover.mp4:
 * - Clustered horizontal slice displacement
 * - Chromatic aberration (Red & Cyan channel separation)
 * - CRT/VHS raster scanlines
 * - Flickering white rectangular digital noise artifacts
 * - Dynamic mouse tracking & 0% CPU consumption when idle
 */
function initPortraitGlitchHover() {
  const container = document.getElementById('hero-portrait-container');
  const img = document.getElementById('hero-portrait-img');
  const canvas = document.getElementById('hero-glitch-canvas');

  if (!container || !img || !canvas) return;

  const ctx = canvas.getContext('2d');
  let redCanvas = null;
  let cyanCanvas = null;
  let isHovered = false;
  let animId = null;
  let frameCount = 0;
  let mouseNormY = 0.35; // Default focus near head/eyes
  let currentGlitch = null;

  function initChannels() {
    const w = img.naturalWidth || 1000;
    const h = img.naturalHeight || 1621;

    canvas.width = w;
    canvas.height = h;

    // Offscreen Red Channel (Hot chromatic red with touch of brand orange)
    redCanvas = document.createElement('canvas');
    redCanvas.width = w;
    redCanvas.height = h;
    const rCtx = redCanvas.getContext('2d');
    rCtx.drawImage(img, 0, 0);
    rCtx.globalCompositeOperation = 'source-in';
    rCtx.fillStyle = '#FF2200';
    rCtx.fillRect(0, 0, w, h);

    // Offscreen Cyan Channel (Electric cyber cyan)
    cyanCanvas = document.createElement('canvas');
    cyanCanvas.width = w;
    cyanCanvas.height = h;
    const cCtx = cyanCanvas.getContext('2d');
    cCtx.drawImage(img, 0, 0);
    cCtx.globalCompositeOperation = 'source-in';
    cCtx.fillStyle = '#00F0FF';
    cCtx.fillRect(0, 0, w, h);
  }

  if (img.complete && img.naturalWidth > 0) {
    initChannels();
  } else {
    img.addEventListener('load', initChannels);
  }

  function generateSlices() {
    const w = canvas.width;
    const h = canvas.height;
    const slices = [];

    // STRICTLY SINGLE LOCALIZED GLITCH ZONE centered around mouse hover position
    // Band half-height: ~110px in canvas coordinates (~45px in screen pixels)
    const bandRadius = 110;
    const focusY = Math.max(bandRadius, Math.min(h - bandRadius, mouseNormY * h));
    const zoneTop = focusY - bandRadius;
    const zoneBottom = focusY + bandRadius;

    // 4 to 6 slices tightly confined inside the hover band
    const numSlices = 4 + Math.floor(Math.random() * 3);
    let currY = zoneTop + (Math.random() * 15);

    for (let i = 0; i < numSlices; i++) {
      const sh = 10 + Math.random() * 26;
      if (currY + sh > zoneBottom) break;

      const dir = (i % 2 === 0 ? 1 : -0.8);
      const dx = dir * (16 + Math.random() * 42);
      const rgbOffset = 10 + Math.random() * 18;
      slices.push({ sy: currY, sh, dx, rgbOffset });
      currY += sh + (Math.random() * 12);
    }

    // White glitch block artifact: ONLY inside the hovered band near cursor
    const blocks = [];
    if (Math.random() > 0.25) {
      const bx = (w * 0.38) + (Math.random() - 0.5) * (w * 0.3);
      const by = focusY - 30 + (Math.random() * 60);
      const bw = 14 + Math.random() * 16;
      const bh = 12 + Math.random() * 14;
      blocks.push({ x: bx, y: by, w: bw, h: bh });
    }

    return { focusY, zoneTop, zoneBottom, bandRadius, slices, blocks };
  }

  function renderGlitch() {
    if (!isHovered) return;

    frameCount++;
    const w = canvas.width;
    const h = canvas.height;

    // Crunchy 30fps digital cadence inside 60fps rAF loop
    if (frameCount % 2 === 0 || !currentGlitch) {
      currentGlitch = generateSlices();
    }

    ctx.clearRect(0, 0, w, h);

    // 1. Draw base image completely undisturbed (ZERO global jitter/chromatic distortion)
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, 0, 0);

    const { focusY, zoneTop, zoneBottom, bandRadius, slices, blocks } = currentGlitch;

    // 2. Render sliced displacement strips ONLY inside the hovered band
    slices.forEach(slice => {
      const { sy, sh, dx, rgbOffset } = slice;

      // Clear only this slice strip on canvas
      ctx.clearRect(0, sy, w, sh);

      // Cyan channel shifted left
      if (cyanCanvas) {
        ctx.globalAlpha = 0.85;
        ctx.drawImage(cyanCanvas, 0, sy, w, sh, dx - rgbOffset, sy, w, sh);
      }

      // Red channel shifted right
      if (redCanvas) {
        ctx.globalAlpha = 0.85;
        ctx.drawImage(redCanvas, 0, sy, w, sh, dx + rgbOffset, sy, w, sh);
      }

      // Original image slice in center
      ctx.globalAlpha = 0.92;
      ctx.drawImage(img, 0, sy, w, sh, dx, sy, w, sh);
    });

    // 3. Scanlines overlay strictly confined to the hovered band with soft boundary falloff
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    for (let y = Math.floor(zoneTop); y < zoneBottom; y += 4) {
      const distFromCenter = Math.abs(y - focusY) / bandRadius;
      const alpha = Math.max(0, 0.25 * (1 - Math.pow(distFromCenter, 2)));
      if (alpha > 0.02) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, y, w, 1.5);
      }
    }
    ctx.restore();

    // 4. White noise block strictly in the hovered zone
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#FFFFFF';
    blocks.forEach(block => {
      ctx.fillRect(block.x, block.y, block.w, block.h);
    });

    animId = requestAnimationFrame(renderGlitch);
  }

  function startGlitch() {
    if (isHovered) return;
    if (!redCanvas || !cyanCanvas) initChannels();
    isHovered = true;
    canvas.style.display = 'block';
    img.style.opacity = '0';
    animId = requestAnimationFrame(renderGlitch);
  }

  function stopGlitch() {
    isHovered = false;
    if (animId) cancelAnimationFrame(animId);
    canvas.style.display = 'none';
    img.style.opacity = '1';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Mouse event listeners
  container.addEventListener('mouseenter', startGlitch);
  container.addEventListener('mouseleave', stopGlitch);
  container.addEventListener('mousemove', (e) => {
    const rect = img.getBoundingClientRect();
    if (rect.height > 0) {
      mouseNormY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      currentGlitch = null; // Re-align slice immediately on mouse movement
    }
  });

  // Mobile / Touch support: brief glitch burst on tap
  let touchTimeout = null;
  container.addEventListener('touchstart', () => {
    startGlitch();
    clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
      stopGlitch();
    }, 550);
  }, { passive: true });
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.querySelector('.nav-navigation');

  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    const active = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-active', active);
    toggle.setAttribute('aria-expanded', active ? 'true' : 'false');
    document.body.classList.toggle('menu-open', active);
  });

  // Smooth scroll and auto-close when clicking any nav link
  const links = nav.querySelectorAll('.nav-menu-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  nav.addEventListener('click', (e) => {
    if (e.target === nav) closeMenu();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
  });
}

/**
 * Interactive Architectural Canvas Grid with Water Ripple Physics
 * - Grid size: ~42px (balanced, clean density)
 * - Mouse hover: illuminates surrounding grid lines with higher brightness & brand orange (no dots)
 * - Click interaction: creates authentic concentric water ripple waves, rippling the grid like a stone in a silent lake
 */
function initInteractiveGrid() {
  const canvas = document.getElementById('interactive-grid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = window.innerWidth;
  let height = window.innerHeight;

  const STEP = 60; // Increased grid box size (spacious 60px modular grid)
  const SUB_STEP = 10; // Smooth sampling along lines for fluid water waves

  const mouse = {
    x: width * 0.45,
    y: height * 0.4,
    targetX: width * 0.45,
    targetY: height * 0.4,
    active: 0.35, // Soft initial blend
    isHovering: false
  };

  const ripples = [];
  let isRunning = false;

  function spawnRipple(x, y) {
    const maxDist = Math.hypot(
      Math.max(x, width - x),
      Math.max(y, height - y)
    ) + 120;

    ripples.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.max(maxDist, 600),
      speed: 6.8, // Fluid wave propagation speed
      amp: 16.5,  // Ripple height displacement
      decay: 0.988, // Natural water viscosity dampening
      wavelength: 58,
      spread: 135
    });

    startLoop();
  }

  function getDisplacedPoint(x, y) {
    let dx = 0;
    let dy = 0;

    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      const dX = x - r.x;
      const dY = y - r.y;
      const dist = Math.hypot(dX, dY);
      const diff = dist - r.radius;

      if (Math.abs(diff) < r.spread) {
        // Gaussian wave packet * harmonic sine wave
        const env = Math.exp(-Math.pow(diff / (r.spread * 0.42), 2));
        const wave = Math.sin((diff / r.wavelength) * Math.PI * 2) * env;
        const disp = wave * r.amp;
        if (dist > 0.001) {
          dx += (dX / dist) * disp;
          dy += (dY / dist) * disp;
        }
      }
    }
    return { x: x + dx, y: y + dy };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Warm ambient halo around cursor
    if (mouse.active > 0.02) {
      const aura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 380);
      aura.addColorStop(0, `rgba(248, 232, 210, ${0.45 * mouse.active})`);
      aura.addColorStop(0.45, `rgba(252, 91, 17, ${0.08 * mouse.active})`);
      aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Translucent water wave crest ripple rings
    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      const life = 1 - (r.radius / r.maxRadius);
      if (life > 0) {
        const ringAlpha = life * (r.amp / 16.5) * 0.45;

        // Primary wave crest ring (subtle brand orange water refraction)
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(252, 91, 17, ${ringAlpha * 0.85})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Secondary harmonic echo ring
        if (r.radius > 50) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, Math.max(0, r.radius - 50), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(51, 51, 51, ${ringAlpha * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Tertiary outer wake ring
        if (r.radius > 100) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, Math.max(0, r.radius - 100), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(202, 202, 202, ${ringAlpha * 0.5})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    // 3. Grid line stroke styling: softly blended base, fully appearing on hover
    let strokeStyle = 'rgba(202, 202, 202, 0.15)';
    if (mouse.active > 0.02) {
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 360);
      grad.addColorStop(0, `rgba(252, 91, 17, ${0.95 * mouse.active})`);
      grad.addColorStop(0.24, `rgba(0, 0, 0, ${0.85 * mouse.active})`);
      grad.addColorStop(0.55, `rgba(51, 51, 51, ${0.48 * mouse.active})`);
      grad.addColorStop(1, 'rgba(202, 202, 202, 0.15)');
      strokeStyle = grad;
    }

    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1.15;

    // Vertical grid lines
    for (let x = 0; x <= width + STEP; x += STEP) {
      ctx.beginPath();
      let first = true;
      for (let y = 0; y <= height + SUB_STEP; y += SUB_STEP) {
        const pt = getDisplacedPoint(x, y);
        if (first) {
          ctx.moveTo(pt.x, pt.y);
          first = false;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = 0; y <= height + STEP; y += STEP) {
      ctx.beginPath();
      let first = true;
      for (let x = 0; x <= width + SUB_STEP; x += SUB_STEP) {
        const pt = getDisplacedPoint(x, y);
        if (first) {
          ctx.moveTo(pt.x, pt.y);
          first = false;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();
    }
  }

  function tick() {
    // Smooth lerp mouse position
    const dx = mouse.targetX - mouse.x;
    const dy = mouse.targetY - mouse.y;
    mouse.x += dx * 0.18;
    mouse.y += dy * 0.18;

    // Update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += r.speed;
      r.amp *= r.decay;

      if (r.radius > r.maxRadius || r.amp < 0.08) {
        ripples.splice(i, 1);
      }
    }

    draw();

    const mouseMoving = Math.abs(dx) > 0.25 || Math.abs(dy) > 0.25;
    if (ripples.length > 0 || mouseMoving) {
      requestAnimationFrame(tick);
    } else {
      isRunning = false;
    }
  }

  function startLoop() {
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(tick);
    }
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    startLoop();
  }

  // Initialize canvas size and event listeners
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Pointer move handler (mouse hover reveal)
  window.addEventListener('pointermove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    if (!mouse.isHovering) {
      mouse.isHovering = true;
      if (typeof gsap !== 'undefined') {
        gsap.to(mouse, {
          active: 1,
          duration: 0.35,
          ease: 'power2.out',
          onUpdate: () => startLoop()
        });
      } else {
        mouse.active = 1;
      }
    }
    startLoop();
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
    if (typeof gsap !== 'undefined') {
      gsap.to(mouse, {
        active: 0,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => startLoop()
      });
    } else {
      mouse.active = 0;
      startLoop();
    }
  });

  // Click handler: stone-in-lake water ripple wave animation!
  window.addEventListener('pointerdown', (e) => {
    spawnRipple(e.clientX, e.clientY);
  });

  // Initial introductory ripple to reveal the water physics on arrival
  setTimeout(() => {
    spawnRipple(width * 0.55, height * 0.42);
  }, 1000);
}

/**
 * ============================================================================
 * FULLSCREEN KINETIC SPECIALTIES SCROLLER (Dial & ScrollTrigger)
 * Inspired by animations/scroller.mp4
 * ============================================================================
 */
function initRoleScroller() {
  const section = document.getElementById('specialties');
  const wheel = document.getElementById('scroller-wheel');
  if (!section || !wheel) return;

  const items = [
    { id: '01', title: 'Data Scientist' },
    { id: '02', title: 'Full Stack Developer' },
    { id: '03', title: 'Vibe Coder' }
  ];

  // Wheel geometry (matching assets/6.png, decreased big line by 10%)
  const radius = 460; // Circle outer track radius for regular ticks (70px length)
  const innerRadius = 390; // Circle inner track radius for ticks
  const bigOuterRadius = 493; // 10% decreased outer radius for big line (103px length, down from 114px)
  const numRadius = 575; // Radius where numbers sit cleanly outside their big line (32px gap)
  const angleStep = 36; // Increased distance between successive items (50% wider spacing)
  const totalAngle = (items.length - 1) * angleStep; // 72 deg
  const holdRange = 9.0; // Degrees where text stays 100% sharp and solid without blurring
  const fadeRange = 22.5; // Degrees of travel where text blurs late and smoothly dissolves

  // Wheel nodes: 00 (decorative), 01, 02, 03, 04, 05 (decorative)
  const allNumbers = [
    { num: '00', angle: -angleStep, isClickable: false },
    { num: '01', angle: 0, index: 0, isClickable: true },
    { num: '02', angle: angleStep, index: 1, isClickable: true },
    { num: '03', angle: angleStep * 2, index: 2, isClickable: true },
    { num: '04', angle: angleStep * 3, index: 3, isClickable: false },
    { num: '05', angle: angleStep * 4, index: 4, isClickable: false }
  ];

  // Build SVG radial tick gauge matching assets/6.png ("|||||" scroller)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-460 -460 920 920');
  svg.setAttribute('class', 'scroller-gauge-svg');
  const ticksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.appendChild(ticksGroup);
  wheel.appendChild(svg);

  // Generate 120 radial tick marks along circumference (3 deg step)
  for (let deg = 0; deg < 360; deg += 3) {
    const rad = (deg * Math.PI) / 180;
    const matchingNumber = allNumbers.find(
      (n) => ((n.angle % 360) + 360) % 360 === deg
    );

    if (matchingNumber) {
      // Each number has its OWN big line beside it (103px length, 8px thick, constant solid black)
      const x1 = (innerRadius * Math.cos(rad)).toFixed(2);
      const y1 = (innerRadius * Math.sin(rad)).toFixed(2);
      const x2 = (bigOuterRadius * Math.cos(rad)).toFixed(2);
      const y2 = (bigOuterRadius * Math.sin(rad)).toFixed(2);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', '#000000');
      line.setAttribute('stroke-width', '8');
      line.setAttribute('stroke-linecap', 'butt');
      ticksGroup.appendChild(line);
    } else {
      // Regular tick mark (70px length, 3.5px thick)
      const x1 = (innerRadius * Math.cos(rad)).toFixed(2);
      const y1 = (innerRadius * Math.sin(rad)).toFixed(2);
      const x2 = (radius * Math.cos(rad)).toFixed(2);
      const y2 = (radius * Math.sin(rad)).toFixed(2);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', '#000000');
      line.setAttribute('stroke-width', '3.5');
      line.setAttribute('stroke-linecap', 'butt');
      ticksGroup.appendChild(line);
    }
  }

  const nodeSpans = [];

  // Position nodes along wheel circumference outside the gauge
  allNumbers.forEach((item) => {
    const node = document.createElement('div');
    node.className = `wheel-node ${item.index === 0 ? 'active' : ''}`;
    if (item.index !== undefined) {
      node.dataset.index = item.index;
    }
    const span = document.createElement('span');
    span.textContent = item.num;
    node.appendChild(span);
    nodeSpans.push(span);

    const rad = (item.angle * Math.PI) / 180;
    const x = numRadius * Math.cos(rad);
    const y = numRadius * Math.sin(rad);

    node.style.transform = `translate(${x}px, ${y}px) rotate(${item.angle}deg)`;
    wheel.appendChild(node);

    if (item.isClickable) {
      node.addEventListener('click', () => {
        goToIndex(item.index);
      });
    }
  });

  const cards = section.querySelectorAll('.role-card-item');
  const wheelObj = { rotation: 0 };
  let currentIndex = 0;

  function updateScrollerFrame(rot) {
    // 1. Rotate the wheel element (rotates ticks, big lines, and number nodes together!)
    wheel.style.transform = `rotate(${rot}deg)`;

    // 2. Update each number node on the wheel (big lines maintain constant solid black)
    allNumbers.forEach((item, i) => {
      const span = nodeSpans[i];
      if (!span) return;

      const worldAngle = item.angle + rot;
      const dist = Math.abs(worldAngle);

      // Proximity to horizontal center (0 to 1) calibrated to new wider step
      const p = Math.max(0, 1 - dist / 22);
      const smoothP = p * p * (3 - 2 * p);

      // Scale down when inactive, reaching 1.0 (native size) at center for crisp 1:1 pixel sharpness
      const scale = 0.55 + 0.45 * smoothP;
      const opacity = 0.22 + 0.78 * smoothP;
      const grey = Math.round((1 - smoothP) * 180);

      span.style.transform = `scale(${scale.toFixed(3)})`;
      span.style.opacity = opacity.toFixed(3);
      span.style.color = `rgb(${grey}, ${grey}, ${grey})`;
    });

    // 3. Update each title card: stay bit longer, travel with arc, and blur late
    cards.forEach((card, idx) => {
      const cardBaseAngle = idx * angleStep;
      const cardAngle = cardBaseAngle + rot;
      const cardDist = Math.abs(cardAngle);

      // Vertical displacement matching the wheel arc:
      const dy = numRadius * Math.sin(cardAngle * Math.PI / 180);

      // Opacity and late blur fade:
      // Holds 100% sharp and visible until holdRange, then blurs late up to fadeRange
      let smoothCardP = 0;
      if (cardDist <= holdRange) {
        smoothCardP = 1.0;
      } else if (cardDist < fadeRange) {
        const t = (cardDist - holdRange) / (fadeRange - holdRange);
        const p = 1 - t;
        smoothCardP = p * p * (3 - 2 * p);
      }

      if (smoothCardP <= 0.005) {
        card.style.opacity = '0';
        card.style.visibility = 'hidden';
        card.style.pointerEvents = 'none';
      } else {
        card.style.visibility = 'visible';
        card.style.opacity = smoothCardP.toFixed(3);
        const blurPx = ((1 - smoothCardP) * 12).toFixed(1);
        card.style.filter = `blur(${blurPx}px)`;
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          const mobileDy = (dy * 0.15).toFixed(1);
          card.style.transform = `translate(-50%, calc(-50% + ${mobileDy}px))`;
        } else {
          card.style.transform = `translateY(${dy.toFixed(1)}px)`;
        }
        card.style.pointerEvents = smoothCardP > 0.85 ? 'auto' : 'none';

        // Synchronized tagline kinetic animation
        const tagline = card.querySelector('.role-tagline');
        if (tagline) {
          const tagOffsetY = ((1 - smoothCardP) * 10).toFixed(1);
          const tagOpacity = Math.max(0, (smoothCardP - 0.1) / 0.9).toFixed(3);
          tagline.style.transform = `translateY(${tagOffsetY}px)`;
          tagline.style.opacity = tagOpacity;
        }

        // Synchronized works section kinetic animation
        const worksSec = card.querySelector('.role-works-section');
        if (worksSec) {
          const worksOffsetY = ((1 - smoothCardP) * 14).toFixed(1);
          const worksOpacity = Math.max(0, (smoothCardP - 0.15) / 0.85).toFixed(3);
          worksSec.style.transform = `translateY(${worksOffsetY}px)`;
          worksSec.style.opacity = worksOpacity;
        }
      }
    });

    // Determine current index for reference
    const activeIdx = Math.round(-rot / angleStep);
    if (activeIdx >= 0 && activeIdx < items.length) {
      currentIndex = activeIdx;
    }
  }

  // Initialize at rotation 0
  updateScrollerFrame(0);

  let scrollerTrigger = null;
  let isProgrammatic = false;
  let programmaticTimer = null;

  function goToIndex(idx) {
    if (idx < 0 || idx >= items.length) return;
    const targetRot = -idx * angleStep;

    isProgrammatic = true;
    clearTimeout(programmaticTimer);

    gsap.to(wheelObj, {
      rotation: targetRot,
      duration: 0.75,
      ease: 'power3.out',
      overwrite: 'auto',
      onUpdate: () => {
        updateScrollerFrame(wheelObj.rotation);
      },
      onComplete: () => {
        isProgrammatic = false;
      }
    });

    if (scrollerTrigger) {
      const start = scrollerTrigger.start;
      const end = scrollerTrigger.end;
      const stepProgress = (idx / (items.length - 1)) * dialPortion;
      const targetScroll = start + stepProgress * (end - start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });

      programmaticTimer = setTimeout(() => {
        isProgrammatic = false;
      }, 850);
    }
  }

  // Pinned ScrollTrigger setup with seamless reveal of next glossy liquid section
  // 250% scroll distance for dial wheel + 100% distance hold on MERN Stack Developer + 100% distance for page reveal
  const dialDistance = 2.5;
  const holdDistance = 1.0; // Increased distance between MERN Stack Developer and glossy liquid background
  const revealDistance = 1.0;
  const totalPinMultiplier = dialDistance + holdDistance + revealDistance; // 4.5
  const dialPortion = dialDistance / totalPinMultiplier; // ~0.5556
  const holdPortion = (dialDistance + holdDistance) / totalPinMultiplier; // ~0.7778

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    scrollerTrigger = ScrollTrigger.create({
      trigger: '#specialties',
      start: 'top top',
      end: `+=${totalPinMultiplier * 100}%`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        if (isProgrammatic) return;
        const p = self.progress; // 0 to 1

        if (p <= dialPortion) {
          // Phase 1: Dial wheel rotation through roles (01 Data Scientist -> 03 MERN Stack Developer)
          const dialProgress = p / dialPortion;
          const targetRot = -dialProgress * totalAngle;
          wheelObj.rotation = targetRot;
          updateScrollerFrame(targetRot);
        } else {
          // Phase 2: MERN Stack Developer reached - stays completely STATIC and holds comfortably
          // Phase 3 (p > holdPortion): Glossy liquid background smoothly slides up over the static page
          wheelObj.rotation = -totalAngle;
          updateScrollerFrame(-totalAngle);
        }
      }
    });
  }
}

/**
 * ============================================================================
 * WHITE LIQUID GLASS MACOS SOFTWARE APPS DOCK (Data Scientist & AI Engineer)
 * Static width conservation: background box stays static while items adjust
 * Refer: animations/mac_dock.mp4 & assets/Screenshot 2026-10-25 172540.png
 * ============================================================================
 */
function initMacDock() {
  const dockConfigs = [
    { dockId: 'data-scientist-dock', tooltipId: 'dock-tooltip' },
    { dockId: 'ai-engineer-dock', tooltipId: 'dock-tooltip-1' },
    { dockId: 'mern-developer-dock', tooltipId: 'dock-tooltip-2' }
  ];

  dockConfigs.forEach(({ dockId, tooltipId }) => {
    setupSingleDock(dockId, tooltipId);
  });
}

function setupSingleDock(dockId, tooltipId) {
  const dock = document.getElementById(dockId);
  const tooltip = document.getElementById(tooltipId);
  if (!dock || !tooltip) return;

  const itemElements = Array.from(dock.querySelectorAll('.dock-item'));
  const N = itemElements.length;
  if (N === 0) return;

  // Dock configuration: all dock items strictly 45px width and 45px height
  function getBaseConfig() {
    const baseSize = 45;
    const maxDelta = 22;
    const radius = 140;
    const minSize = 34;
    const totalBudget = N * baseSize;
    return { baseSize, maxDelta, radius, totalBudget, minSize };
  }

  let cfg = getBaseConfig();

  function resetDock() {
    itemElements.forEach((item) => {
      item.style.width = cfg.baseSize + 'px';
      item.style.height = cfg.baseSize + 'px';
    });
    tooltip.style.opacity = '0';
  }

  window.addEventListener('resize', () => {
    cfg = getBaseConfig();
    resetDock();
  });

  // Click bounce micro-interaction (signature macOS dock feedback)
  itemElements.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.remove('bouncing');
      void item.offsetWidth; // force DOM reflow
      item.classList.add('bouncing');
      setTimeout(() => item.classList.remove('bouncing'), 800);
    });
  });

  let mouseX = null;
  let isHovering = false;
  let currentTweens = [];

  function killTweens() {
    currentTweens.forEach((t) => t.kill());
    currentTweens = [];
  }

  function renderMagnification() {
    if (!isHovering || mouseX === null) return;

    // 1. Compute item centers
    const centers = itemElements.map((item) => {
      const rect = item.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });

    let closestItem = null;
    let minDistance = Infinity;

    // 2. Bell curve magnification factor for each item
    const factors = centers.map((c, i) => {
      const dist = Math.abs(mouseX - c);
      if (dist < minDistance) {
        minDistance = dist;
        closestItem = itemElements[i];
      }
      return dist < cfg.radius ? Math.cos((dist / cfg.radius) * (Math.PI / 2)) : 0;
    });

    // 3. Raw expansion of items near cursor
    const rawDeltas = factors.map((f) => cfg.maxDelta * f);
    const sumExpansion = rawDeltas.reduce((a, b) => a + b, 0);

    // 4. Reduction weights: remaining items absorb reduction to keep dock width strictly static!
    const reductionWeights = factors.map((f) => Math.pow(1 - f, 1.5));
    const sumWeights = reductionWeights.reduce((a, b) => a + b, 0) || 1;

    // 5. Final widths for each item strictly conserved
    const finalWidths = rawDeltas.map((delta, i) => {
      const reduction = sumExpansion * (reductionWeights[i] / sumWeights);
      return Math.max(cfg.minSize, cfg.baseSize + delta - reduction);
    });

    // Apply widths and heights
    itemElements.forEach((item, i) => {
      const w = finalWidths[i].toFixed(1);
      item.style.width = w + 'px';
      item.style.height = w + 'px';
    });

    // 6. Tooltip position above closest item
    if (closestItem && minDistance < 46) {
      const cRect = closestItem.getBoundingClientRect();
      const dockRect = dock.getBoundingClientRect();
      const toolX = cRect.left + cRect.width / 2 - dockRect.left;
      const toolBottom = cRect.height + 22; // Elevated cleanly above magnified icon

      tooltip.textContent = closestItem.dataset.name;
      tooltip.style.left = toolX + 'px';
      tooltip.style.bottom = toolBottom + 'px';
      tooltip.style.opacity = '1';
    } else {
      tooltip.style.opacity = '0';
    }
  }

  dock.addEventListener('mouseenter', () => {
    isHovering = true;
    killTweens();
  });

  dock.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    renderMagnification();
  });

  dock.addEventListener('mouseleave', () => {
    isHovering = false;
    mouseX = null;
    tooltip.style.opacity = '0';

    killTweens();
    // Smooth macOS spring return to resting size
    itemElements.forEach((item) => {
      const tween = gsap.to(item, {
        width: cfg.baseSize,
        height: cfg.baseSize,
        duration: 0.38,
        ease: 'back.out(1.4)',
        overwrite: true
      });
      currentTweens.push(tween);
    });
  });

  // Smooth touch & mobile support
  dock.addEventListener('touchstart', (e) => {
    isHovering = true;
    killTweens();
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      renderMagnification();
    }
  }, { passive: true });

  dock.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      renderMagnification();
    }
  }, { passive: true });

  dock.addEventListener('touchend', () => {
    isHovering = false;
    mouseX = null;
    tooltip.style.opacity = '0';
    killTweens();
    itemElements.forEach((item) => {
      const tween = gsap.to(item, {
        width: cfg.baseSize,
        height: cfg.baseSize,
        duration: 0.38,
        ease: 'back.out(1.4)',
        overwrite: true
      });
      currentTweens.push(tween);
    });
  }, { passive: true });
}

/**
 * ============================================================================
 * GLOSSY LIQUID BLACK SHADER & INTERACTIVE CAUSTIC CANVAS
 * Refer: animations/page.mp4
 * High-performance WebGL viscous black fluid simulation with Blinn-Phong gloss,
 * normal mapping, specular highlights, and mouse ripple physics.
 * ============================================================================
 */
function initGlossyLiquidBlack() {
  const canvas = document.getElementById('liquid-black-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    // Graceful fallback to CSS gradient
    return;
  }

  const vsSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_mouse_intensity;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float liquidHeight(vec2 uv, float t) {
      vec2 p = uv * 2.8;
      float q1 = snoise(p + vec2(t * 0.12, t * 0.08));
      float q2 = snoise(p + vec2(-t * 0.1, t * 0.14) + vec2(q1 * 0.6));
      
      float h = snoise(p + vec2(q2 * 0.5) + vec2(0.0, t * 0.09)) * 0.5;
      h += snoise(p * 2.0 - vec2(t * 0.15)) * 0.25;
      h += snoise(p * 4.0 + vec2(t * 0.22)) * 0.12;

      vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 mDist = (uv - u_mouse) * aspect;
      float d = length(mDist);
      float mouseRipple = sin(d * 28.0 - t * 4.0) * exp(-d * 4.5) * u_mouse_intensity;
      h += mouseRipple * 0.35;

      return h;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float t = u_time * 0.8;

      float eps = 1.0 / u_resolution.y;
      float hL = liquidHeight(uv - vec2(eps, 0.0), t);
      float hR = liquidHeight(uv + vec2(eps, 0.0), t);
      float hD = liquidHeight(uv - vec2(0.0, eps), t);
      float hU = liquidHeight(uv + vec2(0.0, eps), t);

      float bumpFactor = 1.4;
      vec3 normal = normalize(vec3((hL - hR) * bumpFactor, (hD - hU) * bumpFactor, 1.0));

      vec3 lightPos1 = normalize(vec3(0.3, 0.6, 0.8));
      vec3 lightPos2 = normalize(vec3(-0.5, -0.3, 0.6));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);

      vec3 halfDir1 = normalize(lightPos1 + viewDir);
      float spec1 = pow(max(dot(normal, halfDir1), 0.0), 32.0);
      float sharpSpec1 = pow(max(dot(normal, halfDir1), 0.0), 128.0);

      vec3 halfDir2 = normalize(lightPos2 + viewDir);
      float spec2 = pow(max(dot(normal, halfDir2), 0.0), 24.0);

      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

      vec3 baseColor = vec3(0.012, 0.014, 0.018);
      vec3 sheenColor = vec3(0.09, 0.10, 0.13);
      vec3 specColor = vec3(0.85, 0.88, 0.95);

      vec3 color = baseColor;
      color += sheenColor * (spec1 * 0.7 + spec2 * 0.4);
      color += specColor * (sharpSpec1 * 0.85);
      color += sheenColor * (fresnel * 0.6);

      float depth = (hU + hD + hL + hR) * 0.25;
      color += vec3(0.03, 0.035, 0.045) * depth;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');
  const uIntensity = gl.getUniformLocation(program, 'u_mouse_intensity');

  let mouse = { x: 0.5, y: 0.5 };
  let targetMouse = { x: 0.5, y: 0.5 };
  let intensity = 0.0;
  let targetIntensity = 0.0;
  let isVisible = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  const section = document.getElementById('liquid-zone') || document.getElementById('works');
  if (section) {
    section.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetIntensity = 1.0;
    });

    section.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        targetMouse.x = (e.touches[0].clientX - rect.left) / rect.width;
        targetMouse.y = 1.0 - (e.touches[0].clientY - rect.top) / rect.height;
        targetIntensity = 1.0;
      }
    }, { passive: true });
  }

  // IntersectionObserver to only render WebGL frames when in/near viewport
  if ('IntersectionObserver' in window && section) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { rootMargin: '200px 0px 200px 0px' });
    observer.observe(section);
  } else {
    isVisible = true;
  }

  let startTime = performance.now();
  function render() {
    if (isVisible) {
      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;
      targetIntensity *= 0.96;
      intensity += (targetIntensity - intensity) * 0.08;

      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uIntensity, Math.max(intensity, 0.15));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/**
 * ============================================================================
 * SELECTED WORKS CASE STUDIES MODAL & INTERACTION ENGINE
 * Refer: assets/next_page'.jpeg & portfolio_projects_works_documentation.md
 * ============================================================================
 */
const WORKS_CASE_STUDIES = {
  'shelfy-ai': {
    title: 'Shelfy AI — Hybrid Vision + LLM Architecture',
    role: 'AI Engineer & Data Scientist & Full-Stack Developer',
    logo: 'assets/AIengineer/WORKS/Shelfy AI_sq.png',
    tagline: 'End-to-end AI platform digitizing physical bookshelves in <2s with a 99.1% API cost reduction.',
    metrics: [
      { val: '99.1%', label: 'API Cost Drop' },
      { val: '< 1.8s', label: 'Scan Latency' },
      { val: '95%+', label: 'Spine Recall' },
      { val: '$0.00016', label: 'Cost / Scan' }
    ],
    overview: 'Shelfy.ai decouples high-resolution Visual Perception (handled locally by custom YOLO26n-seg + PaddleOCR) from Semantic Reasoning (handled by Gemini Flash-Lite over structured text strings). This hybrid architecture achieves 95%+ recall on dense 30–50 book shelves while reducing cloud API costs by 99.1% compared to direct multi-modal Vision LLMs.',
    highlights: [
      'Custom Ultralytics YOLO26n-seg instance segmentation retrained at imgsz=960 with polygon boundary masks.',
      'OpenCV perspective rectification transforms oriented bounding quads into normalized horizontal text strips.',
      'High-speed PaddleOCR paired with Gemini Flash-Lite & Pydantic v2 schemas strips publisher imprint noise.',
      'Full-stack Next.js 16 (App Router) + React 19 web platform with Google OAuth & Supabase PostgreSQL Row-Level Security.'
    ],
    stack: ['YOLO26-seg', 'OpenCV', 'PaddleOCR', 'Gemini Flash-Lite', 'LangChain', 'FastAPI', 'Next.js 16', 'React 19', 'Tailwind CSS', 'Supabase'],
    githubUrl: 'https://github.com/DSameer-infine8/Shelfy-AI',
    liveUrl: 'https://shelfy-ai.vercel.app'
  },
  'veriface-ai': {
    title: 'VeriFace AI — Multi-Face Biometric Verification System',
    role: 'Data Scientist (Computer Vision & Metric Learning)',
    logo: 'assets/DataScientist/WORK/1.Veriface AI_sq.png',
    tagline: 'Real-time multi-face detection, landmark alignment, and deep metric embedding recognition.',
    metrics: [
      { val: 'Multi-Face', label: 'Concurrent Tracking' },
      { val: '512-D', label: 'Metric Vectors' },
      { val: 'Affine', label: 'Landmark Normalization' },
      { val: 'Real-Time', label: 'Inference Loop' }
    ],
    overview: 'VeriFace AI is an advanced biometric computer vision system engineered to detect, align, and identify multiple human faces concurrently in crowded, unconstrained visual environments. It extracts pose-invariant deep metric embeddings to perform instant similarity matching without degradation across lighting, angles, or occlusions.',
    highlights: [
      'Concurrent multi-scale face localization scanning crowded frames with dynamic bounding boxes.',
      '5-point facial landmark normalization (eyes, nose, mouth) via affine transformation matrices to neutralize head tilt.',
      'Deep convolutional feature extractor projecting facial crops into high-dimensional metric vector space.',
      'Vectorized Cosine Similarity / Euclidean distance classification with calibrated false-acceptance thresholds.'
    ],
    stack: ['Python', 'OpenCV (cv2)', 'Deep Metric Learning', 'CNNs', 'Face Landmark Detectors', 'NumPy', 'Scikit-Learn'],
    githubUrl: 'https://github.com/DSameer-infine8/VeriFace-Advance_Multi_Face_recognition',
    liveUrl: 'https://github.com/DSameer-infine8/VeriFace-Advance_Multi_Face_recognition#demo'
  },
  'map-it': {
    title: 'Map_It — Full-Stack Interactive Mapping Platform',
    role: 'AI-Assisted MERN Stack Developer',
    logo: 'assets/MERNstackDeveloper/WORKS/Map_it.png',
    tagline: 'Full-stack MERN geolocation platform for interactive coordinate pinning, cataloging, and spatial exploration.',
    metrics: [
      { val: 'MERN', label: 'Full-Stack Architecture' },
      { val: 'Live Cloud', label: 'Render Hosting' },
      { val: 'CRUD APIs', label: 'RESTful Backend' },
      { val: 'Persistent', label: 'MongoDB Storage' }
    ],
    overview: 'Map_It is a full-stack geolocation and interactive mapping web application deployed live on Render. It enables travelers, field planners, and researchers to explore interactive map views, pin custom latitude/longitude coordinates, attach rich notes, and persist spatial markers seamlessly.',
    highlights: [
      'Interactive map canvas with smooth pan, zoom, and dynamic coordinate marker dropping on click.',
      'Structured Node.js / Express.js REST API providing secure CRUD endpoints for spatial pins and notes.',
      'Persistent MongoDB cloud database storing location documents, user metadata, and coordinate history.',
      'Responsive dual-pane user interface with synchronized sidebar cards deployed in production on Render.'
    ],
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Leaflet / Geolocation API', 'RESTful APIs', 'Render Cloud'],
    githubUrl: 'https://github.com/DSameer-infine8/Map_It',
    liveUrl: 'https://map-it.onrender.com/home'
  }
};

function initProjectCaseStudies() {
  const modal = document.getElementById('case-study-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  const modalFooter = document.getElementById('modal-footer-actions');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!modal || !modalContent) return;

  function openCaseStudy(projectId) {
    const data = WORKS_CASE_STUDIES[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="modal-header-section">
        <div class="modal-header-logo">
          <img src="${data.logo}" alt="${data.title} Logo" />
        </div>
        <div class="modal-header-info">
          <div class="modal-role-pill">${data.role}</div>
          <h2 class="modal-title">${data.title}</h2>
        </div>
      </div>

      <div class="modal-metrics-grid">
        ${data.metrics.map(m => `
          <div class="modal-metric-card">
            <div class="modal-metric-value">${m.val}</div>
            <div class="modal-metric-label">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <div class="modal-section-title">System Overview</div>
      <p class="modal-overview-text">${data.overview}</p>

      <div class="modal-section-title">Key Engineering Highlights</div>
      <ul class="modal-highlights-list">
        ${data.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>

      <div class="modal-section-title">Tech Stack & Infrastructure</div>
      <div class="modal-stack-tags">
        ${data.stack.map(s => `<span class="modal-stack-tag">${s}</span>`).join('')}
      </div>
    `;

    if (modalFooter) {
      modalFooter.innerHTML = `
        ${data.githubUrl ? `
          <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="modal-action-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub Repository ↗</span>
          </a>
        ` : ''}
        ${data.liveUrl ? `
          <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="modal-action-btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>Visit Live Application ↗</span>
          </a>
        ` : ''}
      `;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Trigger buttons
  document.querySelectorAll('.btn-open-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.getAttribute('data-modal');
      openCaseStudy(target);
    });
  });

  // Clicking a card/row directly (not on drawer links) also opens case study
  document.querySelectorAll('.project-showcase-row, .project-box-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.project-divider-drawer, .project-hover-drawer')) return;
      const target = card.getAttribute('data-project');
      openCaseStudy(target);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/**
 * ============================================================================
 * SELECTED WORKS DYNAMIC PROJECT PREVIEWS (Jackie Hu Reference Engine)
 * Refer: animations/display_projects.mp4
 * Handles interactive hover previews, staggered card reveals, and disappears "PROJECTS"
 * ============================================================================
 */
function initWorksProjectHover() {
  const worksSideCol = document.getElementById('works-side-col');
  const projectRows = document.querySelectorAll('.project-showcase-row');
  const previewClusters = document.querySelectorAll('.project-preview-cluster');
  const projectsList = document.querySelector('.works-projects-list');

  if (!worksSideCol || !projectRows.length || !previewClusters.length) return;

  let activeProjectId = null;
  let leaveTimeout = null;

  function activatePreview(projectId) {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      leaveTimeout = null;
    }

    if (activeProjectId === projectId) return;
    activeProjectId = projectId;

    // Disappear the "PROJECTS" display watermark
    worksSideCol.classList.add('is-preview-active');

    // Activate the corresponding project preview cluster
    previewClusters.forEach((cluster) => {
      const pid = cluster.getAttribute('data-preview-id');
      if (pid === projectId) {
        cluster.classList.add('is-active');
      } else {
        cluster.classList.remove('is-active');
      }
    });
  }

  function deactivatePreview() {
    if (leaveTimeout) clearTimeout(leaveTimeout);
    leaveTimeout = setTimeout(() => {
      activeProjectId = null;
      worksSideCol.classList.remove('is-preview-active');
      previewClusters.forEach((cluster) => {
        cluster.classList.remove('is-active');
      });
    }, 120);
  }

  projectRows.forEach((row) => {
    const projectId = row.getAttribute('data-project');
    if (!projectId) return;

    row.addEventListener('mouseenter', () => {
      activatePreview(projectId);
    });

    row.addEventListener('mouseleave', () => {
      deactivatePreview();
    });

    // Keyboard navigation support
    row.addEventListener('focusin', () => {
      activatePreview(projectId);
    });

    row.addEventListener('focusout', (e) => {
      if (!row.contains(e.relatedTarget)) {
        deactivatePreview();
      }
    });
  });

  if (projectsList) {
    projectsList.addEventListener('mouseleave', () => {
      deactivatePreview();
    });
  }
}






/**
 * ============================================================================
 * GITHUB CONTRIBUTIONS CALENDAR ISOMETRIC 3D & 2D ANIMATION ENGINE
 * Refer: animations/github.mp4 & assets/next_page.jpeg
 * Zero-lag HTML5 Canvas rendering with live sync to github.com/DSameer-infine8
 * ============================================================================
 */
async function initGitHubCalendar() {
  const canvas = document.getElementById('github-cal-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('cal-tooltip');
  const stage = canvas.parentElement;

  const countEl = document.getElementById('cal-count');
  const countSubEl = document.getElementById('cal-count-sub');
  const btnReplay = document.getElementById('btn-replay');

  // Load contribution data (cached script first for 0ms delay and local file:/// compatibility)
  let rawData = (typeof window !== 'undefined' && window.GITHUB_CONTRIBUTIONS_DATA) ? window.GITHUB_CONTRIBUTIONS_DATA : null;

  if (!rawData) {
    try {
      const cached = await fetch('data/contributions.json');
      if (cached.ok) {
        rawData = await cached.json();
      }
    } catch (err) {
      console.warn('Local contributions cache not loaded via fetch (e.g. file:// CORS). Falling back...', err);
    }
  }

  // Robust fallback data so calendar NEVER fails or stays blank even if offline/script missing
  if (!rawData || !rawData.contributions || !rawData.contributions.length) {
    const fallbackContributions = [];
    const now = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const count = isWeekend ? 0 : Math.floor(Math.random() * 4);
      fallbackContributions.push({
        date: d.toISOString().split('T')[0],
        count: count,
        level: count > 3 ? 4 : count
      });
    }
    rawData = {
      total: { lastYear: fallbackContributions.reduce((s, c) => s + c.count, 0) },
      contributions: fallbackContributions
    };
  }

  // Background live update directly from public GitHub endpoint
  fetch('https://github-contributions-api.jogruber.de/v4/DSameer-infine8?y=last')
    .then(r => r.json())
    .then(liveData => {
      if (liveData && liveData.contributions && liveData.contributions.length) {
        rawData = liveData;
        recalculateData();
        if (!isAnimating) {
          render(animProgress >= 1 ? 1 : animProgress);
        }
      }
    })
    .catch(() => {
      // Offline or blocked, cached data remains active
    });

  let days = [];
  let totalCount = 0;
  let peakDay = null;
  let weeks = [];

  function recalculateData() {
    days = rawData.contributions || [];
    totalCount = rawData.total ? (rawData.total.lastYear || rawData.total[new Date().getFullYear()]) : days.reduce((s, d) => s + d.count, 0);

    peakDay = days[0] || { count: 0, date: '' };
    days.forEach(d => {
      if (d.count > peakDay.count) peakDay = d;
    });

    weeks = [];
    let curWeek = [];
    days.forEach((d, i) => {
      curWeek.push(d);
      if (curWeek.length === 7 || i === days.length - 1) {
        weeks.push(curWeek);
        curWeek = [];
      }
    });
  }
  recalculateData();

  // GitHub Vibrant Orange Color Palette with 3D isometric lighting (Dark Theme on Liquid Black)
  const PALETTE = {
    0: { top: 'rgba(255, 255, 255, 0.08)', left: 'rgba(255, 255, 255, 0.04)', right: 'rgba(255, 255, 255, 0.06)' }, // 0 commits (sleek dark floor)
    1: { top: '#ffd6b8', left: '#f0ad82', right: '#f7c29e' }, // 1 commit (warm light apricot)
    2: { top: '#ff9c54', left: '#e07122', right: '#f08538' }, // 2 commits (vibrant orange)
    3: { top: '#ff6b2b', left: '#d64608', right: '#eb5819' }, // 3-4 commits (brand flame orange)
    4: { top: '#d83e00', left: '#9e2900', right: '#bd3300' }  // 5+ commits (deep burnt fire orange)
  };

  let animProgress = 0;
  let animStartTime = null;
  const animDuration = 5200; // 5.2s: 2D wave -> hold -> morph -> 3D skyline
  let isAnimating = false;
  let hasAutoPlayed = false;

  let renderedBuildings = [];
  let hoveredBuilding = null;

  // Smoothing & Interpolation Math Helpers
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
  }

  function smootherstep(t) {
    const c = Math.max(0, Math.min(1, t));
    return c * c * c * (c * (c * 6 - 15) + 10);
  }

  function easeOutCubic(t) {
    const c = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - c, 3);
  }

  function easeOutBackSubtle(t) {
    const c = Math.max(0, Math.min(1, t));
    const c1 = 0.65;
    const c3 = c1 + 1;
    const tm = c - 1;
    return 1 + c3 * tm * tm * tm + c1 * tm * tm;
  }

  function getLayout(w, h) {
    const numCols = weeks.length;
    // 2D Layout (Responsive full width)
    const cellSize = Math.min(18.5, (w - 60) / numCols);
    const gap2d = 3.2;
    const gridW2d = numCols * (cellSize + gap2d) - gap2d;
    const gridH2d = 7 * (cellSize + gap2d) - gap2d;
    const startX2d = (w - gridW2d) / 2;
    const startY2d = (h - gridH2d) / 2;

    // 3D Isometric Layout (Centered across full width)
    const tileW = Math.min(21, (w - 60) / (numCols * 0.95 + 4.2));
    const tileH = tileW * 0.50;
    const totalSpanX = (numCols - 1) * (tileW * 0.95) + 6 * (tileW * 0.45) + tileW;
    const originX = (w - totalSpanX) / 2 + 6 * (tileW * 0.45) + tileW / 2;
    const originY = Math.round(h * 0.17);

    return {
      numCols,
      cellSize,
      gap2d,
      startX2d,
      startY2d,
      tileW,
      tileH,
      originX,
      originY
    };
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!isAnimating) {
      render(animProgress >= 1 ? 1 : animProgress);
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function startAnimation() {
    animStartTime = performance.now();
    isAnimating = true;
    requestAnimationFrame(renderLoop);
  }

  function renderLoop(now) {
    const elapsed = now - animStartTime;
    const p = Math.min(1, elapsed / animDuration);
    animProgress = p;

    render(p);

    if (p < 1 && isAnimating) {
      requestAnimationFrame(renderLoop);
    } else {
      isAnimating = false;
    }
  }

  function render(p) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    // Full 2D -> 3D transition choreography
    const t2dEnd = 0.28;    // 0.00 -> 0.28: 2D Orange wave reveal + counter roll
    const tHoldEnd = 0.35;  // 0.28 -> 0.35: Steady hold to view complete 2D calendar
    const tMorphEnd = 0.48; // 0.35 -> 0.48: Continuous 3D perspective quad morph
    const tCityEnd = 0.88;  // 0.48 -> 0.88: Front-to-back 3D skyline wave in Orange
                            // 0.88 -> 1.00: Peak commit marker settle

    if (p < t2dEnd) {
      const p2d = p / t2dEnd;
      if (countEl) {
        const displayedCount = Math.floor(easeOutCubic(p2d) * totalCount);
        countEl.textContent = displayedCount.toLocaleString();
      }
      render2DGrid(ctx, w, h, p2d);
    } else if (p < tHoldEnd) {
      if (countEl) countEl.textContent = totalCount.toLocaleString();
      render2DGrid(ctx, w, h, 1.0);
    } else if (p < tMorphEnd) {
      if (countEl) countEl.textContent = totalCount.toLocaleString();
      const pMorph = (p - tHoldEnd) / (tMorphEnd - tHoldEnd);
      renderMorph(ctx, w, h, pMorph);
    } else {
      if (countEl) countEl.textContent = totalCount.toLocaleString();
      const pCity = Math.min(1, (p - tMorphEnd) / (tCityEnd - tMorphEnd));
      const pPeak = p >= tCityEnd ? Math.min(1, (p - tCityEnd) / (1 - tCityEnd)) : 0;
      render3DCity(ctx, w, h, pCity, pPeak);
    }
  }

  // --- 2D Wave Grid Renderer in Vibrant Orange ---
  function render2DGrid(ctx, w, h, progress) {
    const layout = getLayout(w, h);
    const { numCols, cellSize, gap2d, startX2d, startY2d } = layout;

    for (let col = 0; col < numCols; col++) {
      const week = weeks[col];
      for (let row = 0; row < week.length; row++) {
        const day = week[row];
        const waveThreshold = (col * 0.8 + row * 0.2) / (numCols * 0.8 + 6 * 0.2);
        if (progress < waveThreshold) continue;

        const cellProgress = Math.min(1, (progress - waveThreshold) / 0.15);
        const cellScale = smootherstep(cellProgress);

        const cx = startX2d + col * (cellSize + gap2d) + cellSize / 2;
        const cy = startY2d + row * (cellSize + gap2d) + cellSize / 2;
        const curSize = cellSize * cellScale;
        const x = cx - curSize / 2;
        const y = cy - curSize / 2;

        const colors = PALETTE[day.level] || PALETTE[0];
        ctx.fillStyle = colors.top;
        drawRoundedRect(ctx, x, y, curSize, curSize, Math.max(1, 2.5 * cellScale));
        ctx.fill();
        if (day.level === 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // --- Continuous Perspective Morph (2D Square to 3D Isometric Diamond) ---
  function renderMorph(ctx, w, h, pMorph) {
    const layout = getLayout(w, h);
    const { numCols, cellSize, gap2d, startX2d, startY2d, tileW, tileH, originX, originY } = layout;
    const tMorph = smoothstep(pMorph);

    const halfC = cellSize / 2;
    const halfW = (tileW * 0.88) / 2;
    const halfH = (tileH * 0.88) / 2;

    const items = [];
    for (let col = 0; col < numCols; col++) {
      const week = weeks[col];
      for (let row = 0; row < week.length; row++) {
        items.push({ col, row, day: week[row] });
      }
    }

    items.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    items.forEach(it => {
      const { col, row, day } = it;
      const x2d = startX2d + col * (cellSize + gap2d) + halfC;
      const y2d = startY2d + row * (cellSize + gap2d) + halfC;

      const x3d = originX + col * (tileW * 0.95) - row * (tileW * 0.45);
      const y3d = originY + row * (tileH * 1.05) + col * (tileH * 0.22);

      const x = lerp(x2d, x3d, tMorph);
      const y = lerp(y2d, y3d, tMorph);

      // Morph the 4 corners: 2D square corners seamlessly rotate into 3D diamond corners
      const v0 = { x: lerp(-halfC, 0, tMorph), y: lerp(-halfC, -halfH, tMorph) };
      const v1 = { x: lerp(halfC, halfW, tMorph), y: lerp(-halfC, 0, tMorph) };
      const v2 = { x: lerp(halfC, 0, tMorph), y: lerp(halfC, halfH, tMorph) };
      const v3 = { x: lerp(-halfC, -halfW, tMorph), y: lerp(halfC, 0, tMorph) };

      const colors = PALETTE[day.level] || PALETTE[0];
      drawQuad(ctx, x, y, v0, v1, v2, v3, colors.top, day.level === 0 ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.45)');
    });
  }

  function drawQuad(ctx, x, y, v0, v1, v2, v3, fillStyle, strokeStyle) {
    ctx.beginPath();
    ctx.moveTo(x + v0.x, y + v0.y);
    ctx.lineTo(x + v1.x, y + v1.y);
    ctx.lineTo(x + v2.x, y + v2.y);
    ctx.lineTo(x + v3.x, y + v3.y);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  // --- 3D Isometric City Renderer (Front-to-Back Fluid Rise) ---
  function render3DCity(ctx, w, h, pCity, pPeak) {
    const layout = getLayout(w, h);
    const { numCols, tileW, tileH, originX, originY } = layout;
    const maxCommitHeight = 44;
    const halfW = (tileW * 0.88) / 2;
    const halfH = (tileH * 0.88) / 2;

    const items = [];
    for (let col = 0; col < numCols; col++) {
      const week = weeks[col];
      for (let row = 0; row < week.length; row++) {
        items.push({ col, row, day: week[row] });
      }
    }

    // Sort back-to-front painter's algorithm
    items.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    renderedBuildings = [];

    items.forEach(it => {
      const { col, row, day } = it;
      const x = originX + col * (tileW * 0.95) - row * (tileW * 0.45);
      const y = originY + row * (tileH * 1.05) + col * (tileH * 0.22);

      // FRONT-TO-BACK wave progression:
      const rowDelay = (6 - row) / 6; // Front row 6 leads (0), Back row 0 follows (1)
      const colDelay = col / (numCols - 1);
      const stagger = rowDelay * 0.62 + colDelay * 0.38;

      const riseDuration = 0.36;
      const startAt = stagger * (1 - riseDuration);
      const buildingP = Math.max(0, Math.min(1, (pCity - startAt) / riseDuration));
      const smoothH = smootherstep(buildingP);

      let targetH = 0;
      if (day.count > 0 && peakDay && peakDay.count > 0) {
        targetH = 8 + (day.count / peakDay.count) * maxCommitHeight;
      }
      const curH = targetH * smoothH;

      const isHovered = hoveredBuilding && hoveredBuilding.day.date === day.date;

      drawIsometricBuilding(ctx, x, y, tileW * 0.88, tileH * 0.88, curH, day.level, isHovered);

      renderedBuildings.push({
        x,
        y,
        curH,
        day,
        col,
        row,
        halfW,
        halfH
      });
    });

    // Draw respective box: hovered building gets immediate interactive box, else show peak day
    if (hoveredBuilding) {
      drawFloatingBox(ctx, w, hoveredBuilding.x, hoveredBuilding.y - hoveredBuilding.curH, hoveredBuilding.day.count, hoveredBuilding.day.date, true);
    } else if (peakDay && pPeak > 0) {
      const peakItem = renderedBuildings.find(b => b.day.date === peakDay.date);
      if (peakItem) {
        drawFloatingBox(ctx, w, peakItem.x, peakItem.y - peakItem.curH, peakDay.count, peakDay.date, false, pPeak);
      }
    }
  }

  function drawIsometricBuilding(ctx, x, y, tw, th, height, level, isHovered = false) {
    const colors = PALETTE[level] || PALETTE[0];
    const halfW = tw / 2;
    const halfH = th / 2;

    if (height <= 0.6) {
      // Flat base tile on the ground
      ctx.beginPath();
      ctx.moveTo(x, y - halfH);
      ctx.lineTo(x + halfW, y);
      ctx.lineTo(x, y + halfH);
      ctx.lineTo(x - halfW, y);
      ctx.closePath();
      ctx.fillStyle = isHovered ? '#ff9c54' : colors.top;
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#ff6b2b' : (level === 0 ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.55)');
      ctx.lineWidth = isHovered ? 1.2 : 0.6;
      ctx.stroke();
      return;
    }

    // Left Face (Shadow)
    ctx.beginPath();
    ctx.moveTo(x - halfW, y);
    ctx.lineTo(x, y + halfH);
    ctx.lineTo(x, y + halfH - height);
    ctx.lineTo(x - halfW, y - height);
    ctx.closePath();
    ctx.fillStyle = colors.left;
    ctx.fill();

    // Right Face (Mid-tone)
    ctx.beginPath();
    ctx.moveTo(x, y + halfH);
    ctx.lineTo(x + halfW, y);
    ctx.lineTo(x + halfW, y - height);
    ctx.lineTo(x, y + halfH - height);
    ctx.closePath();
    ctx.fillStyle = colors.right;
    ctx.fill();

    // Top Face (Roof Highlight)
    ctx.beginPath();
    ctx.moveTo(x, y - halfH - height);
    ctx.lineTo(x + halfW, y - height);
    ctx.lineTo(x, y + halfH - height);
    ctx.lineTo(x - halfW, y - height);
    ctx.closePath();
    ctx.fillStyle = isHovered ? '#fff4ed' : colors.top;
    ctx.fill();

    // Edge stroke for crisp antialiasing & hover glow
    ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = isHovered ? 1.2 : 0.5;
    ctx.stroke();
  }

  function drawFloatingBox(ctx, canvasW, x, y, count, date, isHover = false, animP = 1.0) {
    ctx.save();
    const pEased = isHover ? 1.0 : easeOutBackSubtle(Math.min(1, animP));
    const alpha = isHover ? 1.0 : Math.min(1, animP * 1.5);
    ctx.globalAlpha = alpha;

    const stemH = isHover ? 18 : 26;
    const dropOffset = (1 - pEased) * 14;
    const topY = y - stemH - dropOffset;

    // Glowing Orange Pulse Beacon
    const pulseTime = performance.now() * 0.003;
    const pulseR = 3 + (Math.sin(pulseTime) * 0.5 + 0.5) * 4;
    ctx.beginPath();
    ctx.arc(x, topY, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 107, 43, 0.28)';
    ctx.fill();

    // Dotted Stem Line in Brand Orange
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, topY);
    ctx.strokeStyle = 'rgba(255, 107, 43, 0.95)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Solid Orange Beacon Dot
    ctx.beginPath();
    ctx.arc(x, topY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b2b';
    ctx.fill();

    // Respective Box Text
    const countStr = count === 0 ? 'No commits' : count === 1 ? '1 commit' : `${count} commits`;
    const dt = new Date(date);
    const dateStr = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const fullText = `${countStr} on ${dateStr}`;

    ctx.font = '600 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const textW = ctx.measureText(fullText).width;
    const padX = 10;
    const tw = textW + padX * 2;
    const th = 22;

    // Center and clamp horizontally inside canvas
    let bx = x - tw / 2;
    if (bx < 8) bx = 8;
    if (bx + tw > canvasW - 8) bx = canvasW - 8 - tw;

    // Display box cleanly on top of the beacon dot
    let by = topY - th - 6;
    if (by < 8) by = 8;

    // Dark glass box with orange highlight
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = 'rgba(16, 16, 20, 0.95)';
    drawRoundedRect(ctx, bx, by, tw, th, 5);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 107, 43, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw text inside
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const textX = bx + padX;
    const textY = by + th / 2;

    ctx.fillStyle = count > 0 ? '#ff9c54' : '#aaaaaa';
    ctx.fillText(countStr, textX, textY);
    const countPartW = ctx.measureText(countStr).width;

    ctx.fillStyle = '#ffffff';
    ctx.fillText(` on ${dateStr}`, textX + countPartW, textY);

    ctx.restore();
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // Interactive 3D Hover Hit-Testing
  function findHoveredBuilding(px, py) {
    for (let i = renderedBuildings.length - 1; i >= 0; i--) {
      const b = renderedBuildings[i];
      const dx = Math.abs(px - b.x);
      if (dx <= b.halfW + 0.5) {
        const roofY = b.y - b.curH;
        const topY = roofY - b.halfH + (dx / b.halfW) * b.halfH;
        const bottomY = b.y + b.halfH - (dx / b.halfW) * b.halfH;
        if (py >= topY - 1 && py <= bottomY + 1) {
          return b;
        }
      }
    }
    return null;
  }

  if (stage) {
    stage.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const prev = hoveredBuilding;
      hoveredBuilding = findHoveredBuilding(mouseX, mouseY);

      if (hoveredBuilding !== prev) {
        canvas.style.cursor = hoveredBuilding ? 'pointer' : 'default';
        if (!isAnimating) {
          render(1.0);
        }
      }
    });

    stage.addEventListener('mouseleave', () => {
      if (hoveredBuilding !== null) {
        hoveredBuilding = null;
        canvas.style.cursor = 'default';
        if (!isAnimating) {
          render(1.0);
        }
      }
    });
  }

  // Buttons & Controls
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      hoveredBuilding = null;
      startAnimation();
    });
  }

  // Trigger animation when scrolled into view or immediately if visible
  const card = document.getElementById('github-calendar-box') || document.querySelector('.github-calendar-glass-box');
  const section = document.getElementById('repositories');
  const targetToObserve = card || section;

  function checkVisibilityAndPlay() {
    if (hasAutoPlayed) return;
    if (targetToObserve) {
      const rect = targetToObserve.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        hasAutoPlayed = true;
        resizeCanvas();
        startAnimation();
      }
    }
  }

  if (targetToObserve && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAutoPlayed) {
          hasAutoPlayed = true;
          resizeCanvas();
          startAnimation();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(targetToObserve);
  }

  setTimeout(checkVisibilityAndPlay, 100);
  setTimeout(checkVisibilityAndPlay, 500);
  window.addEventListener('scroll', checkVisibilityAndPlay, { passive: true });
}


/**
 * ============================================================================
 * LAKESIDE ARTWORK INTERACTIVE WEBGL WATER RIPPLE ENGINE
 * Refer: animations/water.mp4 & assets/Lakeside.png
 * 2D wave equation simulation with ping-pong FBOs, real-time normal-mapped
 * refraction displacement, Blinn-Phong specular caustic highlights,
 * velocity-sensitive cursor ripples, and serene ambient droplets.
 * ============================================================================
 */
function initLakesideWaterRipple() {
  const canvas = document.getElementById('contact-lakeside-canvas');
  const card = document.querySelector('.contact-lakeside-card');
  const heading = document.querySelector('.contact-main-heading');
  const subline = document.querySelector('.contact-card-subline');
  const spans = document.querySelectorAll('.contact-card-subline .subline-line');
  if (!canvas || !card) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const extFloat = gl.getExtension('OES_texture_float');
  const extLinear = gl.getExtension('OES_texture_float_linear');
  if (!extFloat) {
    // If floating point textures are not supported, graceful fallback to static text and image
    return;
  }

  const simRes = 512;
  const textureDelta = [1.0 / simRes, 1.0 / simRes];

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('Water shader error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(vsSrc, fsSrc) {
    const p = gl.createProgram();
    const vs = createShader(gl.VERTEX_SHADER, vsSrc);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.warn('Water program link error:', gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  const quadVs = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_pos + 1.0) * 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // Wave equation simulation update shader
  const updateFs = `
    precision highp float;
    uniform sampler2D u_texture;
    uniform vec2 u_delta;
    varying vec2 v_uv;
    void main() {
      vec4 info = texture2D(u_texture, v_uv);
      vec2 dx = vec2(u_delta.x, 0.0);
      vec2 dy = vec2(0.0, u_delta.y);
      float average = (
        texture2D(u_texture, v_uv - dx).r +
        texture2D(u_texture, v_uv - dy).r +
        texture2D(u_texture, v_uv + dx).r +
        texture2D(u_texture, v_uv + dy).r
      ) * 0.25;
      info.g += (average - info.r) * 2.0;
      info.g *= 0.992; // Viscous liquid wave damping
      info.r += info.g;
      gl_FragColor = info;
    }
  `;

  // Ripple drop perturbation shader
  const dropFs = `
    precision highp float;
    const float PI = 3.141592653589793;
    uniform sampler2D u_texture;
    uniform vec2 u_center;
    uniform float u_radius;
    uniform float u_strength;
    varying vec2 v_uv;
    void main() {
      vec4 info = texture2D(u_texture, v_uv);
      float d = length(v_uv - u_center) / u_radius;
      if (d < 1.0) {
        float drop = 0.5 - cos(d * PI) * 0.5;
        info.r += (1.0 - drop) * u_strength;
      }
      gl_FragColor = info;
    }
  `;

  // Render pass vertex shader with aspect-corrected simulation mapping
  const renderVs = `
    attribute vec2 a_pos;
    uniform vec2 u_container_ratio;
    varying vec2 v_uv;
    varying vec2 v_sim_uv;
    void main() {
      v_uv = (a_pos + 1.0) * 0.5;
      // Map quad to square physical simulation space so ripples remain true circles
      v_sim_uv = vec2(a_pos.x * u_container_ratio.x, a_pos.y * u_container_ratio.y) * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // Render pass fragment shader with refraction and Blinn-Phong specular caustic highlights
  const renderFs = `
    precision highp float;
    uniform sampler2D u_image;
    uniform sampler2D u_ripples;
    uniform vec2 u_delta;
    uniform float u_perturbance;
    varying vec2 v_uv;
    varying vec2 v_sim_uv;

    void main() {
      float height = texture2D(u_ripples, v_sim_uv).r;
      float heightX = texture2D(u_ripples, vec2(v_sim_uv.x + u_delta.x, v_sim_uv.y)).r;
      float heightY = texture2D(u_ripples, vec2(v_sim_uv.x, v_sim_uv.y + u_delta.y)).r;

      vec3 dx = vec3(u_delta.x, heightX - height, 0.0);
      vec3 dy = vec3(0.0, heightY - height, u_delta.y);
      vec3 normal = normalize(cross(dy, dx));
      vec2 offset = -normal.xz;

      // 1:1 image coordinates
      vec2 imgUv = vec2(v_uv.x, 1.0 - v_uv.y);
      vec2 displacedUv = clamp(imgUv + offset * u_perturbance, 0.001, 0.999);

      vec4 color = texture2D(u_image, displacedUv);

      // Water surface specular highlights & caustic reflections
      vec3 lightDir = normalize(vec3(-0.4, 0.7, 0.6));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(0.0, dot(normal, halfDir)), 32.0);

      float shimmer = pow(length(offset) * 3.5, 1.4);
      color.rgb += vec3(0.98, 0.97, 0.93) * (spec * 0.30 + shimmer * 0.04);

      gl_FragColor = color;
    }
  `;

  const updateProg = createProgram(quadVs, updateFs);
  const dropProg = createProgram(quadVs, dropFs);
  const renderProg = createProgram(renderVs, renderFs);
  if (!updateProg || !dropProg || !renderProg) return;

  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]), gl.STATIC_DRAW);

  function setupQuadAttrib(prog) {
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  // Ping-pong render targets
  const textures = [];
  const framebuffers = [];
  let readIdx = 0;
  let writeIdx = 1;

  for (let i = 0; i < 2; i++) {
    const tex = gl.createTexture();
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, extLinear ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, extLinear ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, simRes, simRes, 0, gl.RGBA, gl.FLOAT, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    textures.push(tex);
    framebuffers.push(fb);
  }

  // Texture and offscreen 2D composite buffer (renders Lakeside image + typography together)
  const imageTex = gl.createTexture();
  const img = new Image();
  let imgLoaded = false;

  const offscreen = document.createElement('canvas');
  const offCtx = offscreen.getContext('2d');

  function updateTextureComposite() {
    if (!imgLoaded) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;

    const containerAspect = canvas.width / canvas.height;
    const imageAspect = (img.naturalWidth || 1672) / (img.naturalHeight || 941);

    let drawW, drawH, drawX, drawY;
    if (containerAspect > imageAspect) {
      drawW = canvas.width;
      drawH = canvas.width / imageAspect;
      drawX = 0;
      drawY = (canvas.height - drawH) * 0.5;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imageAspect;
      drawX = 0;
      drawY = 0;
    }
    offCtx.drawImage(img, drawX, drawY, drawW, drawH);

    const cardRect = card.getBoundingClientRect();

    function drawWrapped(text, targetX, targetY, maxW, lineH) {
      const words = text.split(/\s+/);
      const lines = [];
      let cur = '';
      for (let i = 0; i < words.length; i++) {
        const test = cur ? `${cur} ${words[i]}` : words[i];
        if (offCtx.measureText(test).width > maxW && cur) {
          lines.push(cur);
          cur = words[i];
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);

      if (lines.length <= 1) {
        offCtx.fillText(lines[0] || text, targetX, targetY);
        return;
      }

      const totalH = (lines.length - 1) * lineH;
      const startY = targetY - totalH * 0.5;
      lines.forEach((l, idx) => {
        offCtx.fillText(l, targetX, startY + idx * lineH);
      });
    }

    // 1. Draw Heading "Have an idea worth building?" onto the fluid texture
    if (heading) {
      const hRect = heading.getBoundingClientRect();
      const hStyle = window.getComputedStyle(heading);
      offCtx.save();
      const hFontSize = parseFloat(hStyle.fontSize) * dpr;
      offCtx.font = `${hStyle.fontWeight} ${hFontSize}px ${hStyle.fontFamily}`;
      offCtx.fillStyle = hStyle.color;
      const align = hStyle.textAlign || 'left';
      offCtx.textAlign = align;
      offCtx.textBaseline = 'middle';
      if ('letterSpacing' in offCtx) offCtx.letterSpacing = hStyle.letterSpacing;
      let hX = (hRect.left - cardRect.left) * dpr;
      if (align === 'center') {
        hX += hRect.width * 0.5 * dpr;
      } else if (align === 'right') {
        hX += hRect.width * dpr;
      }
      const hY = (hRect.top - cardRect.top + hRect.height * 0.5) * dpr;
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const maxW = (cardRect.width - 32) * dpr;
        const lineH = hFontSize * 1.25;
        drawWrapped(heading.textContent.trim(), hX, hY, maxW, lineH);
      } else {
        offCtx.fillText(heading.textContent.trim(), hX, hY);
      }
      offCtx.restore();
    }

    // 2. Draw Subtitle lines onto the fluid texture
    if (subline && spans.length > 0) {
      const sStyle = window.getComputedStyle(subline);
      offCtx.save();
      const sFontSize = parseFloat(sStyle.fontSize) * dpr;
      offCtx.font = `${sStyle.fontWeight} ${sFontSize}px ${sStyle.fontFamily}`;
      offCtx.fillStyle = sStyle.color;
      const sAlign = sStyle.textAlign || 'left';
      offCtx.textAlign = sAlign;
      offCtx.textBaseline = 'middle';
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // On mobile, draw clean wrapped subtitle block centered inside card
        const sRect = subline.getBoundingClientRect();
        const sX = (sRect.left - cardRect.left + sRect.width * 0.5) * dpr;
        const sY = (sRect.top - cardRect.top + sRect.height * 0.5) * dpr;
        const maxW = Math.min(cardRect.width - 36, 290) * dpr;
        const lineH = sFontSize * 1.35;
        drawWrapped(subline.textContent.trim().replace(/\s+/g, ' '), sX, sY, maxW, lineH);
      } else {
        // Desktop / Laptop: preserve exact span placement
        Array.from(spans).forEach(span => {
          const sRect = span.getBoundingClientRect();
          let sX = (sRect.left - cardRect.left) * dpr;
          if (sAlign === 'right') {
            sX += sRect.width * dpr;
          } else if (sAlign === 'center') {
            sX += sRect.width * 0.5 * dpr;
          }
          const sY = (sRect.top - cardRect.top + sRect.height * 0.5) * dpr;
          offCtx.fillText(span.textContent.trim(), sX, sY);
        });
      }
      offCtx.restore();
    }

    // 3. Upload composite to WebGL texture
    gl.bindTexture(gl.TEXTURE_2D, imageTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreen);

    // 4. Mark canvas as ready (fading DOM text so the rippling canvas text is displayed)
    canvas.classList.add('is-ready');
  }

  img.onload = () => {
    imgLoaded = true;
    updateTextureComposite();
  };

  img.src = window.LAKESIDE_IMAGE_DATA || 'assets/Lakeside.png';

  // Ensure fonts are fully rendered before drawing
  if (document.fonts) {
    document.fonts.ready.then(() => {
      if (imgLoaded) updateTextureComposite();
    });
  }

  let containerRatio = [1, 1];

  function resize() {
    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(rect.width * dpr);
    const h = Math.floor(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const maxSide = Math.max(canvas.width, canvas.height);
    containerRatio = [canvas.width / maxSide, canvas.height / maxSide];
    updateTextureComposite();
  }

  window.addEventListener('resize', resize);
  resize();

  function dropAtCanvasPixel(px, py, radius, strength) {
    const maxSide = Math.max(canvas.width, canvas.height);
    const simX = (px - canvas.width * 0.5) / maxSide + 0.5;
    const simY = ((canvas.height - py) - canvas.height * 0.5) / maxSide + 0.5;
    const normRadius = radius / maxSide;

    gl.viewport(0, 0, simRes, simRes);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[writeIdx]);
    gl.useProgram(dropProg);
    setupQuadAttrib(dropProg);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[readIdx]);
    gl.uniform1i(gl.getUniformLocation(dropProg, 'u_texture'), 0);
    gl.uniform2f(gl.getUniformLocation(dropProg, 'u_center'), simX, simY);
    gl.uniform1f(gl.getUniformLocation(dropProg, 'u_radius'), normRadius);
    gl.uniform1f(gl.getUniformLocation(dropProg, 'u_strength'), strength);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    readIdx = 1 - readIdx;
    writeIdx = 1 - writeIdx;
  }

  window.triggerLakesideRipple = dropAtCanvasPixel;

  function update() {
    gl.viewport(0, 0, simRes, simRes);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[writeIdx]);
    gl.useProgram(updateProg);
    setupQuadAttrib(updateProg);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[readIdx]);
    gl.uniform1i(gl.getUniformLocation(updateProg, 'u_texture'), 0);
    gl.uniform2f(gl.getUniformLocation(updateProg, 'u_delta'), textureDelta[0], textureDelta[1]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    readIdx = 1 - readIdx;
    writeIdx = 1 - writeIdx;
  }

  function render() {
    if (!imgLoaded) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(renderProg);
    setupQuadAttrib(renderProg);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, imageTex);
    gl.uniform1i(gl.getUniformLocation(renderProg, 'u_image'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[readIdx]);
    gl.uniform1i(gl.getUniformLocation(renderProg, 'u_ripples'), 1);

    gl.uniform2f(gl.getUniformLocation(renderProg, 'u_container_ratio'), containerRatio[0], containerRatio[1]);
    gl.uniform2f(gl.getUniformLocation(renderProg, 'u_delta'), textureDelta[0], textureDelta[1]);
    gl.uniform1f(gl.getUniformLocation(renderProg, 'u_perturbance'), 0.035);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // Pointer interactions
  let lastPx = -1, lastPy = -1;
  let lastMoveTime = Date.now();

  function onPointerMove(clientX, clientY) {
    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = (clientX - rect.left) * dpr;
    const py = (clientY - rect.top) * dpr;
    lastMoveTime = Date.now();

    if (lastPx >= 0) {
      const dx = px - lastPx;
      const dy = py - lastPy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 4 * dpr) {
        const speed = Math.min(dist / (24 * dpr), 1.0);
        dropAtCanvasPixel(px, py, (20 + speed * 18) * dpr, 0.02 + speed * 0.03);
        lastPx = px;
        lastPy = py;
      }
    } else {
      lastPx = px;
      lastPy = py;
      dropAtCanvasPixel(px, py, 24 * dpr, 0.03);
    }
  }

  card.addEventListener('mousemove', (e) => {
    onPointerMove(e.clientX, e.clientY);
  });

  card.addEventListener('mouseleave', () => {
    lastPx = -1;
    lastPy = -1;
  });

  card.addEventListener('mouseenter', (e) => {
    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = (e.clientX - rect.left) * dpr;
    const py = (e.clientY - rect.top) * dpr;
    dropAtCanvasPixel(px, py, 26 * dpr, 0.035);
  });

  card.addEventListener('mousedown', (e) => {
    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = (e.clientX - rect.left) * dpr;
    const py = (e.clientY - rect.top) * dpr;
    dropAtCanvasPixel(px, py, 48 * dpr, 0.075);
  });

  card.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  card.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const rect = card.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = (e.touches[0].clientX - rect.left) * dpr;
      const py = (e.touches[0].clientY - rect.top) * dpr;
      dropAtCanvasPixel(px, py, 32 * dpr, 0.05);
    }
  }, { passive: true });

  // Serene idle ambient droplet
  setInterval(() => {
    if (!isVisible) return;
    if (Date.now() - lastMoveTime > 3200) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Gentle drop in water/lake area
      const lakeX = (0.2 + Math.random() * 0.55) * canvas.width;
      const lakeY = (0.55 + Math.random() * 0.35) * canvas.height;
      dropAtCanvasPixel(lakeX, lakeY, 20 * dpr, 0.016);
    }
  }, 3600);

  // IntersectionObserver for hardware efficiency
  let isVisible = false;
  let rafId = null;

  function loop() {
    if (!isVisible) {
      rafId = null;
      return;
    }
    update();
    render();
    rafId = requestAnimationFrame(loop);
  }

  const targetSection = document.getElementById('contact') || card;
  if ('IntersectionObserver' in window && targetSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          resize();
          loop();
        }
      });
    }, { rootMargin: '100px 0px 100px 0px' });
    observer.observe(targetSection);
  } else {
    isVisible = true;
    loop();
  }

  // Safety fallback update after full paint
  setTimeout(updateTextureComposite, 300);
  setTimeout(updateTextureComposite, 800);
}
