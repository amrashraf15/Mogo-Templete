document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeroSlider();
    initRTL();
    initCounters();
    initRevealAnimations();
    initStoryAccordion();
    initTestimonials();
    initSubscribeForm();
});

/* ---------------------------------------------------------
   Mobile navigation
   --------------------------------------------------------- */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (!toggle || !nav) return;

    const closeMenu = () => {
        toggle.classList.remove('is-open');
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.toggle('is-open');
        nav.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', event => {
        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
}

/* Hero slider */
function initHeroSlider() {
    const hero = document.querySelector('.hero');
    const content = document.querySelector('.hero-content');
    const title = document.querySelector('.hero-title');
    const button = document.querySelector('.hero-button');
    const sliders = [...document.querySelectorAll('.hero-sliders .slider')];

    if (!hero || !content || !title || !button || sliders.length === 0) return;

    const slides = [
        { title: 'WELCOME<br>TO MOGO', button: 'Learn More', target: '#about' },
        { title: 'CREATIVE<br>DESIGN', button: 'Our Work', target: '#work' },
        { title: 'DIGITAL<br>EXPERIENCE', button: 'Services', target: '#services' },
        { title: 'BUILD<br>YOUR BRAND', button: 'Contact Us', target: '#contact' }
    ];

    let current = Math.max(0, sliders.findIndex(slider => slider.classList.contains('active')));
    let timer;

    const showSlide = index => {
        current = (index + slides.length) % slides.length;
        const slide = slides[current];

        content.classList.add('is-changing');

        window.setTimeout(() => {
            title.innerHTML = slide.title;
            button.textContent = slide.button;
            button.setAttribute('href', slide.target);

            sliders.forEach((slider, sliderIndex) => {
                slider.classList.toggle('active', sliderIndex === current);
                slider.setAttribute('aria-current', sliderIndex === current ? 'true' : 'false');
            });

            content.classList.remove('is-changing');
        }, 180);
    };

    const restartTimer = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => showSlide(current + 1), 5500);
    };

    sliders.forEach((slider, index) => {
        slider.setAttribute('role', 'button');
        slider.setAttribute('tabindex', '0');
        slider.setAttribute('aria-label', `Show hero slide ${index + 1}`);

        slider.addEventListener('click', () => {
            showSlide(index);
            restartTimer();
        });

        slider.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showSlide(index);
                restartTimer();
            }
        });
    });

    button.addEventListener('click', event => {
        const target = button.getAttribute('href');
        if (!target || !target.startsWith('#')) return;

        const section = document.querySelector(target);
        if (section) {
            event.preventDefault();
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Keep the first slide visible on page load.
    showSlide(current);
    restartTimer();
}

/* ---------------------------------------------------------
   Animated statistics counters
   --------------------------------------------------------- */
function initCounters() {
    const counters = [...document.querySelectorAll('.stat-item h3')];
    if (!counters.length) return;

    const animateCounter = element => {
        const target = Number(element.textContent.trim().replace(/,/g, ''));
        if (!Number.isFinite(target)) return;

        const duration = 1200;
        const startTime = performance.now();

        const update = now => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(target * eased).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            counters.forEach(counter => {
                if (counter.dataset.animated === 'true') return;
                counter.dataset.animated = 'true';
                animateCounter(counter);
            });

            observer.disconnect();
        });
    }, { threshold: 0.35 });

    const stats = document.querySelector('.stats-section');
    if (stats) observer.observe(stats);
}

/* ---------------------------------------------------------
   Scroll reveal
   --------------------------------------------------------- */
function initRevealAnimations() {
    const sections = document.querySelectorAll(
        'main > section:not(.hero), .footer'
    );

    if (!sections.length) return;

    sections.forEach(section => section.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
        sections.forEach(section => section.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -50px'
    });

    sections.forEach(section => observer.observe(section));
}

/* ---------------------------------------------------------
   Story accordion
   --------------------------------------------------------- */
