import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ShoppingListView extends View {
  _parentElement = document.querySelector('.shopping__list');
  _errorMessage = 'No recipes founded for your query.Please try again!';
  _successMessage = '';

  addHandlerRemoveIngredient = function (handler) {
    this._parentElement.addEventListener('click', function (event) {
      //   console.log(_data);
      const item = event.target.closest('.shopping__item');
      if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        const id = item.dataset.itemid;
        handler(id);
      }
    });
  };

  addHandlerUpdateIngredient = function (handler) {
    this._parentElement.addEventListener('click', function (event) {
      const item = event.target.closest('.shopping__item');
      if (event.target.matches('.shopping__count-value')) {
        const id = item.dataset.itemid;
        const value = parseFloat(event.target.value);
        handler(id, value);
      }
    });
  };
  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map(el => {
        return `
    <li class="shopping__item" data-itemid=${el.id}>
          <div class="shopping__count">
            <input type="number" value="${
              el.quantity ? el.quantity : ''
            }" step="${el.quantity}" class="shopping__count-value">
            <p>${el.unit}</p>
          </div>
          <p class="shopping__description">${el.ingredient}</p>
          <button class="shopping__delete btn-tiny">
            <svg>
               <use href="${icons}#icon-circle-with-cross"></use>
               
            </svg>
          </button>
        </li>

    `;
      })
      .join('');
  }

  deleteItem(id) {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (!item) return;
    item.parentElement.removeChild(item);
  }
}
export default new ShoppingListView();
{
  /* <use href="${icons}#icon-circle-with-cross"></use>; */
}
