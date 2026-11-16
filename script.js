/* =====================================================
   OUTILS
===================================================== */

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}


/* =====================================================
   MENU MOBILE
===================================================== */

const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

function setMenu(open) {
    navbar.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
}

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        setMenu(!navbar.classList.contains("open"));
    });

    navbar.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setMenu(false);
    });

    document.addEventListener("pointerdown", (e) => {
        if (
            navbar.classList.contains("open") &&
            !navbar.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            setMenu(false);
        }
    });
}


/* =====================================================
   THÈME CLAIR / SOMBRE
===================================================== */

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function applyThemeIcon() {
    if (!themeToggle) return;
    const isDark = root.getAttribute("data-theme") === "dark";
    themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Passer au thème clair" : "Passer au thème sombre"
    );

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#06100b" : "#f6faf7");
}

applyThemeIcon();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
        applyThemeIcon();
    });
}


/* =====================================================
   SCROLL : progression, header, retour en haut, nav active
===================================================== */

const header = document.getElementById("header");
const progressLine = document.getElementById("scroll-progress");
const backToTop = document.getElementById("back-to-top");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

let ticking = false;

function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (progressLine) progressLine.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (header) header.classList.toggle("scrolled", y > 20);
    if (backToTop) backToTop.classList.toggle("show", y > 500);

    let current = "";
    sections.forEach(section => {
        if (y >= section.offsetTop - 160) current = section.id;
    });

    navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });

    ticking = false;
}

window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });

onScroll();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
}


/* =====================================================
   APPARITION DES ÉLÉMENTS AU SCROLL
===================================================== */

const revealSelectors = [
    ".section-title",
    ".about-content",
    ".mini-card",
    ".stat",
    ".skill-card",
    ".skills-progress",
    ".project-card",
    ".timeline-item",
    ".contact-info",
    ".contact-form"
].join(", ");

const revealElements = document.querySelectorAll(revealSelectors);

revealElements.forEach(el => {
    el.classList.add("reveal");

    // Décalage progressif entre cartes d'un même groupe
    const siblings = el.parentElement.querySelectorAll(":scope > .reveal, :scope > .skill-card, :scope > .project-card, :scope > .stat, :scope > .mini-card");
    const position = Array.prototype.indexOf.call(siblings, el);
    el.style.setProperty("--delay", Math.max(position, 0) * 0.08 + "s");
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => observer.observe(el));
} else {
    revealElements.forEach(el => el.classList.add("visible"));
}


/* =====================================================
   BARRES DE COMPÉTENCES
===================================================== */

const progressBars = document.querySelectorAll(".progress");

if ("IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => barObserver.observe(bar));
} else {
    progressBars.forEach(bar => (bar.style.width = bar.dataset.width));
}


/* =====================================================
   COMPTEURS ANIMÉS
===================================================== */

const counters = document.querySelectorAll("[data-count]");

function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReducedMotion) { el.textContent = target; return; }

    const duration = 1200;
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(c => counterObserver.observe(c));
}


/* =====================================================
   EFFET "SPOTLIGHT" SUR LES CARTES
===================================================== */

document.querySelectorAll(".spotlight").forEach(card => {
    card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - rect.left + "px");
        card.style.setProperty("--my", e.clientY - rect.top + "px");
    });
});


/* =====================================================
   EFFET DE FRAPPE
===================================================== */

const typingElement = document.getElementById("typing-text");

if (typingElement && !prefersReducedMotion) {
    const text = typingElement.textContent.trim();
    let index = 0;

    typingElement.textContent = "";

    (function typeWriter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index++);
            setTimeout(typeWriter, 45);
        }
    })();
}


/* =====================================================
   COPIER L'EMAIL
===================================================== */

const copyButton = document.getElementById("copy-email");

if (copyButton) {
    copyButton.addEventListener("click", async () => {
        const email = copyButton.dataset.email;

        try {
            await navigator.clipboard.writeText(email);
            showToast("Adresse email copiée ✓");
        } catch (e) {
            showToast("Impossible de copier automatiquement");
        }
    });
}


/* =====================================================
   FORMULAIRE DE CONTACT
===================================================== */

const form = document.getElementById("contact-form");
const statusMessage = document.querySelector(".form-status");

function setError(input, message) {
    const group = input.closest(".form-group");
    const error = group.querySelector(".error-message");
    error.textContent = message;
    group.classList.toggle("has-error", Boolean(message));
}

if (form) {
    ["nom", "email", "message"].forEach(id => {
        document.getElementById(id).addEventListener("input", (e) => setError(e.target, ""));
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nom = document.getElementById("nom");
        const email = document.getElementById("email");
        const message = document.getElementById("message");

        let valid = true;

        statusMessage.textContent = "";
        statusMessage.classList.remove("error");

        setError(nom, "");
        setError(email, "");
        setError(message, "");

        if (nom.value.trim().length < 2) {
            setError(nom, "Veuillez entrer votre nom.");
            valid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            setError(email, "Veuillez entrer une adresse email valide.");
            valid = false;
        }

        if (message.value.trim().length < 10) {
            setError(message, "Votre message doit contenir au moins 10 caractères.");
            valid = false;
        }

        if (!valid) {
            statusMessage.textContent = "Veuillez corriger les informations du formulaire.";
            statusMessage.classList.add("error");
            return;
        }

        const subject = encodeURIComponent("Message depuis le portfolio");
        const body = encodeURIComponent(
            `Nom : ${nom.value.trim()}\nEmail : ${email.value.trim()}\n\n${message.value.trim()}`
        );

        statusMessage.textContent =
            "Votre messagerie va s’ouvrir avec le message. Pensez à confirmer l’envoi.";

        window.location.href =
            `mailto:soumahorohamed1802@gmail.com?subject=${subject}&body=${body}`;
    });
}


/* =====================================================
   ANNÉE AUTOMATIQUE
===================================================== */

const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
