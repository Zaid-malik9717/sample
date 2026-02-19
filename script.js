/* ═══════════════════════════════════════
  GLOWGUIDE — JAVASCRIPT
═══════════════════════════════════════ */

/* ─── Navbar Scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ─── Mobile Menu ─── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger bars to X
    const bars = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
        bars[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
        bars[1].style.cssText = 'opacity:0;';
        bars[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    } else {
        bars.forEach(b => (b.style.cssText = ''));
    }
});

// Close on nav link click
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(b => (b.style.cssText = ''));
    });
});

/* ─── Product Carousel ─── */
const track = document.getElementById('productsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
}

function getCardWidth() {
    const cards = track.querySelectorAll('.product-card');
    if (!cards.length) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 22;
    return cards[0].offsetWidth + gap;
}

function updateCarousel() {
    const visibleCount = getVisibleCount();
    const cardCount = track.querySelectorAll('.product-card').length;
    const maxIndex = Math.max(0, cardCount - visibleCount);
    currentIndex = Math.min(currentIndex, maxIndex);

    const offset = currentIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
}

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; updateCarousel(); }
});
nextBtn.addEventListener('click', () => {
    const visibleCount = getVisibleCount();
    const cardCount = track.querySelectorAll('.product-card').length;
    const maxIndex = cardCount - visibleCount;
    if (currentIndex < maxIndex) { currentIndex++; updateCarousel(); }
});

window.addEventListener('resize', () => {
    currentIndex = 0;
    updateCarousel();
});

// Auto-play carousel
let autoPlay = setInterval(() => {
    const visibleCount = getVisibleCount();
    const cardCount = track.querySelectorAll('.product-card').length;
    const maxIndex = cardCount - visibleCount;
    currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    updateCarousel();
}, 4000);

// Stop auto-play on manual interaction
[prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
        clearInterval(autoPlay);
    });
});

updateCarousel();

/* ─── Quiz Modal ─── */
const quizModal = document.getElementById('quizModal');
const modalClose = document.getElementById('modalClose');
const takeQuizBtn = document.getElementById('takeQuizBtn');
const startQuizBtn = document.getElementById('startQuizBtn');

function openModal() {
    quizModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetQuiz();
}
function closeModal() {
    quizModal.classList.remove('active');
    document.body.style.overflow = '';
}

[takeQuizBtn, startQuizBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
});
modalClose.addEventListener('click', closeModal);
quizModal.addEventListener('click', (e) => { if (e.target === quizModal) closeModal(); });

// Keyboard close
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Quiz step navigation
const steps = ['step1', 'step2', 'step3'];
const dots = ['dot1', 'dot2', 'dot3'];

function showStep(stepId) {
    steps.forEach((id, i) => {
        const el = document.getElementById(id);
        const dot = document.getElementById(dots[i]);
        if (id === stepId) {
            el.classList.remove('hidden');
            dot.classList.add('active');
        } else {
            el.classList.add('hidden');
            dot.classList.remove('active');
        }
    });
}

function resetQuiz() {
    showStep('step1');
}

document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
        const next = btn.dataset.next;
        if (next) showStep(next);
    });
});

// "View My Routine" inside modal → close and scroll
const viewRoutineBtn = document.getElementById('viewRoutineBtn');
if (viewRoutineBtn) {
    viewRoutineBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        setTimeout(() => {
            document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
        }, 350);
    });
}

/* ─── Newsletter Form ─── */
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email) return;
    newsletterForm.reset();
    showToast('🌿 You\'re on the list! Welcome to the Glow.');
});

/* ─── Toast Notification ─── */
function showToast(message, duration = 3500) {
    // Remove any existing toast
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger show
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 450);
    }, duration);
}

/* ─── Scroll Reveal ─── */
function setupReveal() {
    const revealEls = document.querySelectorAll(
        '.product-card, .section-title, .section-sub, .routine-title, .cta-title, .cta-sub, .stat, .footer-brand, .footer-links, .footer-newsletter'
    );
    revealEls.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 80}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

setupReveal();

/* ─── Smooth CTA Number Counter ─── */
function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start).toLocaleString() + suffix;
        }
    }, step);
}

// Observe stats section
const statsSection = document.querySelector('.cta-stats');
let countersStarted = false;

if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;

            const statValues = document.querySelectorAll('.stat-value');
            if (statValues[0]) animateCounter(statValues[0], 50, 'k+');
            if (statValues[1]) animateCounter(statValues[1], 98, '%');

            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

/* ─── Active Nav Highlight on Scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--dark)' : '';
    });
}, { passive: true });

console.log('✦ GlowGuide loaded successfully!');
