/* ═══════════════════════════════════════════════════
   SIAXEN — Main JS
   Navigation, Scroll Reveals, Animations
   ═══════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── Mobile Nav Toggle ──
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  var header = document.querySelector('.site-header');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function() {
      var isOpen = mobileNav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (header) header.classList.toggle('nav-open', isOpen);
    });

    var mobileLinks = mobileNav.querySelectorAll('a');
    for (var i = 0; i < mobileLinks.length; i++) {
      mobileLinks[i].addEventListener('click', function() {
        mobileNav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (header) header.classList.remove('nav-open');
      });
    }
  }

  // ── Scroll Reveal (Enhanced) ──
  var reveals = document.querySelectorAll('.reveal');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  if (reveals.length && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function(el) { el.classList.add('is-visible'); });
  }

  // ── Timeline Animation (line draws + nodes appear) ──
  var timelines = document.querySelectorAll('.timeline');
  if (timelines.length && !reducedMotion) {
    var timelineObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Stagger timeline items
          var items = entry.target.querySelectorAll('.timeline__item');
          items.forEach(function(item, idx) {
            setTimeout(function() {
              item.classList.add('is-visible');
            }, 300 + idx * 200);
          });
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    timelines.forEach(function(el) { timelineObserver.observe(el); });
  } else {
    timelines.forEach(function(el) {
      el.classList.add('is-visible');
      el.querySelectorAll('.timeline__item').forEach(function(item) { item.classList.add('is-visible'); });
    });
  }

  // ── Counter Animation ──
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length && !reducedMotion) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { counterObserver.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 1500;
    var start = performance.now();

    function formatNum(n) {
      return n.toLocaleString('en-US');
    }

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var current = Math.round(eased * target);
      el.textContent = prefix + formatNum(current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── Manifesto Border Draw Animation ──
  var manifItems = document.querySelectorAll('.manifesto__item');
  if (manifItems.length && !reducedMotion) {
    var manifObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.borderLeftColor = 'rgba(58,124,165,.35)';
          manifObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    manifItems.forEach(function(el) {
      el.style.borderLeftColor = 'transparent';
      el.style.transition = 'border-left-color .6s cubic-bezier(.16,1,.3,1)';
      manifObserver.observe(el);
    });
  }

  // ── Header scroll state ──
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.borderBottomColor = 'rgba(58,124,165,.12)';
      } else {
        header.style.borderBottomColor = '';
      }
    }, { passive: true });
  }

  // ══════════════════════════════════════════════════
  // HERO GRID ANIMATION (Shared)
  // Call initHeroGrid() after DOMContentLoaded on inner pages
  // ══════════════════════════════════════════════════
  window.initHeroGrid = function() {
    var c = document.getElementById('heroGridAnim');
    if (!c) return;
    var ctx = c.getContext('2d');
    var sp = 80;
    var traces = [];
    var headerH = 72;
    var gridStartY = headerH + sp;

    function allH() {
      var a = [];
      for (var y = gridStartY; y < c.height; y += sp) a.push(y);
      return a;
    }
    function allV() {
      var a = [];
      for (var x = sp; x < c.width; x += sp) a.push(x);
      return a;
    }
    function shuffle(a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }

    function init() {
      traces = [];
      var hLines = shuffle(allH());
      var pickedH = [];
      for (var i = 0; i < hLines.length && pickedH.length < 3; i++) {
        var ok = true;
        for (var j = 0; j < pickedH.length; j++) {
          if (Math.abs(hLines[i] - pickedH[j]) < sp * 3) { ok = false; break; }
        }
        if (ok) pickedH.push(hLines[i]);
      }
      var vLines = shuffle(allV());
      var pickedV = [];
      for (var i = 0; i < vLines.length && pickedV.length < 2; i++) {
        var ok = true;
        for (var j = 0; j < pickedV.length; j++) {
          if (Math.abs(vLines[i] - pickedV[j]) < sp * 3) { ok = false; break; }
        }
        if (ok) pickedV.push(vLines[i]);
      }
      for (var i = 0; i < pickedH.length; i++) {
        var goR = Math.random() > 0.5;
        traces.push({ type: 'h', line: pickedH[i], pos: Math.random() * c.width, dir: goR ? 1 : -1, speed: 0.3 + Math.random() * 0.9, len: 120 + Math.random() * 200, op: 0.19 + Math.random() * 0.09 });
      }
      for (var i = 0; i < pickedV.length; i++) {
        traces.push({ type: 'v', line: pickedV[i], pos: Math.random() * c.height, dir: -1, speed: 0.2 + Math.random() * 0.7, len: 120 + Math.random() * 200, op: 0.19 + Math.random() * 0.09 });
      }
    }

    function newTrace(type) {
      var W = c.width, H = c.height;
      var pool = type === 'h' ? allH() : allV();
      shuffle(pool);
      var picked = -1;
      var gaps = [sp * 3, sp * 2, sp];
      for (var g = 0; g < gaps.length && picked === -1; g++) {
        for (var i = 0; i < pool.length; i++) {
          var ok = true;
          for (var j = 0; j < traces.length; j++) {
            if (traces[j] && traces[j].type === type && Math.abs(traces[j].line - pool[i]) < gaps[g]) { ok = false; break; }
          }
          if (ok) { picked = pool[i]; break; }
        }
      }
      if (picked === -1) picked = pool[0];
      if (type === 'h') {
        var goR = Math.random() > 0.5;
        return { type: 'h', line: picked, pos: goR ? -(100 + Math.random() * 300) : W + 100 + Math.random() * 300, dir: goR ? 1 : -1, speed: 0.3 + Math.random() * 0.9, len: 120 + Math.random() * 200, op: 0.19 + Math.random() * 0.09 };
      } else {
        return { type: 'v', line: picked, pos: H + 100 + Math.random() * 300, dir: -1, speed: 0.2 + Math.random() * 0.7, len: 120 + Math.random() * 200, op: 0.19 + Math.random() * 0.09 };
      }
    }

    function doResize() {
      c.width = c.parentElement.offsetWidth;
      c.height = c.parentElement.offsetHeight;
      var h = document.querySelector('.site-header');
      if (h) headerH = h.offsetHeight;
      gridStartY = headerH + sp;
      traces = [];
      init();
    }

    if (document.readyState === 'complete') { doResize(); }
    else { window.addEventListener('load', doResize); }
    window.addEventListener('resize', doResize);

    function animate() {
      ctx.clearRect(0, 0, c.width, c.height);
      var W = c.width, H = c.height;
      var isMob = W <= 768;

      // Visual fade zone (where hero animation is — right side)
      var vizCx = W * 0.75;
      var vizCy = H * 0.5;
      var fadeR = W * 0.28;

      ctx.lineWidth = isMob ? 1.2 : 1;
      ctx.strokeStyle = isMob ? 'rgba(58,124,165,0.0675)' : 'rgba(58,124,165,0.049)';
      for (var y = gridStartY; y <= H; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      for (var x = 0; x <= W; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

      for (var i = 0; i < traces.length; i++) {
        var t = traces[i];
        if (!t) continue;
        t.pos += t.speed * t.dir;
        var head = t.pos, tail = head - t.len * t.dir;

        // Calculate fade based on distance from visual center
        var traceX = t.type === 'h' ? head : t.line;
        var traceY = t.type === 'h' ? t.line : head;
        var dx = traceX - vizCx;
        var dy = traceY - vizCy;
        var distFromViz = Math.sqrt(dx * dx + dy * dy);
        var fadeFactor = Math.min(1, distFromViz / fadeR);
        fadeFactor = fadeFactor * fadeFactor; // ease — smoother fade

        if (t.type === 'h') {
          var fadeOp = t.op * fadeFactor;
          if (fadeOp > 0.005) {
            var g = ctx.createLinearGradient(tail, t.line, head, t.line);
            g.addColorStop(0, 'rgba(58,124,165,0)');
            g.addColorStop(0.5, 'rgba(58,124,165,' + fadeOp * 0.4 + ')');
            g.addColorStop(1, 'rgba(58,124,165,' + fadeOp + ')');
            ctx.beginPath(); ctx.moveTo(tail, t.line); ctx.lineTo(head, t.line);
            ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.stroke();
          }
          if ((t.dir > 0 && tail > W) || (t.dir < 0 && head < 0)) traces[i] = newTrace('h');
        } else {
          var fadeOp = t.op * fadeFactor;
          if (fadeOp > 0.005) {
            var g = ctx.createLinearGradient(t.line, tail, t.line, head);
            g.addColorStop(0, 'rgba(58,124,165,0)');
            g.addColorStop(0.5, 'rgba(58,124,165,' + fadeOp * 0.4 + ')');
            g.addColorStop(1, 'rgba(58,124,165,' + fadeOp + ')');
            ctx.beginPath(); ctx.moveTo(t.line, tail); ctx.lineTo(t.line, head);
            ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.stroke();
          }
          if (head < 0 && tail < 0) traces[i] = newTrace('v');
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  };

})();
