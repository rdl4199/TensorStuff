//app-navbar component
const template_nav = document.createElement("template");
template_nav.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<nav class="navbar has-shadow is-white">
    <!-- logo / brand -->
    <div class="navbar-brand">
      <a class="navbar-item" href="home.html">
      <img src="/images/color-palette.png" alt="palette icon">
      </a>
      <a class="navbar-burger" id="burger">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>

    <div class="navbar-menu" id="nav-links">
      <div class="navbar-start">
        <a class="navbar-item is-hoverable" href="home.html" id="home">
          Home
        </a>
      
        <a class="navbar-item is-hoverable" href="index.html" id="app">
          Draw
        </a>
      
        <a class="navbar-item is-hoverable" href="documentation.html" id="doc">
          Documentation
        </a>
      </div> <!-- end navbar-start -->
    </div>
</nav>
`;

class appNavbar extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template_nav.content.cloneNode(true));
    }
    
    connectedCallback(){
        
      //tell user what page they're on.
      switch(document.querySelector("app-navbar").id) {
        case "nav-home":
            document.querySelector("app-navbar").shadowRoot.querySelector("#home").classList.add('has-background-light');
            document.querySelector("app-navbar").shadowRoot.querySelector("#home").classList.add('has-text-weight-semibold');
          break;
        case "nav-app":
            document.querySelector("app-navbar").shadowRoot.querySelector("#app").classList.add('has-background-light');
            document.querySelector("app-navbar").shadowRoot.querySelector("#app").classList.add('has-text-weight-semibold');
          break;
        case "nav-documentation":
            document.querySelector("app-navbar").shadowRoot.querySelector("#doc").classList.add('has-background-light');
            document.querySelector("app-navbar").shadowRoot.querySelector("#doc").classList.add('has-text-weight-semibold');
          break;
      }
    }
}  //class

customElements.define('app-navbar', appNavbar);