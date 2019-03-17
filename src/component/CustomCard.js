const currentDocument = document.currentScript.ownerDocument;

class CustomCard extends HTMLElement {
  constructor() {
    // If you define a constructor, always call super() first as it is required by the CE spec.
    super();
  }

  getDataJson = async (type) => {
    let response = await fetch(`data/${type}-data.json`);
    let json = await response.json();
    return json;
  }

  // Called when element is inserted in DOM
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // Select the template and clone it. Finally attach the cloned node to the shadowDOM's root.
    // Current document needs to be defined to get DOM access to imported HTML
    const template = currentDocument.querySelector('#custom-card-template');
    const instance = template.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    this.render(this.getAttribute('type'));

  }

  render(type) {

    this.getDataJson(type).then((data) => {

      this.shadowRoot.querySelector('.card__container-right-header').innerHTML = "Smartphone";
      this.shadowRoot.querySelector('.card__container-right-header').style.color = data.dark;
      this.shadowRoot.querySelector('.card__container-left-header').innerHTML = "Tablet";
      this.shadowRoot.querySelector('.card__container-left-header').style.color = data.light;
      this.shadowRoot.querySelector('.card__container-left-text').innerHTML = `
        <span class="dark-text">${data.device.Tablet.percentage}<span>
        <span class="grey-text">${data.device.Tablet.value}<span>
      `;
      this.shadowRoot.querySelector('.card__container-right-text').innerHTML = `
        <span class="dark-text">${data.device.Smartphone.percentage}<span>
        <span class="grey-text">${data.device.Smartphone.value}<span>
      `;
      
  
      var donut = DonutChart()
        .width(300)
        .height(240)
        .variable('prob')
        .category('species')
        .lightColor(data.light)
        .darkColor(data.dark)
        .sales(data.sales)
        .type(data.key)
        .total(data.total);
  
      d3.tsv(`./data/${type}.tsv`, (error, data) => {
        if (error) throw error;
  
        let nestData = d3.nest()
          .key(function(d) { return d.time; })
          .entries(data);
  
        donut.data(nestData[0].values);
  
        d3.select(this.shadowRoot.querySelector('#chart'))
          .call(donut);
      });

    });

  }
}

customElements.define('custom-card', CustomCard);