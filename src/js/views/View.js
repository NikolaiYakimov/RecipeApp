import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  //Get the data from the controller and render the generated Markup
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //Updates changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('😶‍🌫️', newEl.firstChild.nodeValue?.trim());
        curEl.textContent = newEl.textContent;
      }
      //Update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  //Listen for hash change event, and load the page with the url event,
  //Instead having a lot of events we have one arr, of the evens, and we loop for that event and cal the same func
  // ['hashchange', 'load'].forEach(event => {
  //   window.addEventListener(event, controlRecipes);
  // });

  renderError(message = this._errorMessage) {
    const markup = ` 
             <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = ` 
             <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> 
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner = function () {
    const markup = `
         <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
         </div>
            `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
}
