// ─────────────────────────────────────────────────────────────
// Satisfying Micro-interactions
// ─────────────────────────────────────────────────────────────

(function() {
  'use strict';

  // Wait for DOM to be ready
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {

    // ───── 1. CUSTOM CURSOR FOLLOWER ─────────────────────────
    // Two-layer cursor: small dot + lagging ring
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth lag for the ring
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });

    // Grow cursor when hovering interactive elements
    function bindCursorScale() {
      const interactive = document.querySelectorAll('a, button, .btn, .service, .value, .run-step, input, select, textarea, [role="button"], .nav-brand');
      interactive.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
          cursorRing.classList.add('cursor-ring--active');
          cursorDot.classList.add('cursor-dot--active');
        });
        el.addEventListener('mouseleave', function() {
          cursorRing.classList.remove('cursor-ring--active');
          cursorDot.classList.remove('cursor-dot--active');
        });
      });
    }

    // ───── 2. MAGNETIC BUTTONS ───────────────────────────────
    function bindMagneticButtons() {
      const magneticEls = document.querySelectorAll('.btn');
      magneticEls.forEach(function(el) {
        el.addEventListener('mousemove', function(e) {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-2px)`;
        });
        el.addEventListener('mouseleave', function() {
          el.style.transform = '';
        });
      });
    }

    // ───── 3. 3D CARD TILT ───────────────────────────────────
    function bindCardTilt() {
      const tiltCards = document.querySelectorAll('.service, .value');
      tiltCards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -4;
          const rotateY = ((x - centerX) / centerX) * 4;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', function() {
          card.style.transform = '';
        });
      });
    }

    // ───── 4. RIPPLE EFFECT ON CLICK ─────────────────────────
    function bindRipple() {
      document.querySelectorAll('.btn, .nav-links a').forEach(function(el) {
        el.addEventListener('click', function(e) {
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          const rect = el.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
          ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
          el.appendChild(ripple);
          setTimeout(function() { ripple.remove(); }, 600);
        });
      });
    }

    // ───── 5. SMOOTH SCROLL ───────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = link.getAttribute('href');
        if (href.length > 1 && document.querySelector(href)) {
          e.preventDefault();
          document.querySelector(href).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // ───── 6. BIND ALL (with retry for React) ────────────────
    // Since React renders async, retry binding for newly added elements
    function bindAll() {
      bindCursorScale();
      bindMagneticButtons();
      bindCardTilt();
      bindRipple();
    }

    // Initial bind
    bindAll();

    // Re-bind every 1.5s for 5 seconds to catch React renders
    let attempts = 0;
    const interval = setInterval(function() {
      bindAll();
      attempts++;
      if (attempts >= 4) clearInterval(interval);
    }, 1500);

    // ───── 7. DISABLE CUSTOM CURSOR ON TOUCH DEVICES ─────────
    if ('ontouchstart' in window) {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
      document.body.style.cursor = '';
    }

  });

})();
