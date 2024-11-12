document.addEventListener("DOMContentLoaded", function () {
    function scrollToTop() {
        const scrollToTopButton = document.querySelector("[data-scroll-to-top]");

        if (scrollToTopButton) {
            window.addEventListener("scroll", function () {
                if (window.scrollY > 100) {
                    scrollToTopButton.classList.add("scroll-to-top--visible");
                } else {
                    scrollToTopButton.classList.remove("scroll-to-top--visible");
                }
            });
        }
    }

    function toggleNavMenu() {
        const menuToggler = document.querySelector("[data-navbar-menu-toggler]");
        const navbarMenu = document.querySelector("[data-navbar-menu]");

        if (menuToggler && navbarMenu) {
            menuToggler.addEventListener("click", function () {
                navbarMenu.classList.toggle("navbar__menu--visible");
            });
        }
    }

    function toggleFaqAccordion() {
        document.body.addEventListener("click", function (event) {
            const button = event.target.closest("[data-accordion-button]");

            if (button) {
                console.log("Accordion button clicked", button);
                const accordion = button.closest("[data-accordion]");
                const contentId = button.getAttribute("data-accordion-button");
                const content = document.querySelector(`[data-accordion-content="${contentId}"]`);

                if (content) {
                    const expanded = button.getAttribute("aria-expanded") === "true";
                    accordion.classList.toggle("accordion--expanded");
                    button.setAttribute("aria-expanded", !expanded);
                }
            }
        });
    }

    scrollToTop();
    toggleNavMenu();
    toggleFaqAccordion();
});
