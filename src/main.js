import "./customFooter.js";
//import "./customHeader.js";
import "./customNav.js";
//import * as storage from "./localStorage.js";

// mobile menu
const burgerIcon = document.querySelector("app-navbar").shadowRoot.querySelector("#burger");
const navbarMenu = document.querySelector("app-navbar").shadowRoot.querySelector("#nav-links");

burgerIcon.addEventListener("click", () => {
    navbarMenu.classList.toggle("is-active");
});

//save extras to local storage.
//storage.localStorageRequirement();