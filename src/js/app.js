function implementToggleAppSidebar() {
    const toggler = document.querySelector("[data-toggle-app-sidebar]");
    const sidebar = document.querySelector("[data-app-sidebar]");
    const pageContent = document.querySelector(".page__content");

    if (toggler && sidebar && pageContent) {
        console.log("has it? ", toggler.hasAttribute("data-toggle-app-sidebar"));
        console.log(toggler, sidebar, pageContent);
        console.log("Event listener attached");
        sidebar.classList.toggle("app-sidebar--toggled");
        pageContent.classList.toggle("page__content--toggled");
    }
}