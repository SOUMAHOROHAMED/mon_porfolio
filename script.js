/* =====================================================
   MENU MOBILE
===================================================== */

const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

if (menuToggle && navbar) {

    menuToggle.addEventListener("click", () => {

        navbar.classList.toggle("open");

        if (navbar.classList.contains("open")) {

            menuToggle.textContent = "✕";

        } else {

            menuToggle.textContent = "☰";

        }

    });

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("open");

            menuToggle.textContent = "☰";

        });

    });

}


/* =====================================================
   MODE SOMBRE
===================================================== */

const themeToggle =
    document.getElementById("theme-toggle");


if (themeToggle) {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent = "☀️";

    }


    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");


        const darkMode =
            document.body.classList.contains("dark-mode");


        if (darkMode) {

            themeToggle.textContent = "☀️";

            localStorage.setItem("theme", "dark");

        } else {

            themeToggle.textContent = "🌙";

            localStorage.setItem("theme", "light");

        }

    });

}


/* =====================================================
   BOUTON RETOUR EN HAUT
===================================================== */

const backToTop =
    document.getElementById("back-to-top");


if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });


    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/* =====================================================
   NAVIGATION ACTIVE
===================================================== */

const navLinks =
    document.querySelectorAll(".nav-link");

const sections =
    document.querySelectorAll("section");


window.addEventListener("scroll", () => {

    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 120;

        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {

            link.classList.add("active");

        }

    });

});


/* =====================================================
   ANIMATION DES SECTIONS
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".section-title, .about-container, .skill-card, .project-card, .timeline-item, .contact-container"
    );


revealElements.forEach(element => {

    element.classList.add("reveal");

});


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach(element => {

    observer.observe(element);

});


/* =====================================================
   BARRES DE COMPÉTENCES
===================================================== */

const progressBars =
    document.querySelectorAll(".progress");


const progressObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const width =
                        entry.target.dataset.width;

                    entry.target.style.width = width;

                }

            });

        },
        {
            threshold: 0.5
        }
    );


progressBars.forEach(bar => {

    progressObserver.observe(bar);

});


/* =====================================================
   EFFET DE FRAPPE
===================================================== */

const typingElement =
    document.getElementById("typing-text");


const text =
    "Administrateur de bases de données junior";


let index = 0;


function typeWriter() {

    if (!typingElement) {

        return;

    }

    if (index < text.length) {

        typingElement.textContent += text.charAt(index);

        index++;

        setTimeout(typeWriter, 50);

    }

}


/*
   On vide le texte HTML avant
   de lancer l'animation.
*/

if (typingElement) {

    typingElement.textContent = "";

    typeWriter();

}


/* =====================================================
   VALIDATION DU FORMULAIRE
===================================================== */

const form =
    document.getElementById("contact-form");

const statusMessage =
    document.querySelector(".form-status");


if (form) {

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const nom =
            document.getElementById("nom");

        const email =
            document.getElementById("email");

        const message =
            document.getElementById("message");


        let valid = true;


        if (statusMessage) {

            statusMessage.textContent = "";

            statusMessage.classList.remove("error");

        }


        /* Nettoyage des erreurs */

        document
            .querySelectorAll(".error-message")
            .forEach(error => {

                error.textContent = "";

            });


        /* Nom */

        if (nom.value.trim().length < 2) {

            nom
                .nextElementSibling
                .textContent =
                "Veuillez entrer votre nom.";

            valid = false;

        }


        /* Email */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email.value.trim())) {

            email
                .nextElementSibling
                .textContent =
                "Veuillez entrer une adresse email valide.";

            valid = false;

        }


        /* Message */

        if (message.value.trim().length < 10) {

            message
                .nextElementSibling
                .textContent =
                "Votre message doit contenir au moins 10 caractères.";

            valid = false;

        }


        /* Si tout est correct */

        if (valid) {

            const subject =
                encodeURIComponent("Message depuis le portfolio");

            const body =
                encodeURIComponent(
                    `Nom : ${nom.value.trim()}\nEmail : ${email.value.trim()}\n\n${message.value.trim()}`
                );

            if (statusMessage) {

                statusMessage.textContent =
                    "Votre messagerie va s’ouvrir avec le message. Pensez à confirmer l’envoi.";

                statusMessage.classList.remove("error");

            }

            window.location.href =
                `mailto:soumahorohamed1802@gmail.com?subject=${subject}&body=${body}`;

        } else if (statusMessage) {

            statusMessage.textContent =
                "Veuillez corriger les informations du formulaire.";

            statusMessage.classList.add("error");

        }

    });

}


/* =====================================================
   ANNÉE AUTOMATIQUE
===================================================== */

const currentYear =
    document.getElementById("current-year");


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}