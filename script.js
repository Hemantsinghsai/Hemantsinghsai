/* ==========================================================
   Hemant Portfolio v4.0
   Author : Hemant Singh

   TABLE OF CONTENTS

   01. DOM Elements
   02. Loader
   03. Theme Toggle
   04. Scroll Progress
   05. Back To Top
   06. Cursor Glow

========================================================== */


/* ==========================================================
   01. DOM ELEMENTS
========================================================== */

const body = document.body;

const loader = document.getElementById("loader");

const progressBar = document.querySelector(".scroll-progress");

const backToTop = document.getElementById("backToTop");

const cursor = document.querySelector(".cursor-glow");

const themeToggle = document.querySelector(".theme-toggle");



/* ==========================================================
   02. LOADER
========================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hide");

    }, 600);

});



/* ==========================================================
   03. THEME
========================================================== */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

    body.classList.add("light");

    themeToggle.innerHTML =
        `<i class="fa-solid fa-sun"></i>`;

}

themeToggle.addEventListener("click", () => {

    body.classList.toggle("light");

    if (body.classList.contains("light")) {

        localStorage.setItem("theme", "light");

        themeToggle.innerHTML =
            `<i class="fa-solid fa-sun"></i>`;

    }

    else {

        localStorage.setItem("theme", "dark");

        themeToggle.innerHTML =
            `<i class="fa-solid fa-moon"></i>`;

    }

});



/* ==========================================================
   04. SCROLL PROGRESS
========================================================== */

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    const height =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        (scrollTop / height) * 100;

    progressBar.style.width = progress + "%";

});



/* ==========================================================
   05. BACK TO TOP
========================================================== */

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        backToTop.classList.add("show");

    }

    else {

        backToTop.classList.remove("show");

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});



/* ==========================================================
   06. CURSOR GLOW
========================================================== */

window.addEventListener("mousemove", e => {

    cursor.style.left = e.clientX + "px";

    cursor.style.top = e.clientY + "px";

});

window.addEventListener("mouseleave", () => {

    cursor.style.opacity = "0";

});

window.addEventListener("mouseenter", () => {

    cursor.style.opacity = "1";

});

/* ==========================================================
   07. MOBILE MENU
========================================================== */

const mobileMenu = document.querySelector(".mobile-menu");
const menuButton = document.querySelector(".mobile-menu-btn");
const closeButton = document.querySelector(".close-menu");

menuButton?.addEventListener("click", () => {

    mobileMenu.classList.add("open");

    body.style.overflow = "hidden";

});

closeButton?.addEventListener("click", closeMobileMenu);

function closeMobileMenu() {

    mobileMenu.classList.remove("open");

    body.style.overflow = "";

}

document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", closeMobileMenu);

});

window.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        closeMobileMenu();

    }

});


/* ==========================================================
   08. ACTIVE NAVIGATION
========================================================== */

const sections = document.querySelectorAll("main section[id]");

const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-menu a"
);

function updateActiveLink() {

    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {

        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPosition >= top && scrollPosition < bottom) {

            navLinks.forEach(link => {

                link.classList.remove("active");

                if (link.getAttribute("href") === "#" + id) {

                    link.classList.add("active");

                }

            });

        }

    });

}

window.addEventListener("scroll", updateActiveLink);

updateActiveLink();


/* ==========================================================
   09. SCROLL REVEAL
========================================================== */

const revealElements = document.querySelectorAll(

    ".project-card,\
     .highlight-card,\
     .skill-group,\
     .timeline-item,\
     .achievement-card,\
     .contact-card"

);

revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform = "translateY(40px)";

});

const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.style.opacity = "1";

            entry.target.style.transform = "translateY(0)";

            entry.target.style.transition =
                "opacity .8s ease, transform .8s ease";

            revealObserver.unobserve(entry.target);

        });

    },

    {

        threshold: 0.15

    }

);

revealElements.forEach(el => revealObserver.observe(el));


/* ==========================================================
   10. COMMAND PALETTE
========================================================== */

const commandPalette =
    document.querySelector(".command-palette");

const commandInput =
    document.querySelector(".command-window input");

