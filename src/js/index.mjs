import { checkAccess, isUserLoggedIn, logout } from "./utils/auth.mjs";
import { displayUserName, displayUsername } from "./utils/display-user-info.mjs";
import { getUserInfo } from "./utils/storage.mjs";
import { redirectExpiredToken } from "./utils/redirect.mjs";

console.log("isUserLoggedIn:", isUserLoggedIn());

checkAccess();

function setupLogoutButton() {
    const logoutButton = document.querySelector('[data-logout]');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => logout());
    }
}

if (isUserLoggedIn()) {
    redirectExpiredToken();
    setupLogoutButton();
    displayUserName();
    displayUsername();
    console.log(getUserInfo());
}


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

function implementSelect() {
    let activeSelect = null; 

    document.body.addEventListener('click', (event) => {
        const toggler = event.target.closest('[data-select-toggler]');
        const option = event.target.closest('[data-select-option]');
        const select = event.target.closest('[data-select]');

        if (activeSelect && (!select || activeSelect !== select)) {
            closeSelect(activeSelect);
            activeSelect = null;
        }

        if (toggler) {
            event.stopPropagation();
            if (activeSelect && activeSelect !== select) {
                closeSelect(activeSelect);
            }
            const isExpanded = toggler.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeSelect(select);
                activeSelect = null;
            } else {
                openSelect(select);
                activeSelect = select;
            }
        }

        if (option) {
            const selectedValue = option.getAttribute('data-value');
            const optionText = option.textContent;

            const selectToggler = select.querySelector('[data-select-toggler]');
            selectToggler.textContent = optionText; 
            selectToggler.setAttribute('data-selected-value', selectedValue); 
            
            closeSelect(select);
            activeSelect = null;
        }
    });

    function closeSelect(select) {
        if (!select) return;
        const toggler = select.querySelector('[data-select-toggler]');
        const dropdown = select.querySelector('[data-select-dropdown]');
        toggler.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('select__dropdown--visible');
        toggler.classList.remove('select__selectToggler--active');
    }

    function openSelect(select) {
        if (!select) return;
        const toggler = select.querySelector('[data-select-toggler]');
        const dropdown = select.querySelector('[data-select-dropdown]');
        toggler.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('select__dropdown--visible');
        toggler.classList.add('select__selectToggler--active');
    }
}

function implementUserProfileDropdown() {
    const dropdown = document.querySelector("[data-user-profile-dropdown]");
    const dropdownToggler = document.querySelector("[data-user-profile-dropdown-toggler]");

    if (dropdown && dropdownToggler) {
        dropdownToggler.addEventListener("click", function () {
            dropdown.classList.toggle("user-profile-dropdown__content--visible");
        });
    }
}

function implementAddNewDropdown() {
    const dropdown = document.querySelector("[data-add-new-dropdown]");
    const dropdownToggler = document.querySelector("[data-add-new-dropdown-toggler]");

    if (dropdown && dropdownToggler) {
        dropdownToggler.addEventListener("click", function () {
            dropdown.classList.toggle("add-new-dropdown__content--visible");
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    scrollToTop();
    toggleNavMenu();
    toggleFaqAccordion();
    implementSelect();
    implementUserProfileDropdown();
    implementAddNewDropdown();
});