document.addEventListener('DOMContentLoaded', function() {

    // Динамічна адреса з address.js
    const addressEl = document.getElementById('current-address');
    if (addressEl && typeof officeAddress !== 'undefined') {
        addressEl.textContent = officeAddress;
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const service = this.querySelector('select').value;

            if (!name || !phone || !service) {
                alert('Будь ласка, заповніть всі обов\'язкові поля');
                return;
            }

            const serviceNames = {
                'consultation': 'Консультація',
                'trial': 'Пробний масаж',
                'back': 'Масаж спини',
                'classic': 'Масаж класичний',
                'therapeutic': 'Масаж інтенсивний'
            };

            const serviceName = serviceNames[service] || service;

            let whatsappMessage = `Привіт! Хочу записатися на прийом:\n\n`;
            whatsappMessage += `Ім'я: ${name}\n`;
            whatsappMessage += `Телефон: ${phone}\n`;
            whatsappMessage += `Послуга: ${serviceName}`;

            const whatsappUrl = `https://wa.me/380979449382?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');

            alert('Дякуємо за заявку! Ви будете перенаправлені в WhatsApp для підтвердження запису.');
            this.reset();
        });
    }

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'linear-gradient(135deg, rgba(135, 206, 235, 0.98) 0%, rgba(74, 144, 226, 0.95) 50%, rgba(46, 139, 87, 0.98) 100%)';
            } else {
                header.style.background = 'linear-gradient(135deg, rgba(135, 206, 235, 0.95) 0%, rgba(74, 144, 226, 0.9) 50%, rgba(46, 139, 87, 0.95) 100%)';
            }
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .contact-item, .review-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    console.log('🌿 Майстерня тепла - сайт завантажено успішно!');
    console.log('📞 Телефон: +38 (097) 944-93-82');
    console.log('📧 Email: verkhobuzh@gmail.com');
});
