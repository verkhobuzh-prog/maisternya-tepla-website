/* Ігор Козубаль — масаж і тілесні практики
   main.js */

var officeAddress = 'м. Київ, бульвар Лесі Українки, 6 (м. Палац Спорту)';

document.addEventListener('DOMContentLoaded', function () {

  var PHONE = '380979449382';

  /* ---------- Адреса ---------- */
  var addressEl = document.getElementById('current-address');
  if (addressEl && typeof officeAddress === 'string' && officeAddress.trim()) {
    addressEl.textContent = officeAddress;
  }

  /* ---------- Мобільне меню ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    siteNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Плавний скрол ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Клік по послузі підставляє її у форму ---------- */
  var serviceSelect = document.getElementById('serviceSelect');

  function pickService(value) {
    if (!serviceSelect || !value) return;
    serviceSelect.value = value;
    var contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('[data-service]').forEach(function (card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('click', function () {
      pickService(card.getAttribute('data-service'));
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pickService(card.getAttribute('data-service'));
      }
    });
  });

  /* ---------- Форма запису ---------- */
  var bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    var SERVICE_LABELS = {
      first:  'Перша зустріч (90 хв, 1200 грн)',
      back:   'Спина і шия (60 хв, 1000 грн)',
      body:   'Робота з тілом (90 хв, 1400 грн)',
      deep:   'Глибока робота (90 хв, 1600 грн)',
      pack5:  'Пакет 5 сеансів (6500 грн)',
      pack10: 'Пакет 10 сеансів (12 000 грн)'
    };

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = bookingForm.querySelector('input[name="name"]').value.trim();
      var phone   = bookingForm.querySelector('input[name="phone"]').value.trim();
      var service = bookingForm.querySelector('select[name="service"]').value;
      var consent = bookingForm.querySelector('input[name="consent"]').checked;

      if (!name || !phone || !service) {
        showStatus(bookingForm, 'Заповніть ім\'я, телефон і оберіть послугу.', 'error');
        return;
      }
      if (!consent) {
        showStatus(bookingForm, 'Потрібна згода на обробку контактних даних.', 'error');
        return;
      }

      var text =
        'Доброго дня! Хочу записатися.\n\n' +
        'Ім\'я: ' + name + '\n' +
        'Телефон: ' + phone + '\n' +
        'Послуга: ' + (SERVICE_LABELS[service] || service);

      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text), '_blank');

      showStatus(bookingForm, 'Відкрився WhatsApp із готовим повідомленням. Надішліть його — і я відповім.', 'ok');
      bookingForm.reset();
    });
  }

  function showStatus(form, message, state) {
    var box = form.querySelector('.form-status');
    if (!box) {
      box = document.createElement('p');
      box.className = 'form-status';
      form.appendChild(box);
    }
    box.textContent = message;
    box.setAttribute('data-state', state === 'error' ? 'error' : 'ok');
  }

  /* ---------- Тінь шапки при скролі ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Поява блоків при скролі ---------- */
  var animatable = document.querySelectorAll(
    '.about-text, .hill-card, .steps li, .price-row, .package, .review, .safety-grid > div'
  );

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    animatable.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatable.forEach(function (el) { observer.observe(el); });
  }

});
