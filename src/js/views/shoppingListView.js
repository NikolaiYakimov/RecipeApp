import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ShoppingListView extends View {
  _parentElement = document.querySelector('.shopping__list');
  _errorMessage = 'No recipes founded for your query.Please try again!';
  _successMessage = '';

  _generateMarkup() {
    return this._data
      .map(el => {
        return `
    <li class="shopping__item" data-itemid=${el.id}>
          <div class="shopping__count">
            <input type="number" value="${el.count}" step="${el.count}" class="shopping__count-value">
            <p>${el.unit}</p>
          </div>
          <p class="shopping__description">${el.ingredient}</p>
          <button class="shopping__delete btn-tiny">
            <svg>
              <!-- <use href="img/icons.svg#icon-circle-with-cross"></use> -->
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
