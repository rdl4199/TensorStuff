//painting tools component
const template_tools = document.createElement("template");
template_tools.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<style>

</style>
    <!--Painting Controls-->
        <div class="box px-6" id="controls">
            <label class="tag is-link is-large is-vcentered py-5">Tool:
            <div>
                <select class="button px-2 ml-3" id="tool-chooser">
                    <option value="tool-pencil" selected>Pencil</option>
                    <option value="tool-eraser">Eraser</option>
                    <option value="tool-fill">Fill</option>
                </select>
            </div>
            </label>

            <label class="tag is-link is-large is-vcentered py-5">Stroke Color:
                <select class="button px-2 ml-3" id="strokestyle-chooser">
                    <option value="black" selected>Black</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                </select>
            </label>
    
            <label class="tag is-link is-large is-vcentered py-5">Line Width:
                  <select class="button px-4 ml-3" id="linewidth-chooser">
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
            
            <span><input class="button px-5 mx-2 is-pulled-right is-danger" id="btn-clear" type="button" value="Clear"/></span>
            <span><input class="button px-5 mx-1 is-pulled-right is-primary" id="btn-export" type="button" value="Export"/></span>
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
    }

    render(){
      //this.span.innerHTML = this.dataset.copyright;
    }
}  //class

customElements.define('app-toolbar', appToolbar);