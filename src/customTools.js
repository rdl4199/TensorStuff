//painting tools component
const template_tools = document.createElement("template");
template_tools.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<style>

</style>
    <!--Painting Controls-->
        <div class="box" id="controls">
            <label>Tool:
                <select id="tool-chooser">
                    <option value="tool-pencil" selected>Pencil</option>
                    <option value="tool-eraser">Eraser</option>
                    <option value="tool-fill">Fill</option>
                </select>
            </label>
            
    
            <div class="dropdown">
            <div class="dropdown-trigger">
              <button class="button" aria-haspopup="true" aria-controls="dropdown-menu3">
                <span id="currentTool">Pencil</span>
                <span class="icon is-small">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu3" role="menu">
              <div class="dropdown-content" id="tool-chooser">
                <a class="dropdown-item is-active" value="tool-pencil">
                  Pencil
                </a>
                <a class="dropdown-item" value="tool-eraser">
                  Eraser
                </a>
                <a class="dropdown-item" value="tool-fill">
                  Fill
                </a>
              </div>
            </div>
          </div>



            <label>Stroke Color: 
                <select id="strokestyle-chooser">
                    <option value="black" selected>Black</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                </select>
            </label>
    
            <label>Line Width: 
                  <select id="linewidth-chooser">
              <option value="1" selected>1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
                </select>
            </label>
            
            <span><input id="btn-clear" type="button" value="Clear"/></span>
            <span><input id="btn-export" type="button" value="Export"/></span>
        </div>
    <!--End Painting Controls-->
`;

class appToolbar extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template_tools.content.cloneNode(true));
    }

    connectedCallback(){
      this.div = this.shadowRoot.querySelector("div");
      this.render();

      this.shadowRoot.querySelector("#linewidth-chooser").onchange = doLineWidthChange;
      this.shadowRoot.querySelector("#strokestyle-chooser").onchange = doLineColorChange;
      this.shadowRoot.querySelector("#btn-clear").onclick = doClear;
      this.shadowRoot.querySelector("#btn-export").onclick = doExport;

      let dropdown = this.shadowRoot.querySelector('.dropdown');
        dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown.classList.toggle('is-active');
        });
    }

    render(){
      //this.span.innerHTML = this.dataset.copyright;
    }
}  //class

customElements.define('app-toolbar', appToolbar);