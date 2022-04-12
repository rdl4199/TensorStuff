//footer component
const template_footer = document.createElement("template");
template_footer.innerHTML = `
<style>
div{
    color: white;
    background-color: black;
    padding: .5rem;
    margin-top: .5rem;
}
</style>
<footer>
  <span></span>
  <br>
  <a href="https://www.flaticon.com/free-icons/drawing" title="drawing icons">Drawing icons created by Freepik - Flaticon</a>
</footer>
`;

class STFooter extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template_footer.content.cloneNode(true));
    }

    connectedCallback(){
      this.span = this.shadowRoot.querySelector("span");
      this.render();
    }

    render(){
      this.span.innerHTML = this.dataset.copyright;
    }
}  //class

customElements.define('st-footer', STFooter);