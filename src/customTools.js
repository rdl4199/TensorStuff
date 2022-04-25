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
                <input class="button px-2 ml-3" id="strokestyle-chooser" type="color" value="#000000">
            </label>
    
            <label class="tag is-link is-large is-vcentered py-5">Line Width:
                <input class="ml-3" type="range" id="linewidth-chooser" name="points" min="1" max="100" value="1">
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

      this.shadowRoot.querySelector("#tool-chooser").onchange = doToolChange;
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