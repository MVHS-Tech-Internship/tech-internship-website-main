/* ==========================================================================
   MVHS Tech Internship - site behaviour
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- header */
  var header   = document.getElementById('siteHeader');
  var toggle   = document.getElementById('navToggle');
  var mobile   = document.getElementById('mobileNav');
  var body     = document.body;

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') body.classList.remove('menu-open');
    });
  }

  var lastY = 0;
  function headerChrome(y) {
    if (!header) return;
    header.classList.toggle('is-hidden', y > lastY + 6 && y > 420 && !body.classList.contains('menu-open'));
    if (Math.abs(y - lastY) > 4) lastY = y;
  }

  /* -------------------------------------------------- reveal on scroll ----
     IntersectionObserver is the primary path, but it is not the only one: if
     a notification is ever delayed or dropped, a section would stay at
     opacity 0 forever, which on this page means whole blocks of the site
     silently vanish. A cheap geometry sweep on scroll guarantees anything
     actually on screen gets revealed.                                      */
  var pending = [].slice.call(document.querySelectorAll('.rv, .rv-stagger'));

  function show(el) { el.classList.add('in'); }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      show(en.target);
      io.unobserve(en.target);
      var i = pending.indexOf(en.target);
      if (i > -1) pending.splice(i, 1);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  pending.forEach(function (el) { io.observe(el); });

  function sweepReveals() {
    if (!pending.length) return;
    var h = innerHeight;
    for (var i = pending.length - 1; i >= 0; i--) {
      var r = pending[i].getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0) {
        show(pending[i]);
        io.unobserve(pending[i]);
        pending.splice(i, 1);
      }
    }
  }
  addEventListener('scroll', sweepReveals, { passive: true });
  addEventListener('resize', sweepReveals);
  sweepReveals();

  /* --------------------------------------------- cursor glow on cards ----- */
  document.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ------------------------------------------- odometer digits on stats -- */
  document.querySelectorAll('[data-odo]').forEach(function (el) {
    var target = String(parseInt(el.dataset.odo, 10) || 0);
    var suffix = el.dataset.suffix || '';

    // build a column of 0-9 per digit; the column slides to its final digit
    var wrap = document.createElement('span');
    wrap.className = 'odo';
    var cols = target.split('').map(function (d) {
      var cell = document.createElement('span');
      cell.className = 'odo-d';
      var col = document.createElement('span');
      col.className = 'odo-col';
      for (var i = 0; i <= 9; i++) {
        var n = document.createElement('i');
        n.textContent = String(i);
        col.appendChild(n);
      }
      cell.appendChild(col);
      wrap.appendChild(cell);
      return { col: col, digit: parseInt(d, 10) };
    });
    if (suffix) {
      var sfx = document.createElement('span');
      sfx.className = 'odo-suffix';
      sfx.textContent = suffix;
      wrap.appendChild(sfx);
    }
    el.textContent = '';
    el.appendChild(wrap);

    // start every column at 0 so the roll always travels upward
    cols.forEach(function (c) { c.col.style.transform = 'translateY(0)'; });

    var started = false;
    var run = function () {
      if (started) return;
      started = true;
      seen.disconnect();
      removeEventListener('scroll', maybe);
      cols.forEach(function (c, i) {
        var settle = function () {
          c.col.style.transform = 'translateY(' + (-c.digit) + 'em)';
        };
        if (reduceMotion) { c.col.style.transition = 'none'; settle(); return; }
        // left-to-right stagger, so the number reads as it lands
        c.col.style.transitionDelay = (i * 90) + 'ms';
        requestAnimationFrame(settle);
      });
    };
    var seen = new IntersectionObserver(function (ents) {
      if (ents[0].isIntersecting) run();
    }, { threshold: 0.5 });
    seen.observe(el);
    var maybe = function () {
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.85 && r.bottom > 0) run();
    };
    addEventListener('scroll', maybe, { passive: true });
    maybe();
  });

  /* ======================================================================
     THE ROAD
     World units are source-image pixels. `k` scales world → CSS px.
     ====================================================================== */
  var scroller = document.getElementById('roadScroller');

  if (!scroller) {
    // interior pages: flip the header to light once past the navy page hero
    var ph = document.querySelector('.page-hero');
    var trip = ph ? ph.offsetHeight - 90 : 60;
    var tick = function () {
      var y = scrollY;
      body.classList.toggle('nav-light', y > trip);
      headerChrome(y);
    };
    addEventListener('scroll', tick, { passive: true });
    tick();
    requestAnimationFrame(function(){ body.classList.add('hero-ready'); });
    return;
  }

  /* ---- geometry of the source artwork (see build notes) ---- */
  var IMG_W = 4096, IMG_H = 6676;   // road-main.jpg covers this world rect
  var BAND_TOP = 5140;              // top of the yellow curb line
  var BAND_H = 1536;                // horizontal road band height
  var TILE_W = 2000;                // world px per repeat of road-tile.jpg
  var EXT = 90000;                  // world px of tiled road each side

  /* ---- tuning ---- */
  var STOP_GAP   = 0.60;  // milestone spacing, in viewport widths
  var SCROLL_RATE= 2.80;  // world travel per unit of scroll (higher = snappier)
  var DWELL      = 0.075; // share of the travel leg spent paused at each stop
  var CARD_MID   = 134;   // px from a pin to its card's centre (-42 + 352/2)
  var HOLD_END   = 0.10, DESCEND_END = 0.32, CURVE_MID = 0.46,
      CURVE_END  = 0.57, OPEN_END = 0.68, TRAVEL_START = 0.76;

  var fallback= document.getElementById('roadFallback');
  var world   = document.getElementById('roadWorld');
  var main    = world.querySelector('.road-main');
  var extR    = world.querySelector('.road-ext.right');
  var extL    = world.querySelector('.road-ext.left');
  var lanes   = world.querySelector('.road-lanes');
  var hud     = document.querySelector('.roadmap-hud');
  var note    = document.querySelector('.curve-note');
  var prog    = document.querySelector('.road-progress');
  var progFill= prog ? prog.querySelector('.fill') : null;
  var progNum = prog ? prog.querySelector('.num') : null;
  var stops   = [].slice.call(document.querySelectorAll('.milestone'));
  var heroCopy= document.querySelector('.hero-copy');
  var hint    = document.querySelector('.scroll-hint');

  var vw, vh, kHero, kRoad, heroCY, roadCY, pinY, startX, endX, kf;

  function layout() {
    vw = innerWidth; vh = innerHeight;

    /* Small screens and reduced-motion users get the static timeline. Only one
       of the two branches is ever exposed - the other carries `hidden`, so the
       page never presents two <h1>s to a screen reader or a crawler. */
    var isStatic = vw < 860 || reduceMotion;
    body.classList.toggle('road-static', isStatic);
    if (fallback) fallback.hidden = !isStatic;
    scroller.hidden = isStatic;
    if (isStatic) return;

    kHero  = Math.max(vw / IMG_W, vh / 2300);      // opening frame covers the viewport
    kRoad  = (0.42 * vh) / BAND_H;                 // road band = 42% of viewport height
    heroCY = vh / (2 * kHero);                     // top-aligned: no gap above the sky
    roadCY = BAND_TOP - (0.10 * vh) / kRoad;       // curb line at 60%; band runs off the bottom
    pinY   = BAND_TOP + (0.14 * vh) / kRoad;       // cars sit in the near lane

    // milestone spacing & camera range for the horizontal leg
    // The roadmap needs a genuinely white canvas, so the travel leg starts
    // only once the camera has cleared the right edge of the photograph -
    // otherwise the curve's asphalt sits behind the heading and the cards.
    var gap = (STOP_GAP * vw) / kRoad;
    startX  = IMG_W + vw / (2 * kRoad) + 0.12 * vw / kRoad;
    stops.forEach(function (el, i) {
      el.dataset.wx = startX + 0.46 * vw / kRoad + i * gap;
    });
    endX = startX + 0.46 * vw / kRoad + (stops.length - 1) * gap + 0.40 * vw / kRoad;

    buildStations();

    // Camera keyframes. `x:'left'` means "hug the artwork's left edge" and is
    // resolved against that keyframe's own scale, so the framing holds at any
    // viewport instead of drifting off the image.
    kf = [
      { t: 0,            x: IMG_W / 2, y: heroCY, k: kHero },
      { t: HOLD_END,     x: IMG_W / 2, y: heroCY, k: kHero },
      { t: DESCEND_END,  x: IMG_W / 2, y: 2900,   k: kHero },
      { t: CURVE_MID,    x: 'left',    y: 3900,   k: kHero * 1.15 },
      { t: CURVE_END,    x: 'left',    y: 4700,   k: kHero * 1.30 },
      { t: OPEN_END,     x: 'left',    y: BAND_TOP + 420, k: kRoad * 1.30 },
      { t: TRAVEL_START, x: startX,    y: roadCY, k: kRoad },
      { t: 1,            x: endX,      y: roadCY, k: kRoad }
    ];
    kf.forEach(function (f) { if (f.x === 'left') f.x = vw / (2 * f.k); });

    // Scroller length derives from how far the camera actually travels. The
    // dwells consume scroll without moving the camera, so the travel leg is
    // lengthened by exactly that budget - otherwise adding pauses would
    // silently speed up the driving between them.
    var travelCss = (endX - startX) * kRoad;
    var total = Math.round(
      (travelCss / SCROLL_RATE) / (1 - TRAVEL_START) / travelBudget);
    scroller.style.height = (vh + total) + 'px';

    lastK = -1;   // force a re-place at the new viewport
    curK = kHero;
    place();
  }

  var lastK = -1;
  function place() {
    // size the world layers for the current scale (only when k changes)
    var k = curK;
    if (Math.abs(k - lastK) < 0.0004) return;
    lastK = k;

    main.style.width  = IMG_W * k + 'px';
    main.style.height = IMG_H * k + 'px';

    [[extR, IMG_W], [extL, -EXT]].forEach(function (pair) {
      var el = pair[0];
      if (!el) return;
      el.style.left   = pair[1] * k + 'px';
      el.style.top    = BAND_TOP * k + 'px';
      el.style.width  = EXT * k + 'px';
      el.style.height = BAND_H * k + 'px';
      el.style.backgroundSize = (TILE_W * k) + 'px ' + (BAND_H * k) + 'px';
    });

    if (lanes) {
      var LANE_FROM = 1500;                       // starts after the curve exits
      lanes.style.left   = LANE_FROM * k + 'px';
      lanes.style.top    = (BAND_TOP + BAND_H * 0.50) * k + 'px';
      lanes.style.width  = (EXT - LANE_FROM) * k + 'px';
      lanes.style.height = Math.max(2, 26 * k) + 'px';
      lanes.style.setProperty('--dash',  (300 * k) + 'px');
      lanes.style.setProperty('--pitch', (700 * k) + 'px');
    }

    stops.forEach(function (el) {
      el.style.left = parseFloat(el.dataset.wx) * k + 'px';
      el.style.top  = pinY * k + 'px';
      el.style.setProperty('--stem', (0.17 * vh) + 'px');
    });
  }

  /* ------------------------------------------------------------------ dwell
     The camera pauses at each milestone. Rather than hijacking the scroll,
     progress through the travel leg is remapped: stretches where the output
     is flat read as a pause, and each moving stretch is smoothstepped so the
     camera eases to a halt and then pulls away. Native scrolling, momentum
     and scrollbar position are all left alone.                            */
  var stationKeys = null, travelBudget = 1;

  function buildStations() {
    var span = endX - startX;
    if (!stops.length || span <= 0) { stationKeys = null; travelBudget = 1; return; }

    // camera-x that centres each card, as a 0..1 position along the travel leg
    var outs = stops.map(function (el) {
      var target = parseFloat(el.dataset.wx) + CARD_MID / kRoad;
      return Math.max(0, Math.min(1, (target - startX) / span));
    }).sort(function (a, b) { return a - b; });

    var n = outs.length;
    var dwell = Math.min(DWELL, 0.7 / n);         // always leave room to travel
    travelBudget = 1 - n * dwell;

    var keys = [{ i: 0, o: 0 }], inPos = 0, prevOut = 0;
    outs.forEach(function (o) {
      inPos += (o - prevOut) * travelBudget;
      keys.push({ i: inPos, o: o });              // arrive at the stop
      inPos += dwell;
      keys.push({ i: inPos, o: o });              // hold
      prevOut = o;
    });
    inPos += (1 - prevOut) * travelBudget;
    keys.push({ i: inPos, o: 1 });
    keys.forEach(function (k) { k.i /= inPos; }); // normalise input to 0..1
    stationKeys = keys;
  }

  function stationMap(u) {
    var keys = stationKeys;
    if (!keys) return u;
    var i = 0;
    while (i < keys.length - 2 && u > keys[i + 1].i) i++;
    var a = keys[i], b = keys[i + 1];
    if (a.o === b.o) return a.o;                  // <- the pause
    var h = (b.i - a.i) || 1e-6;
    var t = Math.max(0, Math.min(1, (u - a.i) / h));
    return a.o + (b.o - a.o) * (t * t * (3 - 2 * t));
  }

  /* Remap only the travel leg; everything before it is untouched. */
  function withDwell(p) {
    if (p <= TRAVEL_START || !stationKeys) return p;
    var u = (p - TRAVEL_START) / (1 - TRAVEL_START);
    return TRAVEL_START + stationMap(u) * (1 - TRAVEL_START);
  }

  /* Monotone cubic Hermite across the whole keyframe path.
     Easing each segment independently made the camera stop dead at every
     waypoint; this keeps velocity continuous through them. Tangents are
     limited Fritsch-Carlson style so the path can never overshoot -- an
     overshoot here would swing the camera off the edge of the artwork. */
  function channel(key, p) {
    var i = 0;
    while (i < kf.length - 2 && p > kf[i + 1].t) i++;
    var a = kf[i], b = kf[i + 1];
    var h = (b.t - a.t) || 1e-6;
    var s = Math.max(0, Math.min(1, (p - a.t) / h));
    var p0 = a[key], p1 = b[key];
    var d  = (p1 - p0) / h;

    var prev = kf[i - 1] || a, next = kf[i + 2] || b;
    var dPrev = prev === a ? d : (p0 - prev[key]) / ((a.t - prev.t) || 1e-6);
    var dNext = next === b ? d : (next[key] - p1) / ((next.t - b.t) || 1e-6);

    var m0 = (dPrev * d <= 0) ? 0 : (dPrev + d) / 2;
    var m1 = (d * dNext <= 0) ? 0 : (d + dNext) / 2;
    if (d === 0) { m0 = m1 = 0; }
    else {
      var r0 = m0 / d, r1 = m1 / d;                 // limit to keep it monotone
      if (r0 > 3) m0 = 3 * d;
      if (r1 > 3) m1 = 3 * d;
    }

    var s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * m0 * h +
           (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * m1 * h;
  }

  var curK = 1;
  function camera(p) {
    var k = channel('k', p);
    curK = k;
    var x = channel('x', p);
    var y = channel('y', p);

    // never show past the artwork's edges while the photo is the backdrop
    if (p < OPEN_END) {
      x = Math.max(vw / (2 * k), Math.min(IMG_W - vw / (2 * k), x));
    }
    return { x: x, y: y, k: k };
  }

  var raf = 0, lastFrameAt = 0;
  function frame() {
    raf = 0;
    lastFrameAt = (window.performance || Date).now();
    if (body.classList.contains('road-static')) { headerChrome(scrollY); return; }

    var top = scroller.offsetTop;
    var len = scroller.offsetHeight - vh;
    var p   = Math.max(0, Math.min(1, (scrollY - top) / len));

    var c = camera(withDwell(p));
    place();
    // exposed for tuning: read window.__road in the console while scrolling
    window.__road = { p: p, k: c.k, camX: c.x, camY: c.y, top: top, len: len };
    world.style.transform =
      'translate3d(' + (vw / 2 - c.x * c.k) + 'px,' + (vh / 2 - c.y * c.k) + 'px,0)';

    // the navy veil behind the artwork fades out as we leave the sky
    document.querySelector('.road-stage').style.setProperty(
      '--sky-veil', p < DESCEND_END ? 1 : 0);

    // hero copy drifts up and out
    if (heroCopy) {
      var hp = Math.min(1, p / (HOLD_END + 0.09));
      heroCopy.style.opacity   = String(1 - hp);
      heroCopy.style.transform = 'translateY(' + (-hp * 90) + 'px)';
    }
    if (hint) hint.style.opacity = p > 0.02 ? '0' : '';

    // header switches to light once the navy sky is gone
    body.classList.toggle('nav-light', p > 0.30);

    // roadmap chrome
    if (note) note.classList.toggle('on', p > DESCEND_END + 0.04 && p < OPEN_END);
    if (hud)  hud.classList.toggle('on', p > TRAVEL_START - 0.03);
    if (prog) prog.classList.toggle('on', p > TRAVEL_START - 0.03);

    // milestones reveal as they enter frame; the one the camera is parked
    // at is marked active so the stop reads as a deliberate halt
    var shown = 0, best = -1, bestD = Infinity;
    var tx = vw / 2 - c.x * c.k;
    stops.forEach(function (el, i) {
      var sx = parseFloat(el.dataset.wx) * c.k + tx;
      el.classList.toggle('on', sx > -260 && sx < vw - 90);
      var d = Math.abs(sx + CARD_MID - vw / 2);     // card centre vs screen centre
      if (d < bestD) { bestD = d; best = i; }
      if (sx < vw * 0.62) shown = i + 1;
    });
    stops.forEach(function (el, i) {
      el.classList.toggle('active', i === best && bestD < vw * 0.16);
    });
    if (best >= 0 && bestD < vw * 0.16) shown = best + 1;
    if (progFill) progFill.style.width =
      Math.max(0, Math.min(100, (p - TRAVEL_START) / (1 - TRAVEL_START) * 100)) + '%';
    if (progNum)  progNum.textContent =
      String(Math.max(1, Math.min(stops.length, shown))).padStart(2, '0') + ' / ' +
      String(stops.length).padStart(2, '0');

    headerChrome(scrollY);
  }

  /* Coalesce scroll updates into one animation frame. The safety net matters:
     if a queued rAF callback is never delivered - a throttled background tab, a
     frame that isn't being rendered, a machine under load - then `raf` would
     stay non-zero and every later scroll would be silently dropped, freezing
     the road mid-journey. If a frame hasn't landed in 300ms, run it inline. */
  function onScroll() {
    var now = (window.performance || Date).now();
    if (raf && now - lastFrameAt > 300) { cancelAnimationFrame(raf); raf = 0; }
    if (!raf) raf = requestAnimationFrame(frame);
    if (now - lastFrameAt > 300) { cancelAnimationFrame(raf); raf = 0; frame(); }
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { layout(); onScroll(); });

  layout();
  onScroll();

  // kick the intro once the artwork is actually painted
  var img = new Image();
  img.onload = img.onerror = function () {
    requestAnimationFrame(function () { body.classList.add('hero-ready'); });
  };
  img.src = main ? getComputedStyle(main).backgroundImage.slice(5, -2) : '';
  setTimeout(function () { body.classList.add('hero-ready'); }, 1200);
})();
