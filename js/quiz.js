/* ============================================
   HAUL OF FAME - SUBSCRIPTION QUIZ ENGINE
   ============================================ */

(function () {
  'use strict';

  /* ---------- STEP DEFINITIONS ---------- */
  var STEPS = [
    { id: 'qz-welcome', type: 'carousel', key: null, required: false },
    { id: 'qz-motivation', type: 'single-select', key: 'motivation', required: true },
    { id: 'qz-signal', type: 'single-select', key: 'primaryStyle', required: true },
    { id: 'qz-confidence', type: 'interstitial', key: null, required: false },
    { id: 'qz-silhouette', type: 'single-select', key: 'bottomsFit', required: true },
    { id: 'qz-energy', type: 'single-select', key: 'colorPreference', required: true },
    { id: 'qz-expression', type: 'single-select', key: 'designPreference', required: true },
    { id: 'qz-checkpoint', type: 'interstitial', key: null, required: false },
    { id: 'qz-comfort', type: 'single-select', key: 'topSize', required: true },
    { id: 'qz-proportion', type: 'dual-select', key: ['waistSize', 'pantLength'], required: true },
    { id: 'qz-finish', type: 'single-select', key: 'shoeSize', required: true },
    { id: 'qz-blueprint', type: 'dual-slider', key: ['height', 'weight'], required: true },
    { id: 'qz-precision', type: 'interstitial', key: null, required: false },
    { id: 'qz-premium', type: 'multi-select', key: 'brands', required: false, max: 6 },
    { id: 'qz-connect', type: 'text-input', key: 'email', required: true, validation: 'email' },
    { id: 'qz-vip', type: 'text-input', key: 'phone', required: false },
    { id: 'qz-upgrade', type: 'text-input', key: 'birthday', required: false },
    { id: 'qz-results', type: 'results', key: null, required: false },
    { id: 'qz-plans', type: 'results', key: null, required: false }
  ];

  var TOTAL_STEPS = STEPS.length;

  /* ---------- STATE ---------- */
  var state = {
    currentStep: 0,
    answers: {},
    startedAt: null
  };

  /* ---------- DOM REFS ---------- */
  var progressFill = document.getElementById('qz-progress-fill');
  var container = document.getElementById('qz-container');
  var allSections = document.querySelectorAll('.qz-step');
  var backBtn = document.getElementById('qz-back-btn');
  var heroSwiper = null;

  /* ---------- PERSISTENCE ---------- */
  var STORAGE_KEY = 'hof_quiz_state';

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  function loadState() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        state.currentStep = parsed.currentStep || 0;
        state.answers = parsed.answers || {};
        state.startedAt = parsed.startedAt || null;
        return true;
      }
    } catch (e) { /* ignore */ }
    return false;
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  }

  /* ---------- PROGRESS BAR ---------- */
  function updateProgress() {
    var pct = ((state.currentStep) / (TOTAL_STEPS - 1)) * 100;
    progressFill.style.width = Math.min(pct, 100) + '%';
  }

  /* ---------- BACK BUTTON VISIBILITY ---------- */
  function updateBackButton() {
    if (backBtn) {
      backBtn.style.display = state.currentStep > 0 ? 'flex' : 'none';
    }
  }

  /* ---------- STEP NAVIGATION ---------- */
  function showStep(index, direction) {
    if (index < 0 || index >= TOTAL_STEPS) return;

    var currentEl = document.getElementById(STEPS[state.currentStep].id);
    var nextEl = document.getElementById(STEPS[index].id);

    if (currentEl && currentEl !== nextEl) {
      currentEl.classList.remove('qz-active', 'qz-fade-in');
      currentEl.classList.add('qz-fade-out');
      setTimeout(function () {
        currentEl.classList.remove('qz-fade-out');
        currentEl.style.display = 'none';
      }, 300);
    }

    setTimeout(function () {
      // Hide all other steps
      allSections.forEach(function (s) {
        if (s !== nextEl) {
          s.classList.remove('qz-active', 'qz-fade-in');
          s.style.display = 'none';
        }
      });

      nextEl.style.display = 'flex';
      nextEl.classList.add('qz-active', 'qz-fade-in');

      state.currentStep = index;
      updateProgress();
      updateBackButton();
      updateHash();
      saveState();
      window.scrollTo(0, 0);

      // Step-specific init
      onStepEnter(index);
    }, currentEl && currentEl !== nextEl ? 300 : 0);
  }

  function goNext() {
    if (state.currentStep < TOTAL_STEPS - 1) {
      showStep(state.currentStep + 1, 'forward');
    }
  }

  function goBack() {
    if (state.currentStep > 0) {
      showStep(state.currentStep - 1, 'back');
    }
  }

  /* ---------- HASH ROUTING ---------- */
  function updateHash() {
    var id = STEPS[state.currentStep].id;
    history.replaceState(null, '', '#' + id);
  }

  function readHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) return -1;
    for (var i = 0; i < STEPS.length; i++) {
      if (STEPS[i].id === hash) return i;
    }
    return -1;
  }

  /* ---------- STEP-SPECIFIC LOGIC ---------- */
  function onStepEnter(index) {
    var step = STEPS[index];

    // Update Next button state
    updateNextButton(index);

    // Compliment: show the right variant + trigger drop animation
    if (step.id === 'qz-confidence') {
      renderCompliment();
      // Trigger drop animation on the visible variant's tip-stack
      setTimeout(function () {
        var visibleVariant = document.querySelector('.qz-compliment-variant[style*="display"]:not([style*="none"]), .qz-compliment-variant:not([style*="display"])');
        if (!visibleVariant) visibleVariant = document.querySelector('.qz-compliment-variant');
        if (visibleVariant) {
          var stack = visibleVariant.querySelector('.qz-tip-stack');
          if (stack) {
            var imgs = stack.querySelectorAll('.qz-tip-drop');
            imgs.forEach(function (img) { img.classList.remove('animate'); img.style.opacity = '0'; img.style.transform = 'translateY(-80px)'; });
            setTimeout(function () { if (imgs[0]) imgs[0].classList.add('animate'); }, 300);
            setTimeout(function () { if (imgs[1]) imgs[1].classList.add('animate'); }, 2300);
            setTimeout(function () { if (imgs[2]) imgs[2].classList.add('animate'); }, 4300);
            setTimeout(function () { if (imgs[3]) imgs[3].classList.add('animate'); }, 6300);
          }
        }
      }, 50);
    }

    // Summary: render dynamic content + submit to Zapier
    if (step.id === 'qz-results') {
      renderSummary();
      submitToZapier();
    }

    // Tip 1: trigger drop-stacking animation
    if (step.id === 'qz-checkpoint') {
      var tipStack = document.getElementById('div-tip1-stack');
      if (tipStack) {
        var imgs = tipStack.querySelectorAll('.qz-tip-drop');
        imgs.forEach(function (img) { img.classList.remove('animate'); img.style.opacity = '0'; img.style.transform = 'translateY(-80px)'; });
        setTimeout(function () { if (imgs[0]) imgs[0].classList.add('animate'); }, 200);
        setTimeout(function () { if (imgs[1]) imgs[1].classList.add('animate'); }, 2200);
      }
    }

    // Restore selections from state
    restoreSelections(index);
  }

  /* ---------- OPTION HANDLERS ---------- */
  function initOptionHandlers() {
    // Single-select option cards
    container.addEventListener('click', function (e) {
      var card = e.target.closest('.qz-option-card[data-value]');
      if (!card) {
        // Check for pill options
        card = e.target.closest('.qz-option-pill[data-value]');
      }
      if (!card) return;

      var section = card.closest('.qz-step');
      var stepIndex = getStepIndex(section.id);
      if (stepIndex < 0) return;

      var stepDef = STEPS[stepIndex];
      var group = card.closest('[data-group]');
      var groupKey = group ? group.getAttribute('data-group') : stepDef.key;

      if (stepDef.type === 'single-select' || (stepDef.type === 'dual-select' && group)) {
        // Deselect siblings in same group
        var siblings = group
          ? group.querySelectorAll('.qz-option-card.qz-selected, .qz-option-pill.qz-selected')
          : section.querySelectorAll('.qz-option-card.qz-selected, .qz-option-pill.qz-selected');
        siblings.forEach(function (s) { s.classList.remove('qz-selected'); });
        card.classList.add('qz-selected');
        state.answers[groupKey] = card.getAttribute('data-value');
      }

      saveState();
      updateNextButton(stepIndex);
    });

    // Multi-select brand pills
    container.addEventListener('click', function (e) {
      var pill = e.target.closest('.qz-brand-pill');
      if (!pill) return;

      var section = pill.closest('.qz-step');
      var stepIndex = getStepIndex(section.id);
      if (stepIndex < 0) return;

      var stepDef = STEPS[stepIndex];
      if (stepDef.type !== 'multi-select') return;

      var maxSelect = stepDef.max || 99;
      var selected = section.querySelectorAll('.qz-brand-pill.qz-selected');

      if (pill.classList.contains('qz-selected')) {
        pill.classList.remove('qz-selected');
      } else {
        if (selected.length >= maxSelect) return;
        pill.classList.add('qz-selected');
      }

      // Update state
      var allSelected = section.querySelectorAll('.qz-brand-pill.qz-selected');
      var brands = [];
      allSelected.forEach(function (p) { brands.push(p.getAttribute('data-value')); });
      state.answers[stepDef.key] = brands;

      // Update counter
      var counter = section.querySelector('.qz-brands-counter');
      if (counter) counter.textContent = 'Selected: ' + brands.length + ' / ' + maxSelect;

      // Disable unselected pills when max reached
      var allPills = section.querySelectorAll('.qz-brand-pill');
      allPills.forEach(function (p) {
        if (!p.classList.contains('qz-selected')) {
          p.classList.toggle('qz-disabled', brands.length >= maxSelect);
        }
      });

      saveState();
      updateNextButton(stepIndex);
    });
  }

  /* ---------- SLIDER HANDLERS ---------- */
  function initSliderHandlers() {
    // Height slider
    var heightSlider = document.getElementById('qz-height-slider');
    var heightDisplay = document.getElementById('qz-height-value');
    if (heightSlider) {
      heightSlider.addEventListener('input', function () {
        var inches = parseInt(this.value);
        var ft = Math.floor(inches / 12);
        var rem = inches % 12;
        var display = ft + "'" + rem + '"';
        heightDisplay.textContent = display;
        state.answers.height = display;
        updateSliderTrack(this);
        saveState();
      });
      // Init
      heightSlider.dispatchEvent(new Event('input'));
    }

    // Weight slider
    var weightSlider = document.getElementById('qz-weight-slider');
    var weightDisplay = document.getElementById('qz-weight-value');
    if (weightSlider) {
      weightSlider.addEventListener('input', function () {
        var lbs = parseInt(this.value);
        weightDisplay.textContent = lbs + ' lbs';
        state.answers.weight = lbs + ' lbs';
        updateSliderTrack(this);
        saveState();
      });
      // Init
      weightSlider.dispatchEvent(new Event('input'));
    }
  }

  function updateSliderTrack(slider) {
    var min = parseFloat(slider.min);
    var max = parseFloat(slider.max);
    var val = parseFloat(slider.value);
    var pct = ((val - min) / (max - min)) * 100;
    slider.style.background = 'linear-gradient(to right, #ffd310 0%, #ffd310 ' + pct + '%, #2a2a2a ' + pct + '%, #2a2a2a 100%)';
  }

  /* ---------- INPUT HANDLERS ---------- */
  function initInputHandlers() {
    var inputs = container.querySelectorAll('.qz-input');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var section = this.closest('.qz-step');
        var stepIndex = getStepIndex(section.id);
        if (stepIndex < 0) return;

        var key = STEPS[stepIndex].key;
        state.answers[key] = this.value;
        saveState();

        // Clear error on typing
        this.classList.remove('qz-input-error');
        var errMsg = section.querySelector('.qz-input-error-msg');
        if (errMsg) errMsg.classList.remove('qz-visible');

        updateNextButton(stepIndex);
      });
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  function initFaqAccordion() {
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.qz-faq-question');
      if (!btn) return;
      var item = btn.closest('.qz-faq-item');
      item.classList.toggle('qz-faq-open');
    });
  }

  /* ---------- VALIDATION ---------- */
  function validateStep(index) {
    var step = STEPS[index];

    if (step.type === 'interstitial' || step.type === 'carousel' || step.type === 'results') {
      return true;
    }

    if (step.type === 'single-select') {
      return !!state.answers[step.key];
    }

    if (step.type === 'dual-select') {
      var keys = step.key;
      return keys.every(function (k) { return !!state.answers[k]; });
    }

    if (step.type === 'dual-slider') {
      return true; // sliders always have a value
    }

    if (step.type === 'multi-select') {
      return true; // brand selection is optional
    }

    if (step.type === 'text-input') {
      if (!step.required) return true;
      var val = (state.answers[step.key] || '').trim();
      if (!val) return false;
      if (step.validation === 'email') {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      return true;
    }

    return true;
  }

  function showValidationError(index) {
    var step = STEPS[index];
    var section = document.getElementById(step.id);
    if (step.type === 'text-input' && step.validation === 'email') {
      var input = section.querySelector('.qz-input');
      var errMsg = section.querySelector('.qz-input-error-msg');
      if (input) input.classList.add('qz-input-error');
      if (errMsg) errMsg.classList.add('qz-visible');
    }
  }

  /* ---------- NEXT BUTTON STATE ---------- */
  function updateNextButton(index) {
    var step = STEPS[index];
    var section = document.getElementById(step.id);
    if (!section) return;

    var btn = section.querySelector('.qz-btn-next');
    if (!btn) return;

    var valid = validateStep(index);
    if (valid) {
      btn.classList.remove('qz-btn-disabled');
      btn.removeAttribute('disabled');
    } else {
      btn.classList.add('qz-btn-disabled');
      btn.setAttribute('disabled', 'true');
    }
  }

  /* ---------- NEXT / SKIP / BACK BUTTON WIRING ---------- */
  function initButtons() {
    // Back button
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        goBack();
      });
    }

    // Next buttons
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.qz-btn-next');
      if (!btn) return;
      if (btn.classList.contains('qz-btn-disabled') || btn.disabled) return;

      var section = btn.closest('.qz-step');
      var stepIndex = getStepIndex(section.id);
      if (stepIndex < 0) return;

      if (validateStep(stepIndex)) {
        goNext();
      } else {
        showValidationError(stepIndex);
      }
    });

    // Skip buttons
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.qz-btn-skip');
      if (!btn) return;
      goNext();
    });
  }

  /* ---------- CAROUSEL HANDLER ---------- */
  var carouselBtnTexts = ['Finally', "That's Smart", 'This Makes Sense', 'I Like This', "I'm Ready", "Let's Go"];

  function initCarousel() {
    var swiperEl = document.querySelector('#qz-carousel-swiper');
    if (!swiperEl) return;

    heroSwiper = new Swiper('#qz-carousel-swiper', {
      slidesPerView: 1,
      allowTouchMove: false,
      speed: 500,
      pagination: {
        el: '#qz-carousel-dots',
        clickable: false
      }
    });

    var carouselBtn = document.getElementById('qz-carousel-btn');
    if (!carouselBtn) return;

    // Update button text on slide change
    heroSwiper.on('slideChange', function () {
      var idx = heroSwiper.activeIndex;
      carouselBtn.innerHTML = carouselBtnTexts[idx] + ' <span class="qz-arrow">&rarr;</span>';
    });

    carouselBtn.addEventListener('click', function () {
      if (heroSwiper.activeIndex < heroSwiper.slides.length - 1) {
        heroSwiper.slideNext();
      } else {
        goNext();
      }
    });
  }

  /* ---------- COMPLIMENT RENDERER ---------- */
  function renderCompliment() {
    var style = state.answers.primaryStyle || 'streetwear';
    var variants = document.querySelectorAll('#qz-confidence .qz-compliment-variant');
    variants.forEach(function (v) {
      v.style.display = v.getAttribute('data-style') === style ? 'block' : 'none';
    });
  }

  /* ---------- SUMMARY RENDERER ---------- */
  var ARCHETYPES = {
    'streetwear-saving-time': { name: 'The Architect', desc: 'Clean fits. Simple choices. Always looks good.' },
    'streetwear-dressing-better': { name: 'The Curator', desc: 'Strategic style. Maximum impact per dollar.' },
    'streetwear-finding-brands': { name: 'The Connoisseur', desc: 'Brand-conscious. Quality-driven. Always ahead.' },
    'streetwear-confidence': { name: 'The Maverick', desc: 'Bold moves. Loud presence. Unapologetic style.' },
    'contemporary-saving-time': { name: 'The Minimalist', desc: 'Less noise. More substance. Effortlessly sharp.' },
    'contemporary-dressing-better': { name: 'The Strategist', desc: 'Every piece has purpose. Nothing wasted.' },
    'contemporary-finding-brands': { name: 'The Tastemaker', desc: 'Refined taste. Premium picks. Sets the standard.' },
    'contemporary-confidence': { name: 'The Gentleman', desc: 'Classic energy. Modern confidence. Always polished.' },
    'heritage-saving-time': { name: 'The Original', desc: 'Timeless pieces. Zero effort. Maximum respect.' },
    'heritage-dressing-better': { name: 'The Collector', desc: 'Curated closet. Vintage soul. Smart spending.' },
    'heritage-finding-brands': { name: 'The Purist', desc: 'Heritage brands. Authentic quality. No shortcuts.' },
    'heritage-confidence': { name: 'The Icon', desc: 'Retro swagger. Creative edge. Stand-out energy.' }
  };

  function getArchetype() {
    var style = state.answers.primaryStyle || 'streetwear';
    var motivation = state.answers.motivation || 'confidence';
    var key = style + '-' + motivation;
    return ARCHETYPES[key] || ARCHETYPES['streetwear-confidence'];
  }

  function renderSummary() {
    var arch = getArchetype();
    var nameEl = document.getElementById('qz-summary-archetype-name');
    var descEl = document.getElementById('qz-summary-archetype-desc');
    if (nameEl) nameEl.textContent = arch.name;
    if (descEl) descEl.textContent = arch.desc;

    // Style tags
    var tagsEl = document.getElementById('qz-summary-tags');
    if (tagsEl) {
      var tags = [];
      if (state.answers.primaryStyle) tags.push(capitalize(state.answers.primaryStyle));
      if (state.answers.colorPreference) tags.push(capitalize(state.answers.colorPreference) + ' Colors');
      if (state.answers.designPreference) tags.push(capitalize(state.answers.designPreference) + ' Designs');
      if (state.answers.bottomsFit) tags.push(capitalize(state.answers.bottomsFit) + ' Fit');
      var colors = ['qz-tag-red', 'qz-tag-blue', 'qz-tag-green', 'qz-tag-orange'];
      tagsEl.innerHTML = tags.map(function (t, i) {
        return '<span class="qz-tag ' + colors[i % colors.length] + '">' + t + '</span>';
      }).join('');
    }

    // Traits
    var traitsEl = document.getElementById('qz-summary-traits');
    if (traitsEl) {
      var traits = generateTraits();
      traitsEl.innerHTML = traits.map(function (t) {
        return '<span class="qz-trait-pill">' + t + '</span>';
      }).join('');
    }

    // Stat bars
    var stats = generateStats();
    ['creative', 'trend', 'wardrobe'].forEach(function (key, i) {
      var fill = document.getElementById('qz-stat-' + key + '-fill');
      if (fill) {
        setTimeout(function () {
          fill.style.width = stats[i] + '%';
        }, 300 + i * 200);
      }
      var valEl = document.getElementById('qz-stat-' + key + '-value');
      if (valEl) valEl.textContent = stats[i] + '%';
    });
  }

  function generateTraits() {
    var traits = [];
    var style = state.answers.primaryStyle || 'streetwear';
    var color = state.answers.colorPreference || 'both';
    var design = state.answers.designPreference || 'both';

    if (style === 'streetwear') traits.push('Minimal but fresh', 'Sticks to what works');
    else if (style === 'contemporary') traits.push('Refined instinct', 'Effortless vibes');
    else traits.push('Vintage soul', 'Creative flair');

    if (color === 'neutral') traits.push('Neutral colors on lock');
    else if (color === 'bold') traits.push('Bold color energy');
    else traits.push('Balanced palette');

    if (design === 'clean') traits.push('Details matter');
    else if (design === 'graphic') traits.push('Statement pieces');
    else traits.push('Open to anything');

    return traits;
  }

  function generateStats() {
    var style = state.answers.primaryStyle || 'streetwear';
    var design = state.answers.designPreference || 'both';
    var color = state.answers.colorPreference || 'both';

    var creative = 50, trend = 50, wardrobe = 50;

    if (style === 'streetwear') { creative += 10; trend += 15; }
    else if (style === 'contemporary') { creative += 5; wardrobe += 15; }
    else { creative += 20; trend -= 5; }

    if (design === 'graphic') { creative += 15; trend += 5; }
    else if (design === 'clean') { wardrobe += 10; }
    else { creative += 5; wardrobe += 5; }

    if (color === 'bold') { creative += 10; trend += 5; }
    else if (color === 'neutral') { wardrobe += 10; }
    else { creative += 3; wardrobe += 3; }

    return [
      Math.min(creative, 95),
      Math.min(trend, 95),
      Math.min(wardrobe, 95)
    ];
  }

  /* ---------- RESTORE SELECTIONS ---------- */
  function restoreSelections(index) {
    var step = STEPS[index];
    var section = document.getElementById(step.id);
    if (!section) return;

    if (step.type === 'single-select' && state.answers[step.key]) {
      var cards = section.querySelectorAll('.qz-option-card[data-value], .qz-option-pill[data-value]');
      cards.forEach(function (c) {
        c.classList.toggle('qz-selected', c.getAttribute('data-value') === state.answers[step.key]);
      });
    }

    if (step.type === 'dual-select') {
      step.key.forEach(function (k) {
        if (state.answers[k]) {
          var group = section.querySelector('[data-group="' + k + '"]');
          if (group) {
            group.querySelectorAll('.qz-option-card[data-value], .qz-option-pill[data-value]').forEach(function (c) {
              c.classList.toggle('qz-selected', c.getAttribute('data-value') === state.answers[k]);
            });
          }
        }
      });
    }

    if (step.type === 'multi-select' && state.answers[step.key]) {
      var brands = state.answers[step.key];
      section.querySelectorAll('.qz-brand-pill').forEach(function (p) {
        p.classList.toggle('qz-selected', brands.indexOf(p.getAttribute('data-value')) >= 0);
      });
      var counter = section.querySelector('.qz-brands-counter');
      if (counter) counter.textContent = 'Selected: ' + brands.length + ' / ' + (step.max || 6);
    }

    if (step.type === 'text-input' && state.answers[step.key]) {
      var input = section.querySelector('.qz-input');
      if (input) input.value = state.answers[step.key];
    }

    if (step.type === 'dual-slider') {
      var hSlider = document.getElementById('qz-height-slider');
      var wSlider = document.getElementById('qz-weight-slider');
      if (hSlider && state.answers.height) {
        // Parse back from "5'8"" format
        var match = (state.answers.height || '').match(/(\d+)'(\d+)"/);
        if (match) {
          hSlider.value = parseInt(match[1]) * 12 + parseInt(match[2]);
          hSlider.dispatchEvent(new Event('input'));
        }
      }
      if (wSlider && state.answers.weight) {
        var wMatch = (state.answers.weight || '').match(/(\d+)/);
        if (wMatch) {
          wSlider.value = parseInt(wMatch[1]);
          wSlider.dispatchEvent(new Event('input'));
        }
      }
    }
  }

  /* ---------- ZAPIER WEBHOOK ---------- */
  // CONFIGURE: Paste your Zapier webhook URL here
  var ZAPIER_WEBHOOK_URL = 'YOUR_ZAPIER_WEBHOOK_URL_HERE';

  // CONFIGURE: Paste your Shopify checkout URLs here (use cart permalink format)
  var SHOPIFY_URLS = {
    'haul-of-famer': 'https://YOUR-STORE.myshopify.com/cart/VARIANT_ID:1',
    'all-star':      'https://YOUR-STORE.myshopify.com/cart/VARIANT_ID:1',
    'starter':       'https://YOUR-STORE.myshopify.com/cart/VARIANT_ID:1',
    'rookie':        'https://YOUR-STORE.myshopify.com/cart/VARIANT_ID:1'
  };

  function buildPayload(extraData) {
    var arch = getArchetype();
    var payload = {
      timestamp: new Date().toISOString(),
      archetype: arch.name,
      archetypeDesc: arch.desc,
      email: state.answers.email || '',
      phone: state.answers.phone || '',
      birthday: state.answers.birthday || '',
      motivation: state.answers.motivation || '',
      primaryStyle: state.answers.primaryStyle || '',
      bottomsFit: state.answers.bottomsFit || '',
      colorPreference: state.answers.colorPreference || '',
      designPreference: state.answers.designPreference || '',
      topSize: state.answers.topSize || '',
      waistSize: state.answers.waistSize || '',
      pantLength: state.answers.pantLength || '',
      shoeSize: state.answers.shoeSize || '',
      height: state.answers.height || '',
      weight: state.answers.weight || '',
      brands: (state.answers.brands || []).join(', ')
    };
    if (extraData) {
      for (var k in extraData) { payload[k] = extraData[k]; }
    }
    return payload;
  }

  function submitToZapier(extraData) {
    if (ZAPIER_WEBHOOK_URL === 'YOUR_ZAPIER_WEBHOOK_URL_HERE') {
      console.log('[HOF Quiz] Zapier webhook not configured. Payload:', buildPayload(extraData));
      return;
    }
    if (state.submitted && !extraData) return; // avoid duplicate quiz submissions

    var payload = buildPayload(extraData);

    fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'no-cors',
      body: JSON.stringify(payload)
    }).then(function () {
      console.log('[HOF Quiz] Submitted to Zapier');
      if (!extraData) {
        state.submitted = true;
        saveState();
      }
    }).catch(function (err) {
      console.error('[HOF Quiz] Zapier submission failed:', err);
    });
  }

  /* ---------- SHOPIFY CHECKOUT ---------- */
  function initPlanButtons() {
    var planBtns = document.querySelectorAll('.qz-plan-btn');
    planBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.qz-plan-card');
        var planId = card ? card.id : '';
        var planKey = '';

        if (planId === 'qz-plan-hof') planKey = 'haul-of-famer';
        else if (planId === 'qz-plan-allstar') planKey = 'all-star';
        else if (planId === 'qz-plan-starter') planKey = 'starter';
        else if (planId === 'qz-plan-rookie') planKey = 'rookie';

        // Submit plan selection to Zapier
        submitToZapier({ selectedPlan: planKey });

        // Redirect to Shopify
        var url = SHOPIFY_URLS[planKey];
        if (url && url.indexOf('YOUR-STORE') === -1) {
          window.location.href = url;
        } else {
          console.log('[HOF Quiz] Shopify URL not configured for plan:', planKey);
          alert('Plan selected: ' + planKey + '. Shopify checkout URL not configured yet.');
        }
      });
    });
  }

  /* ---------- HELPERS ---------- */
  function getStepIndex(sectionId) {
    for (var i = 0; i < STEPS.length; i++) {
      if (STEPS[i].id === sectionId) return i;
    }
    return -1;
  }

  function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* ---------- INIT ---------- */
  function init() {
    // Try loading saved state
    var hadSaved = loadState();

    // Init all handlers
    initOptionHandlers();
    initSliderHandlers();
    initInputHandlers();
    initButtons();
    initFaqAccordion();
    initCarousel();
    initPlanButtons();

    // Determine starting step
    var hashStep = readHash();
    var startStep = 0;

    if (hashStep >= 0) {
      startStep = hashStep;
    } else if (hadSaved) {
      startStep = state.currentStep;
    }

    state.startedAt = state.startedAt || new Date().toISOString();

    // Show initial step (no animation)
    allSections.forEach(function (s) { s.style.display = 'none'; });
    var initialEl = document.getElementById(STEPS[startStep].id);
    if (initialEl) {
      initialEl.style.display = 'flex';
      initialEl.classList.add('qz-active');
    }
    state.currentStep = startStep;
    updateProgress();
    updateBackButton();
    updateHash();
    saveState();
    onStepEnter(startStep);

    // Handle browser back
    window.addEventListener('popstate', function () {
      var idx = readHash();
      if (idx >= 0 && idx !== state.currentStep) {
        showStep(idx, idx < state.currentStep ? 'back' : 'forward');
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