document.addEventListener("keydown", e => {

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {

        e.preventDefault();

        commandPalette.style.display = "flex";

        commandInput.focus();

    }

});

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        commandPalette.style.display = "none";

    }

});

commandPalette.addEventListener("click", e => {

    if (e.target === commandPalette) {

        commandPalette.style.display = "none";

    }

});


/* ==========================================================
   11. SMOOTH INTERNAL LINKS
========================================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", e => {

        const href = link.getAttribute("href");

        if (href === "#") return;

        const target = document.querySelector(href);

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    });

});


/* ==========================================================
   12. HEADER EFFECT
========================================================== */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {

        header.style.background =
            "rgba(9,9,11,.82)";

        header.style.backdropFilter =
            "blur(24px)";

    }

    else {

        header.style.background =
            "rgba(9,9,11,.55)";

    }

});

/* ==========================================================
   13. COMMAND PALETTE NAVIGATION
========================================================== */

const commandResults = document.querySelector(".command-results");

const commands = [
    { title: "Home", target: "#hero" },
    { title: "Projects", target: "#projects" },
    { title: "About", target: "#about" },
    { title: "Skills", target: "#skills" },
    { title: "Journey", target: "#journey" },
    { title: "Contact", target: "#contact" }
];

function renderCommands(filter = "") {

    if (!commandResults) return;

    commandResults.innerHTML = "";

    const filtered = commands.filter(command =>
        command.title.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(command => {

        const item = document.createElement("button");

        item.className = "command-item";

        item.textContent = command.title;

        item.addEventListener("click", () => {

            document.querySelector(command.target)?.scrollIntoView({
                behavior: "smooth"
            });

            commandPalette.style.display = "none";

        });

        commandResults.appendChild(item);

    });

}

renderCommands();

commandInput?.addEventListener("input", e => {

    renderCommands(e.target.value);

});


/* ==========================================================
   14. REDUCED MOTION SUPPORT
========================================================== */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (prefersReducedMotion.matches) {

    document.documentElement.style.scrollBehavior = "auto";

    document.querySelectorAll("*").forEach(element => {

        element.style.animation = "none";
        element.style.transition = "none";

    });

}


/* ==========================================================
   15. LAZY IMAGE FADE-IN
========================================================== */

const images = document.querySelectorAll("img");

images.forEach(image => {

    image.loading = "lazy";

    image.decoding = "async";

    image.addEventListener("load", () => {

        image.classList.add("loaded");

    });

});


/* ==========================================================
   16. SIMPLE THROTTLE
========================================================== */

function throttle(callback, delay) {

    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

}


/* ==========================================================
   17. WINDOW RESIZE
========================================================== */

window.addEventListener(

    "resize",

    throttle(() => {

        if (window.innerWidth > 900) {

            closeMobileMenu();

        }

    }, 150)

);


/* ==========================================================
   18. KEYBOARD SHORTCUTS
========================================================== */

document.addEventListener("keydown", e => {

    if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
    ) {
        return;
    }

    switch (e.key.toLowerCase()) {

        case "h":
            document.querySelector("#hero")?.scrollIntoView({
                behavior: "smooth"
            });
            break;

        case "p":
            document.querySelector("#projects")?.scrollIntoView({
                behavior: "smooth"
            });
            break;

        case "a":
            document.querySelector("#about")?.scrollIntoView({
                behavior: "smooth"
            });
            break;

        case "c":
            document.querySelector("#contact")?.scrollIntoView({
                behavior: "smooth"
            });
            break;

    }

});


/* ==========================================================
   19. ACCESSIBILITY
========================================================== */

document.querySelectorAll("a").forEach(link => {

    if (
        link.target === "_blank" &&
        !link.rel.includes("noopener")
    ) {

        link.rel = "noopener noreferrer";

    }

});


/* ==========================================================
   20. INITIALIZATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderCommands();

    updateActiveLink();

    console.log(
        "%cHemant Portfolio v4.0",
        "color:#6366f1;font-size:18px;font-weight:bold;"
    );

    console.log(
        "Built with HTML, CSS & Vanilla JavaScript"
    );

});
