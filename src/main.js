import "./customFooter.js";
import "./customTools.js";
import "./customNav.js";
//import * as storage from "./localStorage.js";
import * as video from "./vid.js";

// mobile menu
const burgerIcon = document.querySelector("app-navbar").shadowRoot.querySelector("#burger");
const navbarMenu = document.querySelector("app-navbar").shadowRoot.querySelector("#nav-links");

burgerIcon.addEventListener("click", () => {
    navbarMenu.classList.toggle("is-active");
});

//If on the drawing page
if (document.querySelector("app-navbar").id == "nav-app") {
    //Execute initial drawing call here.
    //video.init();
}

//save extras to local storage.
//storage.localStorageRequirement();