function initStoryAccordion() {
    const items = [...document.querySelectorAll('.story-accordion img')];
    if (!items.length) return;

    items.forEach((item, index) => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Open story item ${index + 1}`);

        const activate = () => {
            items.forEach(other => other.classList.remove('is-active'));
            item.classList.add('is-active');
        };

        item.addEventListener('click', activate);
        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activate();
            }
        });
    });

    const initial = items.find(item => item.classList.contains('accordion-open')) || items[0];
    initial.classList.add('is-active');
}

/* ---------------------------------------------------------
   Testimonials
   --------------------------------------------------------- */
function initTestimonials() {
    initFirstTestimonial();
    initWorkTestimonials();
}

function initFirstTestimonial() {
    const section = document.querySelector('.testimonial-section');
    if (!section) return;

    const text = section.querySelector('.testimonial-text');
    const author = section.querySelector('.author-name');
    const prev = section.querySelector('.testimonial-arrow.prev');
    const next = section.querySelector('.testimonial-arrow.next');

    if (!text || !author || !prev || !next) return;

    const testimonials = [
        {
            text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
            author: 'Jon Doe'
        },
        {
            text: '"Great design is not only what you see. It is how clearly the experience communicates with people."',
            author: 'Jane Smith'
        },
        {
            text: '"A strong visual identity helps a business become memorable, useful and easy to understand."',
            author: 'Alex Brown'
        }
    ];

    let index = 0;

    const update = direction => {
        index = (index + direction + testimonials.length) % testimonials.length;
        const item = testimonials[index];
        const content = section.querySelector('.testimonial-content');

        content?.classList.add('is-changing');
        window.setTimeout(() => {
            text.textContent = item.text;
            author.textContent = item.author;
            content?.classList.remove('is-changing');
        }, 160);
    };

    prev.addEventListener('click', () => update(-1));
    next.addEventListener('click', () => update(1));
}

function initWorkTestimonials() {
    const section = document.querySelector('.work-testimonial');
    if (!section) return;

    const text = section.querySelector('.testimonial-text p');
    const author = section.querySelector('.author-name');
    const prev = section.querySelector('.testimonial-arrow-left');
    const next = section.querySelector('.testimonial-arrow-right');

    if (!text || !author || !prev || !next) return;

    const testimonials = [
        {
            text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."',
            author: 'Joshua Earle'
        },
        {
            text: '"The best work combines a clear idea, a simple interface and a visual system that works on every screen."',
            author: 'Matthew Dix'
        },
        {
            text: '"Every project is an opportunity to turn a creative concept into a useful and memorable experience."',
            author: 'Nick Karvounis'
        }
    ];

    let index = 0;

    const update = direction => {
        index = (index + direction + testimonials.length) % testimonials.length;
        const item = testimonials[index];
        const content = section.querySelector('.testimonial-content');

        content?.classList.add('is-changing');
        window.setTimeout(() => {
            text.textContent = item.text;
            author.textContent = item.author;
            content?.classList.remove('is-changing');
        }, 160);
    };

    prev.addEventListener('click', () => update(-1));
    next.addEventListener('click', () => update(1));
}

/* ---------------------------------------------------------
   Newsletter validation
   --------------------------------------------------------- */
function initSubscribeForm() {
    const form = document.querySelector('.subscribe-form');
    if (!form) return;

    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button');
    if (!input || !button) return;

    const message = document.createElement('p');
    message.className = 'subscribe-message';
    message.setAttribute('aria-live', 'polite');
    form.appendChild(message);

    form.addEventListener('submit', event => {
        event.preventDefault();
        const email = input.value.trim();

        if (!email || !input.checkValidity()) {
            message.textContent = 'Please enter a valid email address.';
            message.classList.add('error');
            input.focus();
            return;
        }

        message.textContent = 'Thanks! You have been subscribed.';
        message.classList.remove('error');
        input.value = '';
    });
}

function initRTL() {
    const languageButton = document.querySelector('.language');
    const storySection = document.querySelector('.story-section');

    if (!languageButton || !storySection) return;

    // Get all elements that contain both English and Arabic text
    const translatableElements = storySection.querySelectorAll(
        '[data-en][data-ar]'
    );

    languageButton.addEventListener('click', (event) => {
        event.preventDefault();

        const isRTL = storySection.getAttribute('dir') === 'rtl';

        if (isRTL) {
            storySection.setAttribute('dir', 'ltr');

            translatableElements.forEach(element => {
                element.textContent = element.dataset.en;
            });

            languageButton.textContent = 'AR';

        } else {
            storySection.setAttribute('dir', 'rtl');

            translatableElements.forEach(element => {
                element.textContent = element.dataset.ar;
            });

            languageButton.textContent = 'EN';
        }
    });
}