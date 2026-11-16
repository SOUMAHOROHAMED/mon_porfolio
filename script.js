// Menu mobile : fermeture avec Échap, clic extérieur ou choix d'une section.
const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
    if (!menuToggle || !navbar) return;
    navbar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
}

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });

    navLinks.forEach(link => link.addEventListener("click", closeMenu));

    document.addEventListener("pointerdown", event => {
        if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && navbar.classList.contains("open")) {
            closeMenu();
            menuToggle.focus();
        }
    });
}

// Le thème initial est posé dans le head avant l'affichage de la feuille CSS.
const themeToggle = document.getElementById("theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeControl() {
    if (!themeToggle) return;
    const isDark = document.documentElement.dataset.theme === "dark";
    themeToggle.setAttribute("aria-label", isDark ? "Passer au thème clair" : "Passer au thème sombre");
    themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    if (themeColor) themeColor.content = isDark ? "#06110e" : "#f4faf7";
}

if (themeToggle) {
    updateThemeControl();
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("theme", nextTheme);
        updateThemeControl();
    });
}

// La progression de lecture, l'état du header et le retour en haut suivent le scroll.
const scrollProgress = document.querySelector("#scroll-progress span");
const header = document.querySelector(".header");
const backToTop = document.getElementById("back-to-top");

function updateScrollState() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 400);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        window.scrollTo({ top: 0, behavior });
    });
}

// Les sections visibles mettent à jour le lien actif dans la navigation.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active", isCurrent);
                if (isCurrent) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
}

// Les blocs et cartes apparaissent au scroll avec un décalage subtil.
const revealElements = document.querySelectorAll(
    ".hero-content, .hero-image, .section-title, .about-content, .highlight-card, " +
    ".skill-card, .skills-progress-card, .project-card, .timeline-item, " +
    ".contact-info, .contact-form, .stat-card"
);
const revealGroups = new Map();
revealElements.forEach(element => {
    element.classList.add("reveal");
    const parent = element.parentElement;
    if (!revealGroups.has(parent)) revealGroups.set(parent, []);
    revealGroups.get(parent).push(element);
});
revealGroups.forEach(elements => {
    elements.forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 75}ms`);
    });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealElements.forEach(element => revealObserver.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}

// Les compteurs et les jauges s'animent uniquement à leur apparition.
const counters = document.querySelectorAll(".counter");
function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    if (!Number.isFinite(target)) return;
    if (reducedMotion) {
        counter.textContent = String(target);
        return;
    }

    const startTime = performance.now();
    const duration = 850;
    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.6 });
    counters.forEach(counter => counterObserver.observe(counter));

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.width = entry.target.dataset.width || "0";
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll(".progress").forEach(bar => progressObserver.observe(bar));
} else {
    counters.forEach(animateCounter);
    document.querySelectorAll(".progress").forEach(bar => {
        bar.style.width = bar.dataset.width || "0";
    });
}

// L'effet de frappe reste désactivé si la personne réduit les animations.
const typingElement = document.getElementById("typing-text");
const typingText = "Administrateur de bases de données junior";
if (typingElement && !reducedMotion) {
    typingElement.textContent = "";
    let characterIndex = 0;
    function typeNextCharacter() {
        if (characterIndex >= typingText.length) return;
        typingElement.textContent += typingText.charAt(characterIndex);
        characterIndex += 1;
        window.setTimeout(typeNextCharacter, 48);
    }
    typeNextCharacter();
}

// Copie de l'adresse avec confirmation ou message d'erreur dans le toast.
const copyButton = document.getElementById("copy-email");
const contactEmail = document.getElementById("contact-email");
const toast = document.getElementById("toast");
let toastTimeout;

function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("error", Boolean(isError));
    toast.classList.add("show");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

if (copyButton && contactEmail) {
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(contactEmail.textContent.trim());
            showToast("Adresse e-mail copiée", false);
        } catch (error) {
            showToast("La copie a échoué. Sélectionnez l’adresse e-mail.", true);
        }
    });
}

// Le formulaire conserve les règles de validation et le lien mailto existants.
const form = document.getElementById("contact-form");
const statusMessage = document.querySelector(".form-status");

if (form) {
    form.addEventListener("submit", event => {
        event.preventDefault();

        const nom = document.getElementById("nom");
        const email = document.getElementById("email");
        const message = document.getElementById("message");
        let valid = true;

        if (statusMessage) {
            statusMessage.textContent = "";
            statusMessage.classList.remove("error");
        }

        [nom, email, message].forEach(field => {
            const group = field.closest(".form-group");
            const error = group.querySelector(".error-message");
            error.textContent = "";
            group.classList.remove("has-error");
        });

        if (nom.value.trim().length < 2) {
            nom.closest(".form-group").querySelector(".error-message").textContent = "Veuillez entrer votre nom.";
            nom.closest(".form-group").classList.add("has-error");
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.closest(".form-group").querySelector(".error-message").textContent = "Veuillez entrer une adresse email valide.";
            email.closest(".form-group").classList.add("has-error");
            valid = false;
        }

        if (message.value.trim().length < 10) {
            message.closest(".form-group").querySelector(".error-message").textContent = "Votre message doit contenir au moins 10 caractères.";
            message.closest(".form-group").classList.add("has-error");
            valid = false;
        }

        if (valid) {
            const subject = encodeURIComponent("Message depuis le portfolio");
            const body = encodeURIComponent(
                `Nom : ${nom.value.trim()}\nEmail : ${email.value.trim()}\n\n${message.value.trim()}`
            );
            if (statusMessage) {
                statusMessage.textContent = "Votre messagerie va s’ouvrir avec le message. Pensez à confirmer l’envoi.";
                statusMessage.classList.remove("error");
            }
            window.location.href = `mailto:soumahorohamed1802@gmail.com?subject=${subject}&body=${body}`;
        } else if (statusMessage) {
            statusMessage.textContent = "Veuillez corriger les informations du formulaire.";
            statusMessage.classList.add("error");
        }
    });
}

// L'année affichée dans le pied de page suit automatiquement le calendrier.
const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

// Le spotlight suit la souris sans modifier le comportement du clavier.
document.querySelectorAll(
    ".skill-card, .project-card, .highlight-card, .stat-card, .timeline-content, .contact-form"
).forEach(card => {
    card.addEventListener("pointermove", event => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
    });
});